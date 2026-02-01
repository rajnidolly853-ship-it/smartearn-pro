import { useState, useEffect, useCallback } from 'react';
import { SpinWheelState } from '../types/task.types';
import {
  getSpinWheelState,
  canSpin,
  getRemainingSpins,
  performSpin
} from '../services/tasks.service';
import { performFraudCheck } from '../services/fraudPrevention.service';
import { APP_CONFIG } from '../config/app.config';
import { useNotification } from '../context/NotificationContext';

interface UseSpinWheelReturn {
  isSpinning: boolean;
  canSpinNow: boolean;
  spinsRemaining: number;
  lastReward: number | null;
  winningIndex: number | null;
  prizes: number[];
  spin: () => Promise<boolean>;
  reset: () => void;
}

export const useSpinWheel = (userId: string | undefined): UseSpinWheelReturn => {
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [canSpinNow, setCanSpinNow] = useState<boolean>(false);
  const [spinsRemaining, setSpinsRemaining] = useState<number>(0);
  const [lastReward, setLastReward] = useState<number | null>(null);
  const [winningIndex, setWinningIndex] = useState<number | null>(null);
  
  const { showNotification } = useNotification();
  
  // Prize segments on the wheel
  const prizes = APP_CONFIG.EARNING.SPIN_WHEEL.PRIZES;

  // Initialize spin state
  useEffect(() => {
    if (userId) {
      updateSpinStatus();
    }
  }, [userId]);

  // Update spin availability
  const updateSpinStatus = useCallback(async () => {
    if (!userId) return;

    try {
      const remaining = await getRemainingSpins(userId);
      setSpinsRemaining(remaining);

      const spinCheck = await canSpin(userId);
      setCanSpinNow(spinCheck.allowed);
    } catch (error) {
      console.error('Error updating spin status:', error);
    }
  }, [userId]);

  // Perform spin
  const spin = useCallback(async (): Promise<boolean> => {
    if (!userId) {
      showNotification('Please login to spin', 'error');
      return false;
    }

    if (isSpinning) {
      return false;
    }

    if (!canSpinNow) {
      showNotification('No spins remaining today!', 'error');
      return false;
    }

    // Fraud check
    const fraudCheck = await performFraudCheck(userId, 'spin_wheel');
    if (!fraudCheck.allowed) {
      showNotification(fraudCheck.reason || 'Action blocked', 'error');
      return false;
    }

    setIsSpinning(true);
    setLastReward(null);
    setWinningIndex(null);

    try {
      const result = await performSpin(userId);

      if (result.success) {
        // Set winning index for animation
        setWinningIndex(result.index);
        
        // Wait for animation to complete (4 seconds)
        await new Promise((resolve) => setTimeout(resolve, 4000));
        
        setLastReward(result.reward);
        
        if (result.reward > 0) {
          showNotification(`🎉 You won ${result.reward} coins!`, 'success');
        } else {
          showNotification('Better luck next time! 🍀', 'info');
        }

        await updateSpinStatus();
        return true;
      } else {
        showNotification(result.error || 'Spin failed', 'error');
        return false;
      }
    } catch (error: any) {
      showNotification('Something went wrong', 'error');
      return false;
    } finally {
      setIsSpinning(false);
    }
  }, [userId, isSpinning, canSpinNow, showNotification, updateSpinStatus]);

  // Reset state (for UI purposes)
  const reset = useCallback(() => {
    setLastReward(null);
    setWinningIndex(null);
  }, []);

  return {
    isSpinning,
    canSpinNow,
    spinsRemaining,
    lastReward,
    winningIndex,
    prizes,
    spin,
    reset
  };
};

export default useSpinWheel;
