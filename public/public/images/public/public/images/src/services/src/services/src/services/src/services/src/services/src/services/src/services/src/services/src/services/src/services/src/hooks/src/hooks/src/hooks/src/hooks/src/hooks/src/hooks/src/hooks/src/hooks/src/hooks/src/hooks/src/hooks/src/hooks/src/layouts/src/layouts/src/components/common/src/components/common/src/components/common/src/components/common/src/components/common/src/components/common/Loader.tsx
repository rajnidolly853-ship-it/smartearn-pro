import React from 'react';

interface LoaderProps {
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({ 
  fullScreen = false, 
  size = 'md',
  text
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4'
  };

  const spinner = (
    <div className="flex flex-col items-center gap-4">
      <div className={`
        relative rounded-full
        border-gray-800
        border-t-neon-500
        animate-spin
        ${sizeClasses[size]}
      `}>
        {/* Inner Glow */}
        <div className="absolute inset-0 rounded-full shadow-[0_0_15px_rgba(0,255,136,0.3)]" />
      </div>
      
      {text && (
        <p className="text-sm font-medium text-gray-400 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-950/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      {spinner}
    </div>
  );
};

export default Loader;
