import React from 'react';
import { motion } from 'framer-motion';
import Button from '../common/Button';

interface ReferralCardProps {
  code: string;
  onCopy: () => void;
  onShare: () => void;
}

const ReferralCard: React.FC<ReferralCardProps> = ({ code, onCopy, onShare }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-dark-800 border border-white/5 p-6 text-center">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-neon-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

      <h3 className="text-lg font-display font-semibold text-white mb-2 relative z-10">
        Your Referral Code
      </h3>
      
      <p className="text-sm text-gray-400 mb-6 relative z-10">
        Share this code with friends and earn bonus coins!
      </p>

      {/* Code Display Box */}
      <motion.div 
        whileTap={{ scale: 0.98 }}
        onClick={onCopy}
        className="
          relative z-10
          bg-dark-950/50 border-2 border-dashed border-neon-500/30 
          rounded-xl p-4 mb-6 cursor-pointer group
          hover:border-neon-500/60 transition-colors
        "
      >
        <span className="text-3xl font-mono font-bold text-neon-400 tracking-widest">
          {code || 'LOADING'}
        </span>
        
        <div className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500 group-hover:text-white transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex gap-3 relative z-10">
        <Button 
          variant="secondary" 
          fullWidth 
          onClick={onCopy}
          leftIcon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 17.929c0 1.657 2.239 3 5 3s5-1.343 5-3" />
            </svg>
          }
        >
          Copy Code
        </Button>
        
        <Button 
          variant="primary" 
          fullWidth 
          onClick={onShare}
          leftIcon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          }
        >
          Invite Now
        </Button>
      </div>
    </div>
  );
};

export default ReferralCard;
