import { useState, useEffect, useCallback } from 'react';
import { ReferralData, ReferralUser } from '../types/referral.types';
import {
  getReferralData,
  getReferredUsers,
  getShareMessage
} from '../services/referral.service';
import { copyToClipboard } from '../utils/helpers';
import { useNotification } from '../context/NotificationContext';

interface UseReferralReturn {
  referralData: ReferralData | null;
  referredUsers: ReferralUser[];
  isLoading: boolean;
  shareMessage: string;
  copyCode: () => Promise<boolean>;
  copyLink: () => Promise<boolean>;
  shareNative: () => Promise<boolean>;
  refresh: () => Promise<void>;
}

export const useReferral = (userId: string | undefined): UseReferralReturn => {
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [referredUsers, setReferredUsers] = useState<ReferralUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [shareMessage, setShareMessage] = useState<string>('');

  const { showNotification } = useNotification();

  // Load referral data on mount
  useEffect(() => {
    if (userId) {
      loadReferralData();
    }
  }, [userId]);

  // Load referral info
  const loadReferralData = async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const [data, users] = await Promise.all([
        getReferralData(userId),
        getReferredUsers(userId)
      ]);

      setReferralData(data);
      setReferredUsers(users);

      if (data) {
        setShareMessage(getShareMessage(data.code, data.link));
      }
    } catch (error) {
      console.error('Error loading referral data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Copy referral code
  const copyCode = useCallback(async (): Promise<boolean> => {
    if (!referralData) return false;

    const success = await copyToClipboard(referralData.code);
    if (success) {
      showNotification('Code copied! 📋', 'success');
    } else {
      showNotification('Failed to copy', 'error');
    }
    return success;
  }, [referralData, showNotification]);

  // Copy referral link
  const copyLink = useCallback(async (): Promise<boolean> => {
    if (!referralData) return false;

    const success = await copyToClipboard(referralData.link);
    if (success) {
      showNotification('Link copied! 📋', 'success');
    } else {
      showNotification('Failed to copy', 'error');
    }
    return success;
  }, [referralData, showNotification]);

  // Native share (Web Share API)
  const shareNative = useCallback(async (): Promise<boolean> => {
    if (!referralData) return false;

    if (!navigator.share) {
      // Fallback to copy link
      return await copyLink();
    }

    try {
      await navigator.share({
        title: 'Join SmartEarn Pro',
        text: shareMessage,
        url: referralData.link
      });
      showNotification('Thanks for sharing! 🙏', 'success');
      return true;
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        // User didn't cancel, but share failed
        return await copyLink();
      }
      return false;
    }
  }, [referralData, shareMessage, copyLink, showNotification]);

  // Manual refresh
  const refresh = useCallback(async (): Promise<void> => {
    await loadReferralData();
  }, [userId]);

  return {
    referralData,
    referredUsers,
    isLoading,
    shareMessage,
    copyCode,
    copyLink,
    shareNative,
    refresh
  };
};

export default useReferral;
