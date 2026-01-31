import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { WalletBalance, Transaction } from '../types/wallet.types';
import { db } from '../config/firebase.config';
import { doc, onSnapshot, collection, query, orderBy, limit } from 'firebase/firestore';
import { APP_CONFIG } from '../config/app.config';

interface WalletContextType {
  balance: WalletBalance;
  transactions: Transaction[];
  isLoading: boolean;
  refreshWallet: () => void;
  formatCurrency: (coins: number) => string;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [balance, setBalance] = useState<WalletBalance>({
    coins: 0,
    pendingCoins: 0,
    currencyValue: 0
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setBalance({ coins: 0, pendingCoins: 0, currencyValue: 0 });
      setTransactions([]);
      return;
    }

    setIsLoading(true);

    // 1. Listen to Wallet Balance Real-time
    const walletRef = doc(db, 'wallets', user.uid);
    const unsubWallet = onSnapshot(walletRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const coins = data.coins || 0;
        setBalance({
          coins: coins,
          pendingCoins: data.pendingCoins || 0,
          currencyValue: coins / APP_CONFIG.CURRENCY.COIN_RATE
        });
      }
      setIsLoading(false);
    });

    // 2. Listen to Recent Transactions
    const q = query(
      collection(db, `wallets/${user.uid}/transactions`),
      orderBy('timestamp', 'desc'),
      limit(10)
    );

    const unsubTrans = onSnapshot(q, (snapshot) => {
      const transData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transaction[];
      setTransactions(transData);
    });

    return () => {
      unsubWallet();
      unsubTrans();
    };
  }, [user]);

  const refreshWallet = () => {
    // Manual refresh trigger if needed (mostly handled by onSnapshot)
    console.log('Wallet refreshed');
  };

  const formatCurrency = (coins: number) => {
    const value = coins / APP_CONFIG.CURRENCY.COIN_RATE;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: APP_CONFIG.CURRENCY.CODE,
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <WalletContext.Provider value={{ balance, transactions, isLoading, refreshWallet, formatCurrency }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
