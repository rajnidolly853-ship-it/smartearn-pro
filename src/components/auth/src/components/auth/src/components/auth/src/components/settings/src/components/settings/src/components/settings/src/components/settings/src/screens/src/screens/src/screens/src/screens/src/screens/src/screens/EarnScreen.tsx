import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { useNavigation } from '../context/NavigationContext';
import BalanceDisplay from '../components/wallet/BalanceDisplay';
import GlassCard from '../components/common/GlassCard';
import { motion } from 'framer-motion';

const EarnScreen: React.FC = () => {
  const { navigate, goToCheckIn, goToSpin, goToAds, goToTasks, goToReferral } = useNavigation();

  const methods = [
    {
      id: 'checkin',
      title: 'Daily Check-In',
      subtitle: 'Claim daily bonus',
      reward: 'Up to 50',
      icon: '📅',
      color: 'from-blue-500/20 to-blue-600/20',
      borderColor: 'border-blue-500/30',
      action: goToCheckIn
    },
    {
      id: 'spin',
      title: 'Spin Wheel',
      subtitle: 'Try your luck',
      reward: '0-100 Coins',
      icon: '🎡',
      color: 'from-purple-500/20 to-purple-600/20',
      borderColor: 'border-purple-500/30',
      action: goToSpin
    },
    {
      id: 'ads',
      title: 'Watch Ads',
      subtitle: 'Unlimited videos',
      reward: '10 Coins/Ad',
      icon: '📺',
      color: 'from-red-500/20 to-red-600/20',
      borderColor: 'border-red-500/30',
      action: goToAds
    },
    {
      id: 'tasks',
      title: 'Offerwall',
      subtitle: 'Complete tasks',
      reward: 'High Reward',
      icon: '✅',
      color: 'from-orange-500/20 to-orange-600/20',
      borderColor: 'border-orange-500/30',
      action: goToTasks
    },
    {
      id: 'referral',
      title: 'Refer Friends',
      subtitle: 'Invite & Earn',
      reward: '50 Coins/Ref',
      icon: '👥',
      color: 'from-green-500/20 to-green-600/20',
      borderColor: 'border-green-500/30',
      action: goToReferral
    }
  ];

  return (
    <MainLayout headerRight={<BalanceDisplay />}>
      <div className="p-4 pb-24 space-y-6">
        
        {/* Banner */}
        <GlassCard variant="gold" className="flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center text-2xl">
            🏆
          </div>
          <div>
            <h3 className="font-bold text-white">Boost Your Earnings</h3>
            <p className="text-xs text-gray-400">Complete all daily tasks to get a bonus!</p>
          </div>
        </GlassCard>

        {/* Methods Grid */}
        <div className="grid grid-cols-1 gap-4">
          {methods.map((method, idx) => (
            <motion.button
              key={method.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileTap={{ scale: 0.98 }}
              onClick={method.action}
              className={`
                relative flex items-center gap-4 p-4 rounded-2xl border
                bg-gradient-to-r ${method.color} ${method.borderColor}
                text-left w-full overflow-hidden group
              `}
            >
              {/* Background Glow */}
              <div className="absolute right-0 top-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/10 transition-colors" />

              {/* Icon */}
              <div className="w-14 h-14 bg-dark-900/50 backdrop-blur-sm rounded-xl flex items-center justify-center text-3xl shadow-inner">
                {method.icon}
              </div>

              {/* Text */}
              <div className="flex-1 z-10">
                <h4 className="font-bold text-white text-lg">{method.title}</h4>
                <p className="text-xs text-gray-300">{method.subtitle}</p>
              </div>

              {/* Reward Badge */}
              <div className="z-10 bg-dark-900/80 px-3 py-1 rounded-full border border-white/10">
                <span className="text-xs font-bold text-neon-400">{method.reward}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default EarnScreen;
