import { useState, useEffect, useCallback } from 'react';
import { DailyReward } from '../types/task.types';
import {
  getCheckInStatus,
  claimDailyCheckIn,
  getCheckInCalendar
} from '../services/tasks.service';
import { performFraudCheck } from '../services/fraudPrevention.service';
import { useNotification } from '../context/NotificationContext';

interface UseCheckInReturn {
  canClaim: boolean;
  currentStreak: number;
  todayReward: number;
  calendar: DailyReward[];
  isLoading: boolean;
  isClaiming: boolean;
  lastClaimDate: string | null;
  claim: () => Promise<boolean>;
  refresh: () => Promise<void>;
}

export const useDailyCheckIn = (userId: string | undefined): UseCheckInReturn => {
  const [canClaim, setCanClaim] = useState<boolean>(false);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [todayReward, setTodayReward] = useState<number>(0);
  const [calendar, setCalendar] = useState<DailyReward[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isClaiming, setIsClaiming] = useState<boolean>(false);
  const [lastClaimDate, setLastClaimDate] = useState<string | null>(null);

  const { showNotification } = useNotification();

  // Load check-in status on mount
  useEffect(() => {
    if (userId) {
      loadCheckInData();
    }
  }, [userId]);

  // Load all check-in data
  const loadCheckInData = async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const [status, calendarData] = await Promise.all([
        getCheckInStatus(userId),
        getCheckInCalendar(userId)
      ]);

      setCanClaim(status.canClaim);
      setCurrentStreak(status.currentStreak);
      setTodayReward(status.todayReward);
      setLastClaimDate(status.lastCheckIn);
      setCalendar(calendarData);
    } catch (error) {
      console.error('Error loading check-in data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Claim daily reward
  const claim = useCallback(async (): Promise<boolean> => {
    if (!userId) {
      showNotification('Please login to claim', 'error');
      return false;
    }

    if (!canClaim) {
      showNotification('Already claimed today!', 'info');
      return false;
    }

    if (isClaiming) return false;

    // Fraud check
    const fraudCheck = await performFraudCheck(userId, 'daily_checkin');
    if (!fraudCheck.allowed) {
      showNotification(fraudCheck.reason || 'Action blocked', 'error');
      return false;
    }

    setIsClaiming(true);

    try {
      const result = await claimDailyCheckIn(userId);

      if (result.success) {
        showNotification(`🎉 Day ${result.newStreak}! +${result.reward} coins`, 'success');
        
        setCanClaim(false);
        setCurrentStreak(result.newStreak);
        setLastClaimDate(new Date().toISOString().split('T')[0]);
        
        // Refresh calendar
        await loadCheckInData();
        return true;
      } else {
        showNotification(result.error || 'Claim failed', 'error');
        return false;
      }
    } catch (error) {
      showNotification('Something went wrong', 'error');
      return false;
    } finally {
      setIsClaiming(false);
    }
  }, [userId, canClaim, isClaiming, showNotification]);

  // Manual refresh
  const refresh = useCallback(async (): Promise<void> => {
    await loadCheckInData();
  }, [userId]);

  return {
    canClaim,
    currentStreak,
    todayReward,
    calendar,
    isLoading,
    isClaiming,
    lastClaimDate,
    claim,
    refresh
  };
};

export default useDailyCheckIn;
