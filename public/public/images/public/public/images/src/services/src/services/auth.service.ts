import {
  signInWithPopup,
  signInAnonymously,
  signOut,
  User,
  onAuthStateChanged,
  GoogleAuthProvider
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../config/firebase.config';
import { UserProfile, UserStats } from '../types/user.types';

/**
 * Generate unique referral code
 */
const generateReferralCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Create new user profile in Firestore
 */
export const createUserProfile = async (user: User, referredBy?: string): Promise<UserProfile> => {
  const userRef = doc(db, 'users', user.uid);
  const walletRef = doc(db, 'wallets', user.uid);

  const newProfile: UserProfile = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || 'User',
    photoURL: user.photoURL,
    isAnonymous: user.isAnonymous,
    role: 'user',
    referralCode: generateReferralCode(),
    referredBy: referredBy || null,
    createdAt: Date.now(),
    lastActive: Date.now(),
    isBanned: false,
    warningCount: 0,
    language: 'en',
    notificationsEnabled: true
  };

  // Create user document
  await setDoc(userRef, newProfile);

  // Create wallet document
  await setDoc(walletRef, {
    coins: 0,
    pendingCoins: 0,
    totalEarned: 0,
    totalWithdrawn: 0,
    createdAt: Date.now()
  });

  // Create user stats
  await setDoc(doc(db, 'userStats', user.uid), {
    totalEarned: 0,
    totalWithdrawn: 0,
    tasksCompleted: 0,
    adsWatched: 0,
    spinsUsed: 0,
    referralCount: 0,
    currentStreak: 0,
    lastCheckInDate: null
  } as UserStats);

  return newProfile;
};

/**
 * Get user profile from Firestore
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (uid: string, data: Partial<UserProfile>): Promise<boolean> => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...data,
      lastActive: Date.now()
    });
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
};

/**
 * Sign in with Google
 */
export const signInWithGoogle = async (): Promise<{ user: User | null; error: string | null }> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error: any) {
    console.error('Google sign-in error:', error);
    return { user: null, error: error.message || 'Login failed' };
  }
};

/**
 * Sign in anonymously (Guest mode)
 */
export const signInAsGuest = async (): Promise<{ user: User | null; error: string | null }> => {
  try {
    const result = await signInAnonymously(auth);
    return { user: result.user, error: null };
  } catch (error: any) {
    console.error('Guest sign-in error:', error);
    return { user: null, error: error.message || 'Guest login failed' };
  }
};

/**
 * Sign out current user
 */
export const logoutUser = async (): Promise<boolean> => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
};

/**
 * Check if user exists (for referral validation)
 */
export const checkUserExists = async (uid: string): Promise<boolean> => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    return userSnap.exists();
  } catch (error) {
    return false;
  }
};

/**
 * Get current auth user
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

export default {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  signInWithGoogle,
  signInAsGuest,
  logoutUser,
  checkUserExists,
  getCurrentUser
};
