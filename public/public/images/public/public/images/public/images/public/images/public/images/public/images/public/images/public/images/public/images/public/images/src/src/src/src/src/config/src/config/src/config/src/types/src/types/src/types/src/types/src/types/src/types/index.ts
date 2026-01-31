export * from './user.types';
export * from './wallet.types';
export * from './task.types';
export * from './referral.types';
export * from './admin.types';

// Generic API Response Wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
