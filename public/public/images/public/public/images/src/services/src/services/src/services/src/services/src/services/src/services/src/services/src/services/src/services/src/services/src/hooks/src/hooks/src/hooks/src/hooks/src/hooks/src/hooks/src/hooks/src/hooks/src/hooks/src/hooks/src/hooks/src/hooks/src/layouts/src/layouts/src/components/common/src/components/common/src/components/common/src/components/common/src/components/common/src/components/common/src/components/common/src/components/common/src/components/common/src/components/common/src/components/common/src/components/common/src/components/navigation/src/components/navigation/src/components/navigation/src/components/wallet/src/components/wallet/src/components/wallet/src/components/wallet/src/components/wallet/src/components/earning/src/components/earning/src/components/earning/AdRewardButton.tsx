import React from 'react';
import Button from '../common/Button';
import { formatDuration } from '../../utils/formatters';

interface AdRewardButtonProps {
  onWatch: () => void;
  isLoading: boolean;
  canWatch: boolean;
  cooldown: number; // in seconds
  remainingAds: number;
}

const AdRewardButton: React.FC<AdRewardButtonProps> = ({
  onWatch,
  isLoading,
  canWatch,
  cooldown,
  remainingAds
}) => {
  return (
    <div className="w-full">
      <Button
        variant={canWatch ? 'primary' : 'secondary'}
        fullWidth
        size="lg"
        onClick={onWatch}
        disabled={!canWatch || isLoading}
        isLoading={isLoading}
        className={canWatch ? 'animate-pulse-slow' : ''}
        leftIcon={!isLoading && <span className="text-xl">📺</span>}
      >
        {isLoading ? 'Loading Ad...' : 
         cooldown > 0 ? `Wait ${formatDuration(cooldown)}` :
         'Watch Video (+10 Coins)'}
      </Button>
      
      <div className="flex justify-between mt-2 px-1">
        <span className="text-xs text-gray-500">
          Daily Limit: {remainingAds} left
        </span>
        <span className="text-xs text-neon-400">
          Instant Credit
        </span>
      </div>
    </div>
  );
};

export default AdRewardButton;
