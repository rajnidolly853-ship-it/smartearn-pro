import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'neutral',
  className = ''
}) => {
  const variants = {
    success: 'bg-green-500/10 text-green-400 border-green-500/20',
    warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    error: 'bg-red-500/10 text-red-400 border-red-500/20',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    neutral: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };

  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 
      rounded-full text-[10px] font-medium uppercase tracking-wider
      border
      ${variants[variant]}
      ${className}
    `}>
      {children}
    </span>
  );
};

export default Badge;
