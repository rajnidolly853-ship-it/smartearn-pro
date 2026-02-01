import React, { useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import WalletCard from '../components/wallet/WalletCard';
import TransactionItem from '../components/wallet/TransactionItem';
import { useWallet } from '../hooks/useWallet';
import { useAuth } from '../hooks/useAuth';
import { useNavigation } from '../context/NavigationContext';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import Loader from '../components/common/Loader';

const WalletScreen: React.FC = () => {
  const { userProfile } = useAuth();
  const { transactions, refresh, isLoading } = useWallet(userProfile?.uid);
  const { goToWithdraw, goToHistory } = useNavigation();

  useEffect(() => {
    refresh();
  }, []);

  return (
    <MainLayout headerTitle="My Wallet">
      <div className="p-4 pb-24 space-y-6">
        
        {/* Wallet Card */}
        <section>
          <WalletCard onWithdraw={goToWithdraw} />
        </section>

        {/* Recent Transactions */}
        <section>
          <div className="flex justify-between items-center mb-3 px-1">
            <h3 className="text-sm font-bold text-white">Recent Transactions</h3>
            <button onClick={goToHistory} className="text-xs text-neon-400 hover:underline">
              View All
            </button>
          </div>

          <div className="min-h-[200px]">
            {isLoading ? (
              <Loader />
            ) : transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.slice(0, 5).map((txn) => (
                  <TransactionItem key={txn.id} transaction={txn} />
                ))}
              </div>
            ) : (
              <EmptyState 
                title="No Transactions" 
                description="Start earning to see your history here."
              />
            )}
          </div>
        </section>

        {/* Support Banner */}
        <section className="bg-dark-800 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
              💬
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Need Help?</h4>
              <p className="text-xs text-gray-500">Contact support for payment issues</p>
            </div>
          </div>
          <Button size="sm" variant="ghost">Contact</Button>
        </section>

      </div>
    </MainLayout>
  );
};

export default WalletScreen;
