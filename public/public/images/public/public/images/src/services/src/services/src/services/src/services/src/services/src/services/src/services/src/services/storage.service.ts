/**
 * Storage Service
 * Enhanced localStorage wrapper with expiry, JSON parsing, and error handling
 */

const PREFIX = 'smartearn_';

interface StorageItem<T> {
  value: T;
  expiry?: number; // Timestamp when item expires
}

/**
 * Set item in localStorage
 * @param key Storage key
 * @param value Value to store
 * @param expiryMinutes Optional expiry time in minutes
 */
export const setItem = <T>(key: string, value: T, expiryMinutes?: number): boolean => {
  try {
    const item: StorageItem<T> = {
      value,
      expiry: expiryMinutes ? Date.now() + expiryMinutes * 60 * 1000 : undefined
    };
    localStorage.setItem(PREFIX + key, JSON.stringify(item));
    return true;
  } catch (error) {
    console.error('Storage setItem error:', error);
    return false;
  }
};

/**
 * Get item from localStorage
 * @param key Storage key
 * @param defaultValue Default value if not found or expired
 */
export const getItem = <T>(key: string, defaultValue: T | null = null): T | null => {
  try {
    const itemStr = localStorage.getItem(PREFIX + key);
    if (!itemStr) {
      return defaultValue;
    }

    const item: StorageItem<T> = JSON.parse(itemStr);

    // Check expiry
    if (item.expiry && Date.now() > item.expiry) {
      localStorage.removeItem(PREFIX + key);
      return defaultValue;
    }

    return item.value;
  } catch (error) {
    console.error('Storage getItem error:', error);
    return defaultValue;
  }
};

/**
 * Remove item from localStorage
 */
export const removeItem = (key: string): boolean => {
  try {
    localStorage.removeItem(PREFIX + key);
    return true;
  } catch (error) {
    console.error('Storage removeItem error:', error);
    return false;
  }
};

/**
 * Clear all app-related items from localStorage
 */
export const clearAll = (): boolean => {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
    return true;
  } catch (error) {
    console.error('Storage clearAll error:', error);
    return false;
  }
};

/**
 * Check if key exists and is not expired
 */
export const hasItem = (key: string): boolean => {
  return getItem(key) !== null;
};

/**
 * Get all keys with our prefix
 */
export const getAllKeys = (): string[] => {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(PREFIX)) {
      keys.push(key.replace(PREFIX, ''));
    }
  }
  return keys;
};

// ========================================
// 🎮 SESSION STORAGE (Temporary Data)
// ========================================

export const session = {
  set: <T>(key: string, value: T): boolean => {
    try {
      sessionStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  },

  get: <T>(key: string, defaultValue: T | null = null): T | null => {
    try {
      const item = sessionStorage.getItem(PREFIX + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      return defaultValue;
    }
  },

  remove: (key: string): void => {
    sessionStorage.removeItem(PREFIX + key);
  },

  clear: (): void => {
    sessionStorage.clear();
  }
};

// ========================================
// 📦 SPECIFIC STORAGE HELPERS
// ========================================

export const StorageKeys = {
  ONBOARDING_COMPLETE: 'onboarding_complete',
  LANGUAGE: 'language',
  THEME: 'theme',
  LAST_CHECKIN: 'last_checkin',
  DAILY_SPINS: 'daily_spins',
  AD_COUNT_TODAY: 'ad_count_today',
  DEVICE_ID: 'device_id',
  FIRST_LAUNCH: 'first_launch'
};

/**
 * Check if user has completed onboarding
 */
export const isOnboardingComplete = (): boolean => {
  return getItem<boolean>(StorageKeys.ONBOARDING_COMPLETE, false) === true;
};

/**
 * Mark onboarding as complete
 */
export const setOnboardingComplete = (): void => {
  setItem(StorageKeys.ONBOARDING_COMPLETE, true);
};

/**
 * Get or create device ID
 */
export const getDeviceId = (): string => {
  let deviceId = getItem<string>(StorageKeys.DEVICE_ID);
  if (!deviceId) {
    deviceId = 'device_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    setItem(StorageKeys.DEVICE_ID, deviceId);
  }
  return deviceId;
};

/**
 * Check if this is first launch
 */
export const isFirstLaunch = (): boolean => {
  const launched = getItem<boolean>(StorageKeys.FIRST_LAUNCH);
  if (!launched) {
    setItem(StorageKeys.FIRST_LAUNCH, true);
    return true;
  }
  return false;
};

export default {
  setItem,
  getItem,
  removeItem,
  clearAll,
  hasItem,
  getAllKeys,
  session,
  StorageKeys,
  isOnboardingComplete,
  setOnboardingComplete,
  getDeviceId,
  isFirstLaunch
};
