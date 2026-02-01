import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  noPadding?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  noPadding = false,
  ...props 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        bg-dark-900 
        border border-white/5 
        rounded-2xl 
        shadow-lg 
        overflow-hidden
        ${noPadding ? '' : 'p-5'}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
