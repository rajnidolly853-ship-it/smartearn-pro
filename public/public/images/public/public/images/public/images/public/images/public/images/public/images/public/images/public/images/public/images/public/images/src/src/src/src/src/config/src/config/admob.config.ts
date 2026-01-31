// ==========================================
// 📺 ADMOB CONFIGURATION
// ==========================================

const isDev = import.meta.env.DEV;

// 🧪 Google Standard Test IDs (Always use these during development)
// Using real IDs during dev can get your AdMob account banned!
const TEST_IDS = {
  APP_ID: 'ca-app-pub-3940256099942544~3347511713',
  BANNER: 'ca-app-pub-3940256099942544/6300978111',
  INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',
  REWARDED: 'ca-app-pub-3940256099942544/5224354917',
  REWARDED_INTERSTITIAL: 'ca-app-pub-3940256099942544/5354046379',
};

// 🚀 Production IDs (From .env)
const PROD_IDS = {
  APP_ID: import.meta.env.VITE_ADMOB_APP_ID,
  BANNER: import.meta.env.VITE_ADMOB_BANNER_ID,
  INTERSTITIAL: import.meta.env.VITE_ADMOB_INTERSTITIAL_ID,
  REWARDED: import.meta.env.VITE_ADMOB_REWARDED_ID,
  REWARDED_INTERSTITIAL: import.meta.env.VITE_ADMOB_REWARDED_INTERSTITIAL_ID,
};

// Select IDs based on environment
export const AD_IDS = isDev ? TEST_IDS : PROD_IDS;

export const AD_CONFIG = {
  // Max time (ms) to wait for an ad to load
  TIMEOUT: 15000,
  
  // Cooldown between showing interstitial ads (to prevent spamming)
  INTERSTITIAL_COOLDOWN_MS: 60000, // 1 minute
  
  // Max rewarded ads a user can watch per day
  DAILY_LIMIT: parseInt(import.meta.env.VITE_DAILY_AD_LIMIT || '20'),
  
  // Points awarded per ad watch
  REWARD_PER_AD: parseInt(import.meta.env.VITE_REWARD_AD_WATCH || '10'),
};

// Helper to check if ads are initialized
export const isAdMobConfigured = () => {
  if (isDev) return true;
  return !!(AD_IDS.APP_ID && AD_IDS.REWARDED);
};
