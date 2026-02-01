import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

type GlassVariant = 'default' | 'neon' | 'gold' | 'cyan';

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  variant?: GlassVariant;
  interactive?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  variant = 'default',
  interactive = false,
  ...props 
}) => {
  // Variant styles
  const variants = {
    default: 'bg-white/5 border-white/10 shadow-glass',
    neon: 'bg-neon-500/5 border-neon-500/20 shadow-neon-sm',
    gold: 'bg-yellow-500/5 border-yellow-500/20 shadow-gold',
    cyan: 'bg-cyan-500/5 border-cyan-500/20 shadow-cyan-sm'
  };

  const interactiveStyles = interactive 
    ? 'cursor-pointer hover:bg-white/10 hover:border-white/20 active:scale-[0.98] transition-all duration-200' 
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        relative 
        backdrop-blur-xl 
        rounded-3xl 
        border 
        overflow-hidden
        p-5
        ${variants[variant]}
        ${interactiveStyles}
        ${className}
      `}
      {...props}
    >
      {/* Glossy Gradient Overlay */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default GlassCard;
