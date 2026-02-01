import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  increment,
  runTransaction
} from 'firebase/firestore';
import { db } from '../config/firebase.config';
import { Transaction, TransactionType, TransactionStatus, WithdrawalRequest } from '../types/wallet.types';
import { APP_CONFIG } from '../config/app.config';

/**
 * Get user's wallet balance
 */
export const getWalletBalance = async (userId: string) => {
  try {
    const walletRef = doc(db, 'wallets', userId);
    const walletSnap = await getDoc(walletRef);

    if (walletSnap.exists()) {
      const data = walletSnap.data();
      return {
        coins: data.coins || 0,
        pendingCoins: data.pendingCoins || 0,
        totalEarned: data.totalEarned || 0,
        totalWithdrawn: data.totalWithdrawn || 0
      };
    }

    return { coins: 0, pendingCoins: 0, totalEarned: 0, totalWithdrawn: 0 };
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    throw error;
  }
};

/**
 * Add coins to user wallet (with transaction record)
 */
export const addCoins = async (
  userId: string,
  amount: number,
  type: TransactionType,
  description: string,
  metadata?: Record<string, any>
): Promise<boolean> => {
  try {
    const walletRef = doc(db, 'wallets', userId);
    const transRef = collection(db, `wallets/${userId}/transactions`);

    await runTransaction(db, async (transaction) => {
      const walletDoc = await transaction.get(walletRef);

      if (!walletDoc.exists()) {
        // Create wallet if doesn't exist
        transaction.set(walletRef, {
          coins: amount,
          pendingCoins: 0,
          totalEarned: amount,
          totalWithdrawn: 0,
          createdAt: Date.now()
        });
      } else {
        // Update existing wallet
        transaction.update(walletRef, {
          coins: increment(amount),
          totalEarned: increment(amount)
        });
      }
    });

    // Add transaction record
    const transactionData: Omit<Transaction, 'id'> = {
      userId,
      type,
      amount,
      description,
      status: 'approved',
      timestamp: Date.now(),
      metadata
    };

    await addDoc(transRef, transactionData);

    return true;
  } catch (error) {
    console.error('Error adding coins:', error);
    return false;
  }
};

/**
 * Add pending coins (not yet approved)
 */
export const addPendingCoins = async (
  userId: string,
  amount: number,
  type: TransactionType,
  description: string
): Promise<boolean> => {
  try {
    const walletRef = doc(db, 'wallets', userId);
    const transRef = collection(db, `wallets/${userId}/transactions`);

    await updateDoc(walletRef, {
      pendingCoins: increment(amount)
    });

    // Add pending transaction record
    await addDoc(transRef, {
      userId,
      type,
      amount,
      description,
      status: 'pending',
      timestamp: Date.now()
    });

    return true;
  } catch (error) {
    console.error('Error adding pending coins:', error);
    return false;
  }
};

/**
 * Get transaction history
 */
export const getTransactionHistory = async (
  userId: string,
  limitCount: number = 20
): Promise<Transaction[]> => {
  try {
    const q = query(
      collection(db, `wallets/${userId}/transactions`),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    })) as Transaction[];
  } catch (error) {
    console.error('Error getting transactions:', error);
    return [];
  }
};

/**
 * Request withdrawal
 */
export const requestWithdrawal = async (
  userId: string,
  amount: number,
  methodId: string,
  details: Record<string, string>
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Validate minimum withdrawal
    if (amount < APP_CONFIG.WITHDRAWAL.MIN_AMOUNT) {
      return { success: false, error: `Minimum withdrawal is ${APP_CONFIG.WITHDRAWAL.MIN_AMOUNT} coins` };
    }

    // Check balance
    const balance = await getWalletBalance(userId);
    if (balance.coins < amount) {
      return { success: false, error: 'Insufficient balance' };
    }

    const walletRef = doc(db, 'wallets', userId);
    const withdrawalsRef = collection(db, 'withdrawals');
    const transRef = collection(db, `wallets/${userId}/transactions`);

    // Calculate currency value
    const currencyAmount = amount / APP_CONFIG.CURRENCY.COIN_RATE;

    await runTransaction(db, async (transaction) => {
      const walletDoc = await transaction.get(walletRef);

      if (!walletDoc.exists()) {
        throw new Error('Wallet not found');
      }

      const currentCoins = walletDoc.data().coins || 0;
      if (currentCoins < amount) {
        throw new Error('Insufficient balance');
      }

      // Deduct coins
      transaction.update(walletRef, {
        coins: increment(-amount)
      });
    });

    // Create withdrawal request
    const withdrawalData: Omit<WithdrawalRequest, 'id'> = {
      userId,
      methodId,
      amount,
      currencyAmount,
      details,
      status: 'pending',
      createdAt: Date.now()
    };

    await addDoc(withdrawalsRef, withdrawalData);

    // Add transaction record
    await addDoc(transRef, {
      userId,
      type: 'withdrawal',
      amount: -amount,
      description: `Withdrawal request - ${methodId}`,
      status: 'pending',
      timestamp: Date.now(),
      metadata: { methodId, ...details }
    });

    return { success: true };
  } catch (error: any) {
    console.error('Withdrawal error:', error);
    return { success: false, error: error.message || 'Withdrawal failed' };
  }
};

/**
 * Get pending withdrawals
 */
export const getPendingWithdrawals = async (userId: string): Promise<WithdrawalRequest[]> => {
  try {
    const q = query(
      collection(db, 'withdrawals'),
      where('userId', '==', userId),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    })) as unknown as WithdrawalRequest[];
  } catch (error) {
    console.error('Error getting pending withdrawals:', error);
    return [];
  }
};

export default {
  getWalletBalance,
  addCoins,
  addPendingCoins,
  getTransactionHistory,
  requestWithdrawal,
  getPendingWithdrawals
};
