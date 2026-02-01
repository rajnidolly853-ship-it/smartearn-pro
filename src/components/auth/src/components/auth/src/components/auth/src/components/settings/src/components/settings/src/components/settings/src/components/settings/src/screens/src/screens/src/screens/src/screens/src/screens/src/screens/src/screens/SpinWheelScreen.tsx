import React from 'react';
import MainLayout from '../layouts/MainLayout';
import SpinWheel from '../components/earning/SpinWheel';
import Button from '../components/common/Button';
import BalanceDisplay from '../components/wallet/BalanceDisplay';
import { useSpinWheel } from '../hooks/useSpinWheel';
import { useAuth } from '../hooks/useAuth';

const SpinWheelScreen: React.FC = () => {
  const { userProfile } = useAuth();
  const { 
    isSpinning, 
    canSpinNow, 
    spinsRemaining, 
    winningIndex,
    prizes,
    spin
  } = useSpinWheel(userProfile?.uid);

  return (
    <MainLayout headerTitle="Spin & Win" headerRight={<BalanceDisplay />}>
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center">
        
        {/* Info */}
        <div className="mb-4">
          <h2 className="text-2xl font-display font-bold text-white">
            Try Your Luck!
          </h2>
          <p className="text-sm text-gray-400">
            Spin the wheel to win up to 100 coins
          </p>
        </div>

        {/* Wheel Component */}
        <div className="my-6 transform scale-90 sm:scale-100">
          <SpinWheel 
            prizes={prizes}
            isSpinning={isSpinning}
            winningIndex={winningIndex}
          />
        </div>

        {/* Stats */}
        <div className="bg-dark-800/50 rounded-full px-6 py-2 border border-white/5 mb-8">
          <p className="text-sm text-gray-300">
            Spins Remaining: <span className="font-bold text-neon-400">{spinsRemaining}</span>
          </p>
        </div>

        {/* Action Button */}
        <div className="w-full max-w-xs">
          <Button
            variant={canSpinNow ? 'primary' : 'secondary'}
            fullWidth
            size="lg"
            onClick={spin}
            disabled={isSpinning || !canSpinNow}
            isLoading={isSpinning}
            className="shadow-neon"
          >
            {isSpinning ? 'Spinning...' : canSpinNow ? 'SPIN NOW' : 'No Spins Left'}
          </Button>
          
          {!canSpinNow && (
            <p className="text-xs text-red-400 mt-3 animate-pulse">
              Come back tomorrow for more spins!
            </p>
          )}
        </div>

      </div>
    </MainLayout>
  );
};

export default SpinWheelScreen;
