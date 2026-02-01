import React from 'react';
import MainLayout from '../layouts/MainLayout';
import DailyCheckIn from '../components/earning/DailyCheckIn';
import BalanceDisplay from '../components/wallet/BalanceDisplay';
import { useDailyCheckIn } from '../hooks/useDailyCheckIn';
import { useAuth } from '../hooks/useAuth';

const DailyCheckInScreen: React.FC = () => {
  const { userProfile } = useAuth();
  const { 
    calendar, 
    claim, 
    canClaim, 
    isLoading,
    currentStreak 
  } = useDailyCheckIn(userProfile?.uid);

  return (
    <MainLayout headerTitle="Daily Bonus" headerRight={<BalanceDisplay />}>
      <div className="p-6 pb-24 flex flex-col items-center">
        
        {/* Header Illustration (Optional SVG) */}
        <div className="w-24 h-24 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full flex items-center justify-center mb-6 border border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
          <span className="text-5xl">📅</span>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">
          Daily Streak: <span className="text-yellow-400">{currentStreak} Days</span>
        </h2>
        <p className="text-sm text-gray-400 text-center mb-8 max-w-xs">
          Check in every day to increase your streak and earn bigger rewards!
        </p>

        {/* Calendar Grid */}
        <DailyCheckIn 
          calendar={calendar}
          onClaim={claim}
          canClaim={canClaim}
          isLoading={isLoading}
        />

        {/* Tip */}
        <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3 items-start">
          <span className="text-xl">💡</span>
          <p className="text-xs text-blue-200 leading-relaxed">
            <strong>Tip:</strong> If you miss a day, your streak will reset to Day 1. Set a reminder to come back tomorrow!
          </p>
        </div>

      </div>
    </MainLayout>
  );
};

export default DailyCheckInScreen;
