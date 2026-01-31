export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  THEME: 'app_theme',
  LANGUAGE: 'app_language',
  LAST_AD_WATCH: 'last_ad_watch_time',
  DAILY_SPINS: 'daily_spins_count',
  LAST_CHECKIN: 'last_checkin_date',
};

export const API_ENDPOINTS = {
  VERIFY_AD: '/verify-ad-reward', // If using backend
};

export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Please check your internet connection.',
  UNAUTHORIZED: 'You must be logged in to perform this action.',
  INSUFFICIENT_FUNDS: 'You do not have enough coins to withdraw.',
};

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
};

// Animation Variants Names
export const ANIMATIONS = {
  PAGE_TRANSITION: 'pageTransition',
  FADE_IN: 'fadeIn',
  SLIDE_UP: 'slideUp',
};
