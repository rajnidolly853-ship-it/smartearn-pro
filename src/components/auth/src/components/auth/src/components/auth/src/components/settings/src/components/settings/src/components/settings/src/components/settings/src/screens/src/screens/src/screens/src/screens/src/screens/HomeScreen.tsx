import React, { useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../hooks/useAuth';
import { useWallet } from '../hooks/useWallet';
import { useNavigation } from '../context/NavigationContext';
import WalletCard from '../components/wallet/WalletCard';
import EarningStats from '../components/earning/EarningStats';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import BalanceDisplay from '../components/wallet/BalanceDisplay';

const HomeScreen: React.FC = () => {
  const { userProfile } = useAuth();
  const { balance, refresh } = useWallet(userProfile?.uid);
  const { goToEarn, goToSpin, goToWallet, goToReferral } = useNavigation();

  // Refresh data on mount
  useEffect(() => {
    refresh();
  }, []);

  return (
    <MainLayout 
      headerRight={<BalanceDisplay />}
      showBackButton={false}
    >
      <div className="p-4 pb-24 space-y-6">
        
        {/* 1. Main Wallet Card */}
        <section>
          <WalletCard onWithdraw={goToWallet} />
        </section>

        {/* 2. Quick Actions Grid */}
        <section>
          <div className="flex justify-between items-center mb-3 px-1">
            <h3 className="text-sm font-bold text-white">Quick Tasks</h3>
            <button onClick={goToEarn} className="text-xs text-neon-400 hover:underline">
              View All
            </button>
          </div>
          
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: '📅', label: 'Check-In', action: goToEarn, color: 'bg-blue-500/10 text-blue-400' },
              { icon: '🎡', label: 'Spin', action: goToSpin, color: 'bg-purple-500/10 text-purple-400' },
              { icon: '📺', label: 'Watch', action: goToEarn, color: 'bg-red-500/10 text-red-400' },
              { icon: '👥', label: 'Refer', action: goToReferral, color: 'bg-green-500/10 text-green-400' },
            ].map((item, idx) => (
              <button 
                key={idx}
                onClick={item.action}
                className="flex flex-col items-center gap-2"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl border border-white/5 ${item.color}`}>
                  {item.icon}
                </div>
                <span className="text-[10px] font-medium text-gray-400">{item.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 3. Daily Stats */}
        <section>
          <h3 className="text-sm font-bold text-white mb-3 px-1">Today's Progress</h3>
          <EarningStats 
            totalEarned={balance.coins} // Placeholder, real daily stats come from another hook
            tasksCompleted={0} 
            adsWatched={0} 
          />
        </section>

        {/* 4. Featured Banner */}
        <section>
          <GlassCard variant="neon" className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-white">Invite Friends</h4>
              <p className="text-xs text-gray-400 mt-1">Get 50 coins per referral</p>
            </div>
            <Button size="sm" onClick={goToReferral}>
              Invite
            </Button>
          </GlassCard>
        </section>

        {/* 5. Recent Activity (Placeholder) */}
        <section>
          <h3 className="text-sm font-bold text-white mb-3 px-1">Recent Activity</h3>
          <div className="bg-dark-800 border border-white/5 rounded-2xl p-4 text-center">
            <p className="text-xs text-gray-500">No recent activity</p>
          </div>
        </section>

      </div>
    </MainLayout>
  );
};

export default HomeScreen;
