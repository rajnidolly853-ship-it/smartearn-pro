// ==========================================
// ⚙️ GLOBAL APP SETTINGS & LOGIC
// ==========================================

export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || 'SmartEarn Pro',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  SUPPORT_EMAIL: import.meta.env.VITE_SUPPORT_EMAIL || 'support@smartearnpro.app',
  
  // 💰 Currency Logic
  CURRENCY: {
    SYMBOL: import.meta.env.VITE_CURRENCY_SYMBOL || '₹',
    CODE: import.meta.env.VITE_CURRENCY_CODE || 'INR',
    // How many coins equal 1 unit of currency (e.g., 100 coins = ₹1)
    COIN_RATE: parseInt(import.meta.env.VITE_COIN_TO_CURRENCY_RATE || '100'),
  },

  // 🏦 Withdrawal Limits
  WITHDRAWAL: {
    MIN_AMOUNT: parseInt(import.meta.env.VITE_MIN_WITHDRAWAL_AMOUNT || '1000'), // Coins
    MAX_AMOUNT: parseInt(import.meta.env.VITE_MAX_WITHDRAWAL_AMOUNT || '50000'), // Coins
    PROCESSING_TIME_HOURS: 24,
    METHODS: [
      { id: 'upi', name: 'UPI Transfer', icon: '/images/upi-icon.svg', min: 1000 },
      { id: 'paytm', name: 'Paytm Wallet', icon: '/images/paytm-icon.svg', min: 1000 },
      { id: 'gplay', name: 'Google Play Code', icon: '/images/gift-card.svg', min: 5000 },
    ]
  },

  // 🎮 Game/Earning Limits
  EARNING: {
    DAILY_CHECKIN_BASE: 5,
    DAILY_CHECKIN_INCREMENT: 5, // Adds 5 coins per consecutive day
    SPIN_WHEEL: {
      DAILY_LIMIT: 3,
      COST_PER_SPIN: 0, // Free spins
      PRIZES: [1, 5, 10, 2, 50, 5, 20, 0], // Possible outcomes
      PROBABILITIES: [0.3, 0.2, 0.1, 0.2, 0.02, 0.1, 0.05, 0.03] // Probabilities summing to 1
    },
    REFERRAL: {
      BONUS_REFERRER: 50, // Coins for the person inviting
      BONUS_REFEREE: 20, // Coins for the new user
      COMMISSION_PERCENT: 10 // % of referee earnings
    }
  },

  // 🔒 Security & Fraud Prevention
  SECURITY: {
    MAX_DEVICES: 2, // Max devices per account
    SESSION_TIMEOUT: 60, // Minutes
    AD_COOLDOWN_SEC: 30, // Seconds between ads
    MIN_TASK_TIME_SEC: 10 // Minimum time to stay on a task
  }
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  EARN: '/earn',
  WALLET: '/wallet',
  PROFILE: '/profile',
  REFERRAL: '/referral',
  TASKS: '/tasks',
  WITHDRAW: '/withdraw',
  HISTORY: '/history',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  SUPPORT: '/support',
};
