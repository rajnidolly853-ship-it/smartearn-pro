import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  increment
} from 'firebase/firestore';
import { db } from '../config/firebase.config';
import { APP_CONFIG } from '../config/app.config';
import { addCoins } from './wallet.service';
import { ReferralData, ReferralUser } from '../types/referral.types';

/**
 * Generate unique referral code
 */
export const generateReferralCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars (0,O,1,I)
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

/**
 * Get user's referral data
 */
export const getReferralData = async (userId: string): Promise<ReferralData | null> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return null;
    }

    const userData = userSnap.data();
    const referralCode = userData.referralCode;

    // Get referral stats
    const statsRef = doc(db, 'referralStats', userId);
    const statsSnap = await getDoc(statsRef);

    let totalInvites = 0;
    let totalEarnings = 0;

    if (statsSnap.exists()) {
      const stats = statsSnap.data();
      totalInvites = stats.totalInvites || 0;
      totalEarnings = stats.totalEarnings || 0;
    }

    // Generate share link
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/?ref=${referralCode}`;

    return {
      code: referralCode,
      totalInvites,
      totalEarnings,
      link
    };
  } catch (error) {
    console.error('Error getting referral data:', error);
    return null;
  }
};

/**
 * Validate referral code
 */
export const validateReferralCode = async (code: string): Promise<{
  valid: boolean;
  referrerId?: string;
  error?: string;
}> => {
  try {
    if (!code || code.length !== 6) {
      return { valid: false, error: 'Invalid referral code format' };
    }

    // Find user with this referral code
    const q = query(
      collection(db, 'users'),
      where('referralCode', '==', code.toUpperCase())
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return { valid: false, error: 'Referral code not found' };
    }

    const referrer = snapshot.docs[0];
    return { valid: true, referrerId: referrer.id };
  } catch (error) {
    console.error('Error validating referral code:', error);
    return { valid: false, error: 'Validation failed' };
  }
};

/**
 * Apply referral (called when new user signs up with referral code)
 */
export const applyReferral = async (
  newUserId: string,
  referralCode: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Validate code
    const validation = await validateReferralCode(referralCode);
    if (!validation.valid || !validation.referrerId) {
      return { success: false, error: validation.error };
    }

    const referrerId = validation.referrerId;

    // Prevent self-referral
    if (referrerId === newUserId) {
      return { success: false, error: 'Cannot use your own referral code' };
    }

    // Check if new user already has a referrer
    const newUserRef = doc(db, 'users', newUserId);
    const newUserSnap = await getDoc(newUserRef);

    if (newUserSnap.exists() && newUserSnap.data().referredBy) {
      return { success: false, error: 'Referral already applied' };
    }

    // Update new user's referredBy field
    await updateDoc(newUserRef, {
      referredBy: referrerId
    });

    // Add to referrals collection
    await addDoc(collection(db, 'referrals'), {
      referrerId,
      refereeId: newUserId,
      status: 'pending', // Will be 'active' after first earning
      createdAt: Date.now(),
      bonusPaid: false
    });

    // Update referrer's stats
    const statsRef = doc(db, 'referralStats', referrerId);
    const statsSnap = await getDoc(statsRef);

    if (statsSnap.exists()) {
      await updateDoc(statsRef, {
        totalInvites: increment(1)
      });
    } else {
      await setDoc(statsRef, {
        totalInvites: 1,
        totalEarnings: 0,
        activeReferees: 0
      });
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error applying referral:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Pay referral bonuses (called when referee completes first task)
 */
export const payReferralBonus = async (
  refereeId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Get referee's referrer
    const userRef = doc(db, 'users', refereeId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists() || !userSnap.data().referredBy) {
      return { success: false, error: 'No referrer found' };
    }

    const referrerId = userSnap.data().referredBy;

    // Check if bonus already paid
    const q = query(
      collection(db, 'referrals'),
      where('referrerId', '==', referrerId),
      where('refereeId', '==', refereeId),
      where('bonusPaid', '==', false)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return { success: false, error: 'Bonus already paid or referral not found' };
    }

    const referralDoc = snapshot.docs[0];

    // Pay bonus to referrer
    await addCoins(
      referrerId,
      APP_CONFIG.EARNING.REFERRAL.BONUS_REFERRER,
      'referral_bonus',
      `Referral bonus for inviting a new user`
    );

    // Pay bonus to referee
    await addCoins(
      refereeId,
      APP_CONFIG.EARNING.REFERRAL.BONUS_REFEREE,
      'referral_bonus',
      `Welcome bonus for joining via referral`
    );

    // Update referral document
    await updateDoc(doc(db, 'referrals', referralDoc.id), {
      status: 'active',
      bonusPaid: true,
      bonusPaidAt: Date.now()
    });

    // Update referrer's stats
    const statsRef = doc(db, 'referralStats', referrerId);
    await updateDoc(statsRef, {
      totalEarnings: increment(APP_CONFIG.EARNING.REFERRAL.BONUS_REFERRER),
      activeReferees: increment(1)
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error paying referral bonus:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get list of referred users
 */
export const getReferredUsers = async (userId: string): Promise<ReferralUser[]> => {
  try {
    const q = query(
      collection(db, 'referrals'),
      where('referrerId', '==', userId)
    );

    const snapshot = await getDocs(q);
    const referrals: ReferralUser[] = [];

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      const refereeId = data.refereeId;

      // Get referee's profile
      const refereeRef = doc(db, 'users', refereeId);
      const refereeSnap = await getDoc(refereeRef);

      if (refereeSnap.exists()) {
        const refereeData = refereeSnap.data();
        referrals.push({
          uid: refereeId,
          displayName: refereeData.displayName || 'User',
          photoURL: refereeData.photoURL || null,
          joinedAt: data.createdAt,
          status: data.status,
          earningsGenerated: data.earningsGenerated || 0
        });
      }
    }

    return referrals;
  } catch (error) {
    console.error('Error getting referred users:', error);
    return [];
  }
};

/**
 * Generate share message
 */
export const getShareMessage = (code: string, link: string): string => {
  return `🎉 Join SmartEarn Pro and start earning real money!\n\n` +
    `✅ Watch ads & earn\n` +
    `✅ Daily check-in bonus\n` +
    `✅ Spin & win coins\n` +
    `✅ Withdraw to UPI/Paytm\n\n` +
    `Use my referral code: ${code}\n` +
    `Or click: ${link}\n\n` +
    `Download now! 💰`;
};

export default {
  generateReferralCode,
  getReferralData,
  validateReferralCode,
  applyReferral,
  payReferralBonus,
  getReferredUsers,
  getShareMessage
};
