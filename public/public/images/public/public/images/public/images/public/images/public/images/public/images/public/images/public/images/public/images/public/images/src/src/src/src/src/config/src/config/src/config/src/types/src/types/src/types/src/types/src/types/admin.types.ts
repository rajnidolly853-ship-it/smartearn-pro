import { UserRole } from './user.types';

export interface AdminStats {
  totalUsers: number;
  activeUsersToday: number;
  totalPayouts: number; // Real currency
  pendingWithdrawals: number; // Count
  totalRevenue: number; // Estimated ad revenue
}

export interface SystemConfig {
  maintenanceMode: boolean;
  minWithdrawal: number;
  adLimitPerDay: number;
  coinRate: number; // Coins per 1 INR/USD
  announcement?: string;
  version: string;
  forceUpdate: boolean;
}

export interface BanRequest {
  userId: string;
  reason: string;
  bannedBy: string; // Admin UID
  timestamp: number;
}

export interface AdminUserUpdate {
  uid: string;
  role?: UserRole;
  isBanned?: boolean;
  walletAdjustment?: number;
}
