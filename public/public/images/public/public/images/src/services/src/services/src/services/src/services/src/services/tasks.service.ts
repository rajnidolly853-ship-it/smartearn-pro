import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../config/firebase.config';
import { APP_CONFIG } from '../config/app.config';
import { addCoins } from './wallet.service';
import { checkIsToday, checkIsYesterday } from '../utils/helpers';
import { DailyReward, SpinWheelState } from '../types/task.types';

// ========================================
// 📅 DAILY CHECK-IN
// ========================================

/**
 * Get user's check-in status
 */
export const getCheckInStatus = async (userId: string): Promise<{
  canClaim: boolean;
  currentStreak: number;
  lastCheckIn: string | null;
  todayReward: number;
}> => {
  try {
    const statsRef = doc(db, 'userStats', userId);
    const statsSnap = await getDoc(statsRef);

    if (!statsSnap.exists()) {
      return {
        canClaim: true,
        currentStreak: 0,
        lastCheckIn: null,
        todayReward: APP_CONFIG.EARNING.DAILY_CHECKIN_BASE
      };
    }

    const stats = statsSnap.data();
    const lastCheckIn = stats.lastCheckInDate;
    let currentStreak = stats.currentStreak || 0;

    // Check if already claimed today
    if (lastCheckIn && checkIsToday(lastCheckIn)) {
      return {
        canClaim: false,
        currentStreak,
        lastCheckIn,
        todayReward: 0
      };
    }

    // Check if streak should continue or reset
    if (lastCheckIn && !checkIsYesterday(lastCheckIn)) {
      // Streak broken
      currentStreak = 0;
    }

    // Calculate today's reward (increases with streak, max 7 days)
    const streakMultiplier = Math.min(currentStreak, 6); // 0-6
    const todayReward = APP_CONFIG.EARNING.DAILY_CHECKIN_BASE +
      (streakMultiplier * APP_CONFIG.EARNING.DAILY_CHECKIN_INCREMENT);

    return {
      canClaim: true,
      currentStreak,
      lastCheckIn,
      todayReward
    };
  } catch (error) {
    console.error('Error getting check-in status:', error);
    return {
      canClaim: false,
      currentStreak: 0,
      lastCheckIn: null,
      todayReward: 0
    };
  }
};

/**
 * Claim daily check-in reward
 */
export const claimDailyCheckIn = async (userId: string): Promise<{
  success: boolean;
  reward: number;
  newStreak: number;
  error?: string;
}> => {
  try {
    const status = await getCheckInStatus(userId);

    if (!status.canClaim) {
      return { success: false, reward: 0, newStreak: status.currentStreak, error: 'Already claimed today' };
    }

    const newStreak = status.currentStreak + 1;
    const reward = status.todayReward;

    // Update user stats
    const statsRef = doc(db, 'userStats', userId);
    await updateDoc(statsRef, {
      currentStreak: newStreak,
      lastCheckInDate: new Date().toISOString().split('T')[0] // YYYY-MM-DD
    });

    // Add coins
    await addCoins(userId, reward, 'daily_checkin', `Day ${newStreak} check-in bonus`);

    return { success: true, reward, newStreak };
  } catch (error: any) {
    console.error('Error claiming check-in:', error);
    return { success: false, reward: 0, newStreak: 0, error: error.message };
  }
};

/**
 * Get 7-day check-in calendar
 */
export const getCheckInCalendar = async (userId: string): Promise<DailyReward[]> => {
  const status = await getCheckInStatus(userId);
  const calendar: DailyReward[] = [];

  for (let i = 1; i <= 7; i++) {
    const reward = APP_CONFIG.EARNING.DAILY_CHECKIN_BASE +
      ((i - 1) * APP_CONFIG.EARNING.DAILY_CHECKIN_INCREMENT);

    const isClaimed = i <= status.currentStreak;
    const isLocked = i > status.currentStreak + 1;

    calendar.push({
      day: i,
      reward,
      isClaimed,
      isLocked
    });
  }

  return calendar;
};

// ========================================
// 🎡 SPIN WHEEL
// ========================================

/**
 * Get spin wheel state
 */
export const getSpinWheelState = async (userId: string): Promise<SpinWheelState> => {
  const today = new Date().toDateString();
  const storageKey = `spin_${userId}_${today}`;
  const storedData = localStorage.getItem(storageKey);

  if (storedData) {
    return JSON.parse(storedData);
  }

  return {
    spinsUsedToday: 0,
    nextFreeSpin: 0,
    isSpinning: false
  };
};

/**
 * Check if user can spin
 */
export const canSpin = async (userId: string): Promise<{ allowed: boolean; reason?: string }> => {
  const state = await getSpinWheelState(userId);
  const maxSpins = APP_CONFIG.EARNING.SPIN_WHEEL.DAILY_LIMIT;

  if (state.spinsUsedToday >= maxSpins) {
    return { allowed: false, reason: `Daily limit of ${maxSpins} spins reached` };
  }

  return { allowed: true };
};

/**
 * Get remaining spins
 */
export const getRemainingSpins = async (userId: string): Promise<number> => {
  const state = await getSpinWheelState(userId);
  return Math.max(0, APP_CONFIG.EARNING.SPIN_WHEEL.DAILY_LIMIT - state.spinsUsedToday);
};

/**
 * Perform spin and get result
 */
export const performSpin = async (userId: string): Promise<{
  success: boolean;
  reward: number;
  index: number;
  error?: string;
}> => {
  try {
    const canSpinResult = await canSpin(userId);
    if (!canSpinResult.allowed) {
      return { success: false, reward: 0, index: 0, error: canSpinResult.reason };
    }

    // Get random prize based on probabilities
    const { PRIZES, PROBABILITIES } = APP_CONFIG.EARNING.SPIN_WHEEL;
    const random = Math.random();
    let cumulative = 0;
    let prizeIndex = 0;

    for (let i = 0; i < PROBABILITIES.length; i++) {
      cumulative += PROBABILITIES[i];
      if (random <= cumulative) {
        prizeIndex = i;
        break;
      }
    }

    const reward = PRIZES[prizeIndex];

    // Update spin state
    const today = new Date().toDateString();
    const storageKey = `spin_${userId}_${today}`;
    const state = await getSpinWheelState(userId);

    localStorage.setItem(storageKey, JSON.stringify({
      ...state,
      spinsUsedToday: state.spinsUsedToday + 1,
      lastSpinTime: Date.now()
    }));

    // Add coins if won something
    if (reward > 0) {
      await addCoins(userId, reward, 'spin_wheel', `Spin wheel reward: ${reward} coins`);
    }

    return { success: true, reward, index: prizeIndex };
  } catch (error: any) {
    console.error('Spin error:', error);
    return { success: false, reward: 0, index: 0, error: error.message };
  }
};

export default {
  getCheckInStatus,
  claimDailyCheckIn,
  getCheckInCalendar,
  getSpinWheelState,
  canSpin,
  getRemainingSpins,
  performSpin
};
