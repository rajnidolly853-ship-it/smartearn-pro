import { useState, useEffect, useCallback } from 'react';
import { WalletBalance, Transaction, WithdrawalRequest } from '../types/wallet.types';
import {
  getWalletBalance,
  getTransactionHistory,
  requestWithdrawal,
  getPendingWithdrawals
} from '../services/wallet.service';
import { validateWithdrawalRequest } from '../services/fraudPrevention.service';
import { APP_CONFIG } from '../config/app.config';
import { useNotification } from '../context/NotificationContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase.config';

interface UseWalletReturn {
  balance: WalletBalance;
  transactions: Transaction[];
  pendingWithdrawals: WithdrawalRequest[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  withdraw: (amount: number, methodId: string, details: Record<string, string>) => Promise<boolean>;
  formatCoins: (coins: number) => string;
  formatCurrency: (coins: number) => string;
  canWithdraw: (amount: number) => { allowed: boolean; reason?: string };
}

export const useWallet = (userId: string | undefined): UseWalletReturn => {
  const [balance, setBalance] = useState<WalletBalance>({
    coins: 0,
    pendingCoins: 0,
    currencyValue: 0
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { showNotification } = useNotification();

  // Real-time balance listener
  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const walletRef = doc(db, 'wallets', userId);
    const unsubscribe = onSnapshot(
      walletRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          const coins = data.coins || 0;
          setBalance({
            coins,
            pendingCoins: data.pendingCoins || 0,
            currencyValue: coins / APP_CONFIG.CURRENCY.COIN_RATE
          });
        }
        setIsLoading(false);
      },
      (err) => {
        console.error('Wallet listener error:', err);
        setError('Failed to load wallet');
        setIsLoading(false);
      }
    );

    // Load transactions
    loadTransactions();
    loadPendingWithdrawals();

    return () => unsubscribe();
  }, [userId]);

  // Load transaction history
  const loadTransactions = async () => {
    if (!userId) return;

    try {
      const txns = await getTransactionHistory(userId, 20);
      setTransactions(txns);
    } catch (err) {
      console.error('Error loading transactions:', err);
    }
  };

  // Load pending withdrawals
  const loadPendingWithdrawals = async () => {
    if (!userId) return;

    try {
      const pending = await getPendingWithdrawals(userId);
      setPendingWithdrawals(pending);
    } catch (err) {
      console.error('Error loading pending withdrawals:', err);
    }
  };

  // Refresh all wallet data
  const refresh = useCallback(async (): Promise<void> => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const walletData = await getWalletBalance(userId);
      setBalance({
        coins: walletData.coins,
        pendingCoins: walletData.pendingCoins,
        currencyValue: walletData.coins / APP_CONFIG.CURRENCY.COIN_RATE
      });

      await loadTransactions();
      await loadPendingWithdrawals();
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Check if withdrawal is allowed
  const canWithdraw = useCallback((amount: number): { allowed: boolean; reason?: string } => {
    if (amount < APP_CONFIG.WITHDRAWAL.MIN_AMOUNT) {
      return {
        allowed: false,
        reason: `Minimum withdrawal is ${APP_CONFIG.WITHDRAWAL.MIN_AMOUNT} coins`
      };
    }

    if (amount > balance.coins) {
      return {
        allowed: false,
        reason: 'Insufficient balance'
      };
    }

    if (amount > APP_CONFIG.WITHDRAWAL.MAX_AMOUNT) {
      return {
        allowed: false,
        reason: `Maximum withdrawal is ${APP_CONFIG.WITHDRAWAL.MAX_AMOUNT} coins`
      };
    }

    return { allowed: true };
  }, [balance.coins]);

  // Request withdrawal
  const withdraw = useCallback(async (
    amount: number,
    methodId: string,
    details: Record<string, string>
  ): Promise<boolean> => {
    if (!userId) {
      showNotification('Please login to withdraw', 'error');
      return false;
    }

    // Pre-check
    const check = canWithdraw(amount);
    if (!check.allowed) {
      showNotification(check.reason || 'Cannot withdraw', 'error');
      return false;
    }

    // Fraud check
    const fraudCheck = await validateWithdrawalRequest(userId, amount);
    if (!fraudCheck.allowed) {
      showNotification(fraudCheck.reason || 'Withdrawal blocked', 'error');
      return false;
    }

    // Process withdrawal
    const result = await requestWithdrawal(userId, amount, methodId, details);

    if (result.success) {
      showNotification('Withdrawal requested! Processing within 24 hours.', 'success');
      await refresh();
      return true;
    } else {
      showNotification(result.error || 'Withdrawal failed', 'error');
      return false;
    }
  }, [userId, canWithdraw, showNotification, refresh]);

  // Format coins with commas
  const formatCoins = useCallback((coins: number): string => {
    return new Intl.NumberFormat('en-IN').format(coins);
  }, []);

  // Format coins to currency
  const formatCurrency = useCallback((coins: number): string => {
    const value = coins / APP_CONFIG.CURRENCY.COIN_RATE;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: APP_CONFIG.CURRENCY.CODE,
      minimumFractionDigits: 2
    }).format(value);
  }, []);

  return {
    balance,
    transactions,
    pendingWithdrawals,
    isLoading,
    error,
    refresh,
    withdraw,
    formatCoins,
    formatCurrency,
    canWithdraw
  };
};

export default useWallet;
