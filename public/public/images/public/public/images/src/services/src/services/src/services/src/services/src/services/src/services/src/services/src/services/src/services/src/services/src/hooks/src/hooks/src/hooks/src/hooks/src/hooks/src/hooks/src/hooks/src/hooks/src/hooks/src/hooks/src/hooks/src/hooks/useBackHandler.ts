import { useEffect, useCallback, useRef, useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useNotification } from '../context/NotificationContext';

interface UseBackHandlerReturn {
  handleBack: () => boolean;
  exitApp: () => void;
  showExitConfirm: boolean;
  cancelExit: () => void;
}

export const useBackHandler = (): UseBackHandlerReturn => {
  const { currentScreen, history, goBack } = useNavigation();
  const { showNotification } = useNotification();
  
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);
  const lastBackPress = useRef<number>(0);
  const exitTimeout = useRef<NodeJS.Timeout | null>(null);

  // Time window for double-tap exit (2 seconds)
  const DOUBLE_TAP_DELAY = 2000;

  // Handle back button press
  const handleBack = useCallback((): boolean => {
    const now = Date.now();

    // If not on home screen, navigate back
    if (currentScreen !== 'home' && history.length > 1) {
      goBack();
      return true;
    }

    // On home screen - check for double tap
    if (currentScreen === 'home') {
      if (now - lastBackPress.current < DOUBLE_TAP_DELAY) {
        // Double tap detected - exit app
        setShowExitConfirm(true);
        return true;
      }

      // First tap - show message
      lastBackPress.current = now;
      showNotification('Press back again to exit', 'info');

      // Auto-reset after delay
      if (exitTimeout.current) {
        clearTimeout(exitTimeout.current);
      }
      exitTimeout.current = setTimeout(() => {
        lastBackPress.current = 0;
      }, DOUBLE_TAP_DELAY);

      return true;
    }

    return false;
  }, [currentScreen, history, goBack, showNotification]);

  // Exit app (close tab/window)
  const exitApp = useCallback(() => {
    // For PWA, we can try to close the window
    // Note: This may not work in all browsers due to security restrictions
    try {
      window.close();
    } catch (e) {
      // Fallback: navigate to about:blank
      window.location.href = 'about:blank';
    }
  }, []);

  // Cancel exit confirmation
  const cancelExit = useCallback(() => {
    setShowExitConfirm(false);
    lastBackPress.current = 0;
  }, []);

  // Listen for browser back button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault();
      handleBack();
      
      // Push a new state to prevent actually going back
      window.history.pushState(null, '', window.location.pathname);
    };

    // Push initial state
    window.history.pushState(null, '', window.location.pathname);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      if (exitTimeout.current) {
        clearTimeout(exitTimeout.current);
      }
    };
  }, [handleBack]);

  // Listen for keyboard back (Escape key)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleBack]);

  // Handle Android hardware back button (for PWA)
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (currentScreen === 'home') {
        // Show confirmation before leaving
        event.preventDefault();
        event.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentScreen]);

  return {
    handleBack,
    exitApp,
    showExitConfirm,
    cancelExit
  };
};

/**
 * Hook to prevent accidental navigation away
 * Useful for forms or unsaved changes
 */
export const usePreventNavigation = (shouldPrevent: boolean, message?: string) => {
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (shouldPrevent) {
        event.preventDefault();
        event.returnValue = message || 'You have unsaved changes. Are you sure you want to leave?';
        return event.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [shouldPrevent, message]);
};

export default useBackHandler;
