import { useState, useEffect, useCallback } from 'react';

type SetValue<T> = T | ((prevValue: T) => T);

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: SetValue<T>) => void, () => void] {
  // Prefix for app-specific keys
  const prefixedKey = `smartearn_${key}`;

  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === 'undefined') {
        return initialValue;
      }

      const item = window.localStorage.getItem(prefixedKey);
      if (item) {
        const parsed = JSON.parse(item);
        
        // Check for expiry
        if (parsed.expiry && Date.now() > parsed.expiry) {
          window.localStorage.removeItem(prefixedKey);
          return initialValue;
        }
        
        return parsed.value !== undefined ? parsed.value : parsed;
      }
      return initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${prefixedKey}":`, error);
      return initialValue;
    }
  });

  // Set value with optional expiry
  const setValue = useCallback((value: SetValue<T>, expiryMinutes?: number) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (typeof window !== 'undefined') {
        const item = {
          value: valueToStore,
          expiry: expiryMinutes ? Date.now() + expiryMinutes * 60 * 1000 : undefined
        };
        window.localStorage.setItem(prefixedKey, JSON.stringify(item));

        // Dispatch event for other tabs/windows
        window.dispatchEvent(new StorageEvent('storage', {
          key: prefixedKey,
          newValue: JSON.stringify(item)
        }));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${prefixedKey}":`, error);
    }
  }, [prefixedKey, storedValue]);

  // Remove item
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(prefixedKey);
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${prefixedKey}":`, error);
    }
  }, [prefixedKey, initialValue]);

  // Listen for changes in other tabs/windows
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === prefixedKey && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue);
          setStoredValue(parsed.value !== undefined ? parsed.value : parsed);
        } catch {
          // Ignore parse errors
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [prefixedKey]);

  return [storedValue, setValue, removeValue];
}

// Specific hooks for common use cases

/**
 * Hook for tracking daily data that resets each day
 */
export function useDailyStorage<T>(key: string, initialValue: T): [T, (value: SetValue<T>) => void] {
  const today = new Date().toDateString();
  const dailyKey = `${key}_${today}`;
  const [value, setValue, removeValue] = useLocalStorage<T>(dailyKey, initialValue);

  return [value, setValue];
}

/**
 * Hook for tracking last action timestamp
 */
export function useLastAction(key: string): [number, () => void, number] {
  const [lastTime, setLastTime] = useLocalStorage<number>(`last_${key}`, 0);

  const recordAction = useCallback(() => {
    setLastTime(Date.now());
  }, [setLastTime]);

  const timeSince = Date.now() - lastTime;

  return [lastTime, recordAction, timeSince];
}

/**
 * Hook for managing onboarding/first-time state
 */
export function useFirstTime(key: string): [boolean, () => void] {
  const [hasCompleted, setHasCompleted] = useLocalStorage<boolean>(`first_${key}`, false);

  const markComplete = useCallback(() => {
    setHasCompleted(true);
  }, [setHasCompleted]);

  return [!hasCompleted, markComplete];
}

export default useLocalStorage;
