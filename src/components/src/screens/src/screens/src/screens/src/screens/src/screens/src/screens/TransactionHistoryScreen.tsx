import React, { useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import TransactionItem from '../components/wallet/TransactionItem';
import { useWallet } from '../hooks/useWallet';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

const TransactionHistoryScreen: React.FC = () => {
  const { userProfile } = useAuth();
  const { transactions, refresh, isLoading } = useWallet(userProfile?.uid);

  useEffect(() => {
    refresh();
  }, []);

  return (
    <MainLayout headerTitle="History" showBackButton>
      <div className="p-4 pb-24">
        
        {isLoading ? (
          <div className="py-20">
            <Loader />
          </div>
        ) : transactions.length > 0 ? (
          <div className="space-y-3">
            {transactions.map((txn) => (
              <TransactionItem key={txn.id} transaction={txn} />
            ))}
          </div>
        ) : (
          <div className="py-20">
            <EmptyState 
              icon={<span className="text-4xl">📜</span>}
              title="No History Found" 
              description="Your earnings and withdrawals will appear here."
            />
          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default TransactionHistoryScreen;
