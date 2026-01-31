import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut, signInAnonymously } from 'firebase/auth';
import { auth, googleProvider, db } from '../config/firebase.config';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { UserProfile } from '../types/user.types';
import { useNotification } from './NotificationContext';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showNotification } = useNotification();

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        await fetchUserProfile(currentUser);
      } else {
        setUserProfile(null);
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchUserProfile = async (currentUser: User) => {
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data() as UserProfile;
        
        // Check for ban
        if (data.isBanned) {
          await signOut(auth);
          showNotification('Your account has been suspended.', 'error');
          return;
        }

        setUserProfile(data);
        
        // Update last active
        await updateDoc(userRef, { lastActive: Date.now() });
      } else {
        // Create new profile if doesn't exist
        await createUserProfile(currentUser);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const createUserProfile = async (currentUser: User) => {
    const newProfile: UserProfile = {
      uid: currentUser.uid,
      email: currentUser.email,
      displayName: currentUser.displayName || 'Guest User',
      photoURL: currentUser.photoURL,
      isAnonymous: currentUser.isAnonymous,
      role: 'user',
      referralCode: generateReferralCode(),
      createdAt: Date.now(),
      lastActive: Date.now(),
      isBanned: false,
      warningCount: 0,
      language: 'en',
      notificationsEnabled: true
    };

    await setDoc(doc(db, 'users', currentUser.uid), newProfile);
    setUserProfile(newProfile);
  };

  const generateReferralCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      await signInWithPopup(auth, googleProvider);
      showNotification('Successfully logged in!', 'success');
    } catch (error: any) {
      showNotification(error.message || 'Login failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsGuest = async () => {
    try {
      setIsLoading(true);
      await signInAnonymously(auth);
      showNotification('Logged in as Guest', 'info');
    } catch (error: any) {
      showNotification('Guest login failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
      showNotification('Logged out successfully', 'success');
    } catch (error) {
      console.error('Logout error', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      isAuthenticated: !!user && !user.isAnonymous,
      isGuest: !!user && user.isAnonymous,
      isLoading,
      loginWithGoogle,
      loginAsGuest,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
