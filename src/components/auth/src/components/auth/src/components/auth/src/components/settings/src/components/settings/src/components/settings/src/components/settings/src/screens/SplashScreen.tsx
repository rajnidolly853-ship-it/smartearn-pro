import React from 'react';
import { motion } from 'framer-motion';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-dark-950 flex flex-col items-center justify-center z-[9999] overflow-hidden">
      {/* Background SVG */}
      <div className="absolute inset-0 z-0 opacity-50">
        <img 
          src="/images/splash-bg.svg" 
          alt="background" 
          className="w-full h-full object-cover" 
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo Animation */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <img 
            src="/images/logo.svg" 
            alt="SmartEarn Pro" 
            className="w-64 h-auto drop-shadow-neon" 
          />
        </motion.div>

        {/* Loading Bar */}
        <div className="w-48 h-1 bg-dark-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="h-full bg-gradient-to-r from-neon-500 to-cyan-400"
          />
        </div>

        {/* Footer Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-10 text-[10px] text-gray-500 uppercase tracking-widest"
          style={{ bottom: '-150px' }} // Push down visually
        >
          Secure • Fast • Rewarding
        </motion.p>
      </div>
    </div>
  );
};

export default SplashScreen;
