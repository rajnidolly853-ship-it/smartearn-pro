import React from 'react';
import { motion } from 'framer-motion';

interface SettingsItemProps {
  icon: React.ReactNode;
  label: string;
  subLabel?: string;
  onClick: () => void;
  isDanger?: boolean;
  rightElement?: React.ReactNode;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  label,
  subLabel,
  onClick,
  isDanger = false,
  rightElement
}) => {
  return (
    <motion.button
      whileTap={{ scale: 0.98, backgroundColor: 'rgba(255,255,255,0.05)' }}
      onClick={onClick}
      className={`
        w-full flex items-center justify-between p-4 
        border-b border-white/5 last:border-0
        transition-colors duration-200
      `}
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className={`
          w-10 h-10 rounded-full flex items-center justify-center
          ${isDanger 
            ? 'bg-red-500/10 text-red-400' 
            : 'bg-dark-800 text-gray-400'
          }
        `}>
          {icon}
        </div>

        {/* Text */}
        <div className="text-left">
          <h4 className={`text-sm font-medium ${isDanger ? 'text-red-400' : 'text-white'}`}>
            {label}
          </h4>
          {subLabel && (
            <p className="text-[10px] text-gray-500 mt-0.5">
              {subLabel}
            </p>
          )}
        </div>
      </div>

      {/* Right Element (Arrow or Custom) */}
      <div className="text-gray-500">
        {rightElement || (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </motion.button>
  );
};

export default SettingsItem;
