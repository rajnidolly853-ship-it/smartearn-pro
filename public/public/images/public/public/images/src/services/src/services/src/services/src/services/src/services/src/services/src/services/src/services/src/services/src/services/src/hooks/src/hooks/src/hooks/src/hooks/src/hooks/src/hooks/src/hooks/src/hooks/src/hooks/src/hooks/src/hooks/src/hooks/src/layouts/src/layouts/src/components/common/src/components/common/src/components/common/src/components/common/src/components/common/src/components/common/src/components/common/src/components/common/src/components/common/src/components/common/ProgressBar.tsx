import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number; // 0 to 100
  color?: 'primary' | 'secondary' | 'warning' | 'danger';
  height?: number;
  showLabel?: boolean;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = 'primary',
  height = 6,
  showLabel = false,
  className = ''
}) => {
  const safeProgress = Math.min(100, Math.max(0, progress));

  const colors = {
    primary: 'from-neon-500 to-neon-400',
    secondary: 'from-cyan-500 to-cyan-400',
    warning: 'from-yellow-500 to-yellow-400',
    danger: 'from-red-500 to-red-400',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-medium text-gray-400">Progress</span>
          <span className="text-xs font-bold text-white">{Math.round(safeProgress)}%</span>
        </div>
      )}
      
      <div 
        className="w-full bg-dark-800 rounded-full overflow-hidden"
        style={{ height }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${safeProgress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full rounded-full bg-gradient-to-r ${colors[color]} shadow-[0_0_10px_rgba(0,0,0,0.3)]`}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
