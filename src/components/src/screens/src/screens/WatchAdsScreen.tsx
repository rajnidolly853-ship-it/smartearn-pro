import React from 'react';
import MainLayout from '../layouts/MainLayout';
import AdRewardButton from '../components/earning/AdRewardButton';
import BalanceDisplay from '../components/wallet/BalanceDisplay';
import { useAds } from '../hooks/useAds';
import { useAuth } from '../hooks/useAuth';

const WatchAdsScreen: React.FC = () => {
  const { userProfile } = useAuth();
  const { 
    watchAd, 
    isLoading, 
    canWatch, 
    cooldown, 
    remainingAds 
  } = useAds(userProfile?.uid);

  return (
    <MainLayout headerTitle="Watch & Earn" headerRight={<BalanceDisplay />}>
      <div className="p-6 flex flex-col items-center justify-center min-h-[80vh] text-center">
        
        {/* Animated TV Icon */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full" />
          <div className="w-32 h-24 bg-dark-800 border-2 border-white/10 rounded-2xl flex items-center justify-center relative z-10 shadow-2xl">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          {/* Antenna */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-16 border-t-2 border-r-2 border-gray-600 rounded-tr-full transform -rotate-45" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">
          Watch Videos
        </h2>
        <p className="text-sm text-gray-400 mb-8 max-w-xs">
          Watch short sponsored videos to earn coins instantly. No limit on earnings!
        </p>

        {/* Ad Button Component */}
        <div className="w-full max-w-sm">
          <AdRewardButton 
            onWatch={watchAd}
            isLoading={isLoading}
            canWatch={canWatch}
            cooldown={cooldown}
            remainingAds={remainingAds}
          />
        </div>

        {/* Instructions */}
        <div className="mt-12 text-left w-full max-w-sm space-y-4">
          <h4 className="text-sm font-semibold text-gray-300">How it works:</h4>
          <ul className="text-xs text-gray-500 space-y-2 list-disc pl-4">
            <li>Click "Watch Video" button above</li>
            <li>Watch the full video (15-30 seconds)</li>
            <li>Wait for the "X" button to appear</li>
            <li>Close the ad to receive your coins</li>
            <li>Wait 30 seconds before next video</li>
          </ul>
        </div>

      </div>
    </MainLayout>
  );
};

export default WatchAdsScreen;
