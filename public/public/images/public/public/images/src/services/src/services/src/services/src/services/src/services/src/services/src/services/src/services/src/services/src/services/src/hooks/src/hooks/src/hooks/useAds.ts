import { useState, useEffect, useCallback, useRef } from 'react';
import {
  initializeAdTracking,
  canWatchAd,
  getRemainingAds,
  loadRewardedAd,
  showRewardedAd,
  getAdState,
  getCooldownRemaining
} from '../services/ads.service';
import { performFraudCheck } from '../services/fraudPrevention.service';
import { useNotification } from '../context/NotificationContext';

interface UseAdsReturn {
  isAdLoaded: boolean;
  isLoading: boolean;
  isWatching: boolean;
  remainingAds: number;
  cooldown: number;
  canWatch: boolean;
  cooldownReason: string | null;
  loadAd: () => Promise<boolean>;
  watchAd: () => Promise<boolean>;
}

export const useAds = (userId: string | undefined): UseAdsReturn => {
  const [isAdLoaded, setIsAdLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isWatching, setIsWatching] = useState<boolean>(false);
  const [remainingAds, setRemainingAds] = useState<number>(0);
  const [cooldown, setCooldown] = useState<number>(0);
  const [canWatch, setCanWatch] = useState<boolean>(false);
  const [cooldownReason, setCooldownReason] = useState<string | null>(null);
  
  const cooldownInterval = useRef<NodeJS.Timeout | null>(null);
  const { showNotification } = useNotification();

  // Initialize on mount
  useEffect(() => {
    initializeAdTracking();
    updateAdStatus();

    // Cooldown timer
    cooldownInterval.current = setInterval(() => {
      const remaining = getCooldownRemaining();
      setCooldown(remaining);

      if (remaining === 0) {
        updateAdStatus();
      }
    }, 1000);

    return () => {
      if (cooldownInterval.current) {
        clearInterval(cooldownInterval.current);
      }
    };
  }, []);

  // Update ad availability status
  const updateAdStatus = useCallback(() => {
    const remaining = getRemainingAds();
    setRemainingAds(remaining);

    const watchCheck = canWatchAd();
    setCanWatch(watchCheck.allowed);
    setCooldownReason(watchCheck.reason || null);

    const adState = getAdState();
    setIsAdLoaded(adState.isLoaded);
  }, []);

  // Load ad
  const loadAd = useCallback(async (): Promise<boolean> => {
    if (isLoading || isAdLoaded) return isAdLoaded;

    setIsLoading(true);

    try {
      const loaded = await loadRewardedAd();
      setIsAdLoaded(loaded);
      updateAdStatus();
      return loaded;
    } catch (err) {
      console.error('Ad load error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, isAdLoaded, updateAdStatus]);

  // Watch ad and get reward
  const watchAd = useCallback(async (): Promise<boolean> => {
    if (!userId) {
      showNotification('Please login to earn', 'error');
      return false;
    }

    if (!canWatch) {
      showNotification(cooldownReason || 'Cannot watch ad now', 'error');
      return false;
    }

    // Fraud check
    const fraudCheck = await performFraudCheck(userId, 'watch_ad');
    if (!fraudCheck.allowed) {
      showNotification(fraudCheck.reason || 'Action blocked', 'error');
      return false;
    }

    setIsWatching(true);

    return new Promise((resolve) => {
      showRewardedAd(
        userId,
        // On reward earned
        (amount) => {
          showNotification(`+${amount} coins earned! 🎉`, 'success');
          updateAdStatus();
          setIsWatching(false);
          setIsAdLoaded(false);
          resolve(true);
        },
        // On ad closed
        () => {
          setIsWatching(false);
          setIsAdLoaded(false);
          updateAdStatus();
          // Preload next ad
          loadAd();
        },
        // On error
        (error) => {
          showNotification(error, 'error');
          setIsWatching(false);
          updateAdStatus();
          resolve(false);
        }
      );
    });
  }, [userId, canWatch, cooldownReason, showNotification, updateAdStatus, loadAd]);

  return {
    isAdLoaded,
    isLoading,
    isWatching,
    remainingAds,
    cooldown,
    canWatch,
    cooldownReason,
    loadAd,
    watchAd
  };
};

export default useAds;
