import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  increment,
  writeBatch
} from 'firebase/firestore';
import { db } from '../config/firebase.config';
import { UserProfile } from '../types/user.types';
import { WithdrawalRequest, TransactionStatus } from '../types/wallet.types';
import { AdminStats, SystemConfig } from '../types/admin.types';
import { addCoins } from './wallet.service';
import { createNotification, NotificationTemplates } from './notification.service';

/**
 * Check if user is admin
 */
export const isAdmin = async (userId: string): Promise<boolean> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data().role === 'admin';
    }
    return false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

/**
 * Get admin dashboard stats
 */
export const getAdminStats = async (): Promise<AdminStats | null> => {
  try {
    // Get total users
    const usersQuery = query(collection(db, 'users'));
    const usersSnap = await getDocs(usersQuery);
    const totalUsers = usersSnap.size;

    // Get active users today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();

    const activeQuery = query(
      collection(db, 'users'),
      where('lastActive', '>=', todayTimestamp)
    );
    const activeSnap = await getDocs(activeQuery);
    const activeUsersToday = activeSnap.size;

    // Get pending withdrawals
    const pendingQuery = query(
      collection(db, 'withdrawals'),
      where('status', '==', 'pending')
    );
    const pendingSnap = await getDocs(pendingQuery);
    const pendingWithdrawals = pendingSnap.size;

    // Get total payouts
    const paidQuery = query(
      collection(db, 'withdrawals'),
      where('status', '==', 'paid')
    );
    const paidSnap = await getDocs(paidQuery);
    let totalPayouts = 0;
    paidSnap.forEach((doc) => {
      totalPayouts += doc.data().currencyAmount || 0;
    });

    return {
      totalUsers,
      activeUsersToday,
      totalPayouts,
      pendingWithdrawals,
      totalRevenue: 0 // Would need AdMob integration for this
    };
  } catch (error) {
    console.error('Error getting admin stats:', error);
    return null;
  }
};

/**
 * Get pending withdrawal requests
 */
export const getPendingWithdrawals = async (limitCount: number = 50): Promise<WithdrawalRequest[]> => {
  try {
    const q = query(
      collection(db, 'withdrawals'),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'asc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    })) as unknown as WithdrawalRequest[];
  } catch (error) {
    console.error('Error getting pending withdrawals:', error);
    return [];
  }
};

/**
 * Approve withdrawal request
 */
export const approveWithdrawal = async (
  withdrawalId: string,
  adminId: string,
  transactionId?: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const withdrawalRef = doc(db, 'withdrawals', withdrawalId);
    const withdrawalSnap = await getDoc(withdrawalRef);

    if (!withdrawalSnap.exists()) {
      return { success: false, error: 'Withdrawal not found' };
    }

    const withdrawal = withdrawalSnap.data();

    if (withdrawal.status !== 'pending') {
      return { success: false, error: 'Withdrawal already processed' };
    }

    // Update withdrawal status
    await updateDoc(withdrawalRef, {
      status: 'paid',
      processedAt: Date.now(),
      processedBy: adminId,
      transactionId: transactionId || null
    });

    // Update user's wallet totalWithdrawn
    const walletRef = doc(db, 'wallets', withdrawal.userId);
    await updateDoc(walletRef, {
      totalWithdrawn: increment(withdrawal.amount)
    });

    // Send notification to user
    const notification = NotificationTemplates.WITHDRAWAL_APPROVED(`₹${withdrawal.currencyAmount}`);
    await createNotification(
      withdrawal.userId,
      notification.title,
      notification.message,
      'withdrawal'
    );

    return { success: true };
  } catch (error: any) {
    console.error('Error approving withdrawal:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Reject withdrawal request
 */
export const rejectWithdrawal = async (
  withdrawalId: string,
  adminId: string,
  reason: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const withdrawalRef = doc(db, 'withdrawals', withdrawalId);
    const withdrawalSnap = await getDoc(withdrawalRef);

    if (!withdrawalSnap.exists()) {
      return { success: false, error: 'Withdrawal not found' };
    }

    const withdrawal = withdrawalSnap.data();

    if (withdrawal.status !== 'pending') {
      return { success: false, error: 'Withdrawal already processed' };
    }

    // Update withdrawal status
    await updateDoc(withdrawalRef, {
      status: 'rejected',
      processedAt: Date.now(),
      processedBy: adminId,
      rejectionReason: reason
    });

    // Refund coins to user's wallet
    const walletRef = doc(db, 'wallets', withdrawal.userId);
    await updateDoc(walletRef, {
      coins: increment(withdrawal.amount)
    });

    // Send notification to user
    const notification = NotificationTemplates.WITHDRAWAL_REJECTED(reason);
    await createNotification(
      withdrawal.userId,
      notification.title,
      notification.message,
      'withdrawal'
    );

    return { success: true };
  } catch (error: any) {
    console.error('Error rejecting withdrawal:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Ban a user
 */
export const banUser = async (
  userId: string,
  adminId: string,
  reason: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      isBanned: true,
      banReason: reason,
      bannedAt: Date.now(),
      bannedBy: adminId
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error banning user:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Unban a user
 */
export const unbanUser = async (userId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      isBanned: false,
      banReason: null,
      bannedAt: null,
      bannedBy: null
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error unbanning user:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Adjust user's wallet (add or remove coins)
 */
export const adjustUserWallet = async (
  userId: string,
  amount: number,
  reason: string,
  adminId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    if (amount > 0) {
      await addCoins(userId, amount, 'admin_adjustment', `Admin adjustment: ${reason}`);
    } else {
      // For deduction
      const walletRef = doc(db, 'wallets', userId);
      await updateDoc(walletRef, {
        coins: increment(amount) // amount is negative
      });
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error adjusting wallet:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get system config
 */
export const getSystemConfig = async (): Promise<SystemConfig | null> => {
  try {
    const configRef = doc(db, 'system', 'config');
    const configSnap = await getDoc(configRef);

    if (configSnap.exists()) {
      return configSnap.data() as SystemConfig;
    }
    return null;
  } catch (error) {
    console.error('Error getting system config:', error);
    return null;
  }
};

/**
 * Update system config
 */
export const updateSystemConfig = async (
  updates: Partial<SystemConfig>
): Promise<{ success: boolean; error?: string }> => {
  try {
    const configRef = doc(db, 'system', 'config');
    await updateDoc(configRef, updates);
    return { success: true };
  } catch (error: any) {
    console.error('Error updating system config:', error);
    return { success: false, error: error.message };
  }
};

export default {
  isAdmin,
  getAdminStats,
  getPendingWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
  banUser,
  unbanUser,
  adjustUserWallet,
  getSystemConfig,
  updateSystemConfig
};
