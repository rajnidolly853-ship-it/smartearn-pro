import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '../utils/animations';

interface AuthLayoutProps {
  children: ReactNode;
  showLogo?: boolean;
  backgroundVariant?: 'default' | 'gradient' | 'pattern';
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  showLogo = true,
  backgroundVariant = 'default'
}) => {
  // Background styles based on variant
  const getBackgroundClass = (): string => {
    switch (backgroundVariant) {
      case 'gradient':
        return 'bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950';
      case 'pattern':
        return 'bg-dark-950 bg-auth-pattern';
      default:
        return 'bg-dark-950';
    }
  };

  return (
    <div
      className={`
        auth-layout min-h-screen w-full
        ${getBackgroundClass()}
        flex flex-col items-center justify-center
        text-white overflow-hidden
        relative
      `}
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top Right Glow */}
        <div
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(0,255,136,0.4) 0%, transparent 70%)'
          }}
        />

        {/* Bottom Left Glow */}
        <div
          className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(0,245,255,0.4) 0%, transparent 70%)'
          }}
        />

        {/* Center Subtle Glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(0,255,136,0.3) 0%, transparent 60%)'
          }}
        />

        {/* Grid Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Safe Area - Top */}
      <div style={{ paddingTop: 'env(safe-area-inset-top)' }} />

      {/* Logo Section */}
      {showLogo && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 z-10"
        >
          <div className="flex flex-col items-center">
            {/* Logo Icon */}
            <div className="relative mb-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,255,136,0.2) 0%, rgba(0,245,255,0.2) 100%)',
                  border: '2px solid rgba(0,255,136,0.3)'
                }}
              >
                {/* Coin Icon */}
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #ffd700 0%, #ffb800 100%)',
                    boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
                  }}
                >
                  <span className="text-2xl font-bold text-dark-950">₹</span>
                </div>
              </div>

              {/* Sparkle */}
              <div className="absolute -top-1 -right-1 w-4 h-4">
                <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                  <path
                    d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
                    fill="#00ff88"
                  />
                </svg>
              </div>
            </div>

            {/* Logo Text */}
            <h1 className="text-2xl font-display font-bold">
              <span className="text-white">Smart</span>
              <span className="text-gradient-primary">Earn</span>
              <span className="text-white"> Pro</span>
            </h1>

            {/* Tagline */}
            <p className="text-xs text-gray-500 mt-1 tracking-wider uppercase">
              Rewards & Micro-Earning
            </p>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <motion.div
        variants={fadeIn}
        initial="initial"
        animate="animate"
        className="w-full max-w-md px-6 z-10"
      >
        {children}
      </motion.div>

      {/* Safe Area - Bottom */}
      <div style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} />

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-6 left-0 right-0 text-center z-10"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <p className="text-xs text-gray-600">
          By continuing, you agree to our{' '}
          <span className="text-gray-500 underline cursor-pointer">Terms</span>
          {' & '}
          <span className="text-gray-500 underline cursor-pointer">Privacy Policy</span>
        </p>
      </motion.div>

      {/* Version Badge */}
      <div className="absolute top-4 right-4 z-10" style={{ marginTop: 'env(safe-area-inset-top)' }}>
        <span className="text-[10px] text-gray-600 bg-dark-900/50 px-2 py-1 rounded-full">
          v1.0.0
        </span>
      </div>
    </div>
  );
};

export default AuthLayout;
