import React from 'react';
import { motion } from 'framer-motion';
import { formatCurrency } from '../../utils/formatters';

interface ReferralStatsProps {
  inviteCount: number;
  totalEarned: number;
}

const ReferralStats: React.FC<ReferralStatsProps> = ({ inviteCount, totalEarned }) => {
  return (
    <div className="grid grid-cols-2 gap-4 my-6">
      {/* Total Invites */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-dark-800 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center"
      >
        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 mb-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <span className="text-2xl font-bold text-white mb-0.5">
          {inviteCount}
        </span>
        <span className="text-xs text-gray-500 uppercase tracking-wide">
          Friends Invited
        </span>
      </motion.div>

      {/* Total Earnings */}
      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-dark-800 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center"
      >
        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 mb-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
        <span className="text-2xl font-bold text-white mb-0.5">
          {totalEarned}
        </span>
        <span className="text-xs text-gray-500 uppercase tracking-wide">
          Coins Earned
        </span>
      </motion.div>
    </div>
  );
};

export default ReferralStats;
