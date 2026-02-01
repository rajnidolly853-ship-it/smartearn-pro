import React from 'react';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import { useWallet } from '../../hooks/useWallet';

interface WalletCardProps {
  onWithdraw: () => void;
}

const WalletCard: React.FC<WalletCardProps> = ({ onWithdraw }) => {
  const { balance, formatCoins, formatCurrency } = useWallet('user_id_placeholder'); // Hook handles user ID internally mostly, but component might need props in real usage.

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="relative w-full aspect-[1.8/1] rounded-3xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl"
    >
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-800 to-dark-950 z-0" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-neon-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      {/* Glass Overlay */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl z-10" />

      {/* Content */}
      <div className="relative z-20 flex flex-col h-full justify-between">
        {/* Top Section */}
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">Total Balance</p>
            <h2 className="text-4xl font-display font-bold text-white flex items-baseline gap-2">
              {formatCoins(balance.coins)}
              <span className="text-lg text-neon-400">🪙</span>
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              ≈ {formatCurrency(balance.coins)}
            </p>
          </div>
          
          <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md">
            <svg className="w-6 h-6 text-neon-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12V7H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
              <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
            </svg>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex items-end justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500 uppercase tracking-wider">Pending</span>
            <span className="text-sm font-semibold text-yellow-400">
              {formatCoins(balance.pendingCoins)} 🪙
            </span>
          </div>

          <Button 
            variant="primary" 
            size="sm" 
            onClick={onWithdraw}
            className="shadow-neon-sm"
          >
            Withdraw
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default WalletCard;
