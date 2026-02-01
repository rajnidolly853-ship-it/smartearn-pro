import { useState, useEffect, useCallback } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase.config';
import {
  signInWithGoogle,
  signInAsGuest,
  logoutUser,
  getUserProfile,
  createUserProfile,
  updateUserProfile
} from '../services/auth.service';
import { UserProfile } from '../types/user.types';
import { useNotification } from '../context/NotificationContext';
import { applyReferral } from '../services/referral.service';
import { getDeviceId, isFirstLaunch } from '../services/storage.service';
import { checkDeviceLimit } from '../services/fraudPrevention.service';

interface UseAuthReturn {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isGuest: boolean;
  error: string | null;
  loginWithGoogle: (referralCode?: string) => Promise<boolean>;
  loginAsGuest: () => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { showNotification } = useNotification();

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        await loadUserProfile(currentUser);
      } else {
        setProfile(null);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Load user profile from Firestore
  const loadUserProfile = async (currentUser: User) => {
    try {
      let userProfile = await getUserProfile(currentUser.uid);

      if (!userProfile) {
        // New user - create profile
        userProfile = await createUserProfile(currentUser);
      }

      // Check if banned
      if (userProfile.isBanned) {
        await logoutUser();
        showNotification('Your account has been suspended.', 'error');
        setProfile(null);
        return;
      }

      // Device fraud check
      const deviceCheck = await checkDeviceLimit(currentUser.uid);
      if (!deviceCheck.allowed) {
        showNotification(deviceCheck.reason || 'Device limit exceeded', 'error');
      }

      setProfile(userProfile);
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Failed to load profile');
    }
  };

  // Google login
  const loginWithGoogle = useCallback(async (referralCode?: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signInWithGoogle();

      if (result.error) {
        setError(result.error);
        showNotification(result.error, 'error');
        return false;
      }

      if (result.user) {
        // Apply referral if provided
        if (referralCode && isFirstLaunch()) {
          await applyReferral(result.user.uid, referralCode);
        }

        showNotification('Welcome back!', 'success');
        return true;
      }

      return false;
    } catch (err: any) {
      setError(err.message);
      showNotification('Login failed', 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  // Guest login
  const loginAsGuest = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signInAsGuest();

      if (result.error) {
        setError(result.error);
        showNotification(result.error, 'error');
        return false;
      }

      showNotification('Logged in as Guest. Some features are limited.', 'info');
      return true;
    } catch (err: any) {
      setError(err.message);
      showNotification('Guest login failed', 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  // Logout
  const logout = useCallback(async (): Promise<void> => {
    try {
      await logoutUser();
      setUser(null);
      setProfile(null);
      showNotification('Logged out successfully', 'success');
    } catch (err) {
      showNotification('Logout failed', 'error');
    }
  }, [showNotification]);

  // Update profile
  const updateProfile = useCallback(async (data: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false;

    try {
      const success = await updateUserProfile(user.uid, data);
      if (success && profile) {
        setProfile({ ...profile, ...data });
        showNotification('Profile updated', 'success');
      }
      return success;
    } catch (err) {
      showNotification('Update failed', 'error');
      return false;
    }
  }, [user, profile, showNotification]);

  // Refresh profile
  const refreshProfile = useCallback(async (): Promise<void> => {
    if (user) {
      await loadUserProfile(user);
    }
  }, [user]);

  return {
    user,
    profile,
    isLoading,
    isAuthenticated: !!user && !user.isAnonymous,
    isGuest: !!user?.isAnonymous,
    error,
    loginWithGoogle,
    loginAsGuest,
    logout,
    updateProfile,
    refreshProfile
  };
};

export default useAuth;
