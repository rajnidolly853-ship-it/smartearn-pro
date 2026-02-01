import React from 'react';
import { motion } from 'framer-motion';
import { useNavigation } from '../../context/NavigationContext';

const BottomNav: React.FC = () => {
  const { navigate, activeTab } = useNavigation();

  const tabs = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'earn', label: 'Earn', icon: EarnIcon },
    { id: 'spin', label: 'Spin', icon: SpinIcon, isFloating: true },
    { id: 'wallet', label: 'Wallet', icon: WalletIcon },
    { id: 'profile', label: 'Profile', icon: ProfileIcon },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-nav pb-safe-bottom">
      {/* Glass Background */}
      <div className="absolute inset-0 bg-dark-950/90 backdrop-blur-lg border-t border-white/5 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]" />

      <div className="relative flex justify-around items-center h-[70px] px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          if (tab.isFloating) {
            return (
              <div key={tab.id} className="relative -top-6">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigate(tab.id as any)}
                  className={`
                    w-14 h-14 rounded-full 
                    bg-gradient-to-tr from-neon-500 to-cyan-400 
                    shadow-[0_0_15px_rgba(0,255,136,0.4)] 
                    flex items-center justify-center 
                    text-dark-950
                    border-4 border-dark-950
                  `}
                >
                  <tab.icon size={24} filled />
                </motion.button>
              </div>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.id as any)}
              className="flex-1 flex flex-col items-center justify-center py-2 gap-1 relative"
            >
              {/* Active Glow Background */}
              {isActive && (
                <motion.div
                  layoutId="nav-glow"
                  className="absolute inset-0 bg-gradient-to-t from-neon-500/10 to-transparent rounded-lg"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}

              {/* Icon */}
              <motion.div
                animate={{ 
                  y: isActive ? -2 : 0,
                  color: isActive ? '#00ff88' : '#9ca3af'
                }}
                className="relative z-10"
              >
                <tab.icon size={22} filled={isActive} />
              </motion.div>

              {/* Label */}
              <motion.span
                animate={{ 
                  opacity: isActive ? 1 : 0.7,
                  scale: isActive ? 1 : 0.9,
                  color: isActive ? '#ffffff' : '#6b7280'
                }}
                className="text-[10px] font-medium relative z-10"
              >
                {tab.label}
              </motion.span>
              
              {/* Active Dot */}
              {isActive && (
                <motion.div
                  layoutId="nav-dot"
                  className="absolute bottom-1 w-1 h-1 rounded-full bg-neon-500"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// --- Icons ---

interface IconProps {
  size?: number;
  filled?: boolean;
}

const HomeIcon: React.FC<IconProps> = ({ size = 24, filled }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={filled ? "0" : "2"}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" stroke={filled ? "rgba(0,0,0,0.5)" : "currentColor"} strokeWidth={filled ? "2" : "2"} />
  </svg>
);

const EarnIcon: React.FC<IconProps> = ({ size = 24, filled }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={filled ? "0" : "2"}>
    <circle cx="12" cy="12" r="10" />
    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" stroke={filled ? "rgba(0,0,0,0.5)" : "currentColor"} strokeWidth={filled ? "2" : "2"} strokeLinecap="round" />
    <line x1="12" y1="18" x2="12" y2="22" stroke={filled ? "rgba(0,0,0,0.5)" : "currentColor"} strokeWidth={filled ? "2" : "2"} />
    <line x1="12" y1="2" x2="12" y2="6" stroke={filled ? "rgba(0,0,0,0.5)" : "currentColor"} strokeWidth={filled ? "2" : "2"} />
  </svg>
);

const WalletIcon: React.FC<IconProps> = ({ size = 24, filled }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={filled ? "0" : "2"}>
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" stroke={filled ? "rgba(0,0,0,0.5)" : "currentColor"} strokeWidth={filled ? "2" : "2"} />
  </svg>
);

const ProfileIcon: React.FC<IconProps> = ({ size = 24, filled }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={filled ? "0" : "2"}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const SpinIcon: React.FC<IconProps> = ({ size = 24, filled }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={filled ? "0" : "2"}>
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

export default BottomNav;
