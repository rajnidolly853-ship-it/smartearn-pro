import React from 'react';
import { motion } from 'framer-motion';

interface EarningStatsProps {
  totalEarned: number;
  tasksCompleted: number;
  adsWatched: number;
}

const EarningStats: React.FC<EarningStatsProps> = ({ 
  totalEarned, 
  tasksCompleted, 
  adsWatched 
}) => {
  const stats = [
    { label: 'Total Earned', value: totalEarned, icon: '💰' },
    { label: 'Tasks Done', value: tasksCompleted, icon: '✅' },
    { label: 'Ads Watched', value: adsWatched, icon: '📺' },
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {stats.map((stat, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-dark-800/50 border border-white/5 rounded-2xl p-3 flex flex-col items-center text-center"
        >
          <span className="text-xl mb-1">{stat.icon}</span>
          <span className="text-sm font-bold text-white">{stat.value}</span>
          <span className="text-[10px] text-gray-500 uppercase tracking-wide">
            {stat.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

export default EarningStats;
