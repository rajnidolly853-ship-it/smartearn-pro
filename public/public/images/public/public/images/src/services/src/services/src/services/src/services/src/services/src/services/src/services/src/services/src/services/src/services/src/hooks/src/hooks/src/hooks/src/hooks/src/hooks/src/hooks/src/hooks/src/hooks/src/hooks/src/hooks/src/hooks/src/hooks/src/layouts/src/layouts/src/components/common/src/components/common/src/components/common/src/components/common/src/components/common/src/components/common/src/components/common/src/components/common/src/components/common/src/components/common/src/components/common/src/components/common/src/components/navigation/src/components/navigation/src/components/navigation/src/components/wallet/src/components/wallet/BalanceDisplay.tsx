import React from 'react';
import { useWallet } from '../../hooks/useWallet';

interface BalanceDisplayProps {
  showCurrency?: boolean;
}

const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ showCurrency = false }) => {
  const { balance, formatCoins, formatCurrency } = useWallet('user_id_placeholder');

  return (
    <div className="flex items-center gap-2 bg-dark-800/50 border border-white/10 px-3 py-1.5 rounded-full">
      <div className="w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center border border-yellow-500/30">
        <span className="text-xs">🪙</span>
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-sm font-bold text-white">
          {formatCoins(balance.coins)}
        </span>
        {showCurrency && (
          <span className="text-[10px] text-gray-400">
            {formatCurrency(balance.coins)}
          </span>
        )}
      </div>
    </div>
  );
};

export default BalanceDisplay;
