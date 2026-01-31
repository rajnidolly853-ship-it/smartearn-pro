export type UserRole = 'user' | 'admin' | 'moderator';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
  phoneNumber?: string | null;
  
  // App Specific Data
  role: UserRole;
  referralCode: string;
  referredBy?: string | null; // UID of the referrer
  
  // Activity Stats
  createdAt: number; // Timestamp
  lastActive: number; // Timestamp
  lastLoginIp?: string;
  
  // Fraud Prevention
  deviceId?: string;
  isBanned: boolean;
  banReason?: string;
  warningCount: number;
  
  // Notification
  fcmToken?: string;
  
  // Preferences
  language: 'en' | 'hi';
  notificationsEnabled: boolean;
}

export interface UserStats {
  totalEarned: number;
  totalWithdrawn: number;
  tasksCompleted: number;
  adsWatched: number;
  spinsUsed: number;
  referralCount: number;
  currentStreak: number; // Daily check-in streak
  lastCheckInDate?: string; // ISO Date String YYYY-MM-DD
}
