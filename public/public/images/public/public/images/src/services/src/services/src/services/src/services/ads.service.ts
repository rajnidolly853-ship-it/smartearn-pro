import { AD_CONFIG, AD_IDS, isAdMobConfigured } from '../config/admob.config';
import { addCoins } from './wallet.service';
import { STORAGE_KEYS } from '../utils/constants';

interface AdState {
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
}

let adState: AdState = {
  isLoaded: false,
  isLoading: false,
  error: null
};

let lastAdWatchTime: number = 0;
let dailyAdCount: number = 0;

/**
 * Initialize daily ad count from storage
 */
export const initializeAdTracking = (): void => {
  const today = new Date().toDateString();
  const storedDate = localStorage.getItem('ad_tracking_date');

  if (storedDate !== today) {
    // Reset for new day
    localStorage.setItem('ad_tracking_date', today);
    localStorage.setItem('daily_ad_count', '0');
    dailyAdCount = 0;
  } else {
    dailyAdCount = parseInt(localStorage.getItem('daily_ad_count') || '0');
  }

  lastAdWatchTime = parseInt(localStorage.getItem(STORAGE_KEYS.LAST_AD_WATCH) || '0');
};

/**
 * Check if user can watch more ads today
 */
export const canWatchAd = (): { allowed: boolean; reason?: string } => {
  // Check daily limit
  if (dailyAdCount >= AD_CONFIG.DAILY_LIMIT) {
    return { allowed: false, reason: `Daily limit of ${AD_CONFIG.DAILY_LIMIT} ads reached` };
  }

  // Check cooldown
  const now = Date.now();
  const cooldownMs = AD_CONFIG.INTERSTITIAL_COOLDOWN_MS;
  const timeSinceLastAd = now - lastAdWatchTime;

  if (timeSinceLastAd < cooldownMs) {
    const remainingSecs = Math.ceil((cooldownMs - timeSinceLastAd) / 1000);
    return { allowed: false, reason: `Wait ${remainingSecs}s before next ad` };
  }

  return { allowed: true };
};

/**
 * Get remaining ads for today
 */
export const getRemainingAds = (): number => {
  initializeAdTracking();
  return Math.max(0, AD_CONFIG.DAILY_LIMIT - dailyAdCount);
};

/**
 * Simulate loading a rewarded ad
 * In production, this would use actual AdMob SDK
 */
export const loadRewardedAd = async (): Promise<boolean> => {
  if (!isAdMobConfigured()) {
    console.warn('AdMob not configured');
    return false;
  }

  adState.isLoading = true;
  adState.error = null;

  try {
    // Simulate ad loading delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In real implementation, you would use:
    // await AdMob.prepareRewardVideoAd({ adId: AD_IDS.REWARDED });

    adState.isLoaded = true;
    adState.isLoading = false;
    return true;
  } catch (error: any) {
    adState.isLoading = false;
    adState.error = error.message || 'Failed to load ad';
    return false;
  }
};

/**
 * Show rewarded ad and handle reward
 */
export const showRewardedAd = async (
  userId: string,
  onRewardEarned: (amount: number) => void,
  onAdClosed: () => void,
  onError: (error: string) => void
): Promise<void> => {
  const canWatch = canWatchAd();
  if (!canWatch.allowed) {
    onError(canWatch.reason || 'Cannot watch ad');
    return;
  }

  if (!adState.isLoaded) {
    const loaded = await loadRewardedAd();
    if (!loaded) {
      onError('Ad not ready. Please try again.');
      return;
    }
  }

  try {
    // Simulate ad watching (3 seconds minimum)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // In real implementation:
    // await AdMob.showRewardVideoAd();

    // Grant reward
    const rewardAmount = AD_CONFIG.REWARD_PER_AD;
    const success = await addCoins(
      userId,
      rewardAmount,
      'watch_ad',
      `Watched rewarded ad (+${rewardAmount} coins)`
    );

    if (success) {
      // Update tracking
      dailyAdCount++;
      lastAdWatchTime = Date.now();
      localStorage.setItem('daily_ad_count', dailyAdCount.toString());
      localStorage.setItem(STORAGE_KEYS.LAST_AD_WATCH, lastAdWatchTime.toString());

      onRewardEarned(rewardAmount);
    } else {
      onError('Failed to credit reward');
    }

    adState.isLoaded = false;
    onAdClosed();
  } catch (error: any) {
    adState.isLoaded = false;
    onError(error.message || 'Ad failed to show');
  }
};

/**
 * Get current ad state
 */
export const getAdState = (): AdState => {
  return { ...adState };
};

/**
 * Get cooldown remaining time in seconds
 */
export const getCooldownRemaining = (): number => {
  const now = Date.now();
  const cooldownMs = AD_CONFIG.INTERSTITIAL_COOLDOWN_MS;
  const timeSinceLastAd = now - lastAdWatchTime;

  if (timeSinceLastAd >= cooldownMs) {
    return 0;
  }

  return Math.ceil((cooldownMs - timeSinceLastAd) / 1000);
};

export default {
  initializeAdTracking,
  canWatchAd,
  getRemainingAds,
  loadRewardedAd,
  showRewardedAd,
  getAdState,
  getCooldownRemaining
};
