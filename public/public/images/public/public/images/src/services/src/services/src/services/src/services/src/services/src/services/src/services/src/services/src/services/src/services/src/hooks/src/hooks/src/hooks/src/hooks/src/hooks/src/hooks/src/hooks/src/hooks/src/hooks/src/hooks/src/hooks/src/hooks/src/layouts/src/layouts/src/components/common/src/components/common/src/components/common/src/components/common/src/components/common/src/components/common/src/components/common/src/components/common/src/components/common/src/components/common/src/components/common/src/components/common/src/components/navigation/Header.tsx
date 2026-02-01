import React from 'react';
import { motion } from 'framer-motion';
import { useNavigation } from '../../context/NavigationContext';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
  transparent?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  rightElement,
  transparent = false
}) => {
  const { goBack } = useNavigation();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`
        fixed top-0 left-0 right-0 z-nav
        h-[60px] flex items-center justify-between px-4
        ${transparent 
          ? 'bg-transparent' 
          : 'bg-dark-950/80 backdrop-blur-md border-b border-white/5 shadow-sm'
        }
        transition-all duration-300
      `}
      style={{ marginTop: 'env(safe-area-inset-top)' }}
    >
      {/* Left Section (Back Button or Spacer) */}
      <div className="w-10 flex items-center justify-start">
        {showBack ? (
          <button
            onClick={goBack}
            className="p-2 -ml-2 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18L9 12L15 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ) : (
          /* Logo icon for Home screen */
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-500/20 to-cyan-500/20 border border-neon-500/30 flex items-center justify-center">
             <span className="text-neon-400 font-bold text-sm">S</span>
          </div>
        )}
      </div>

      {/* Center Section (Title) */}
      <div className="flex-1 flex justify-center">
        <h1 className="text-base font-display font-semibold text-white truncate max-w-[200px]">
          {title}
        </h1>
      </div>

      {/* Right Section (Action or Spacer) */}
      <div className="w-10 flex items-center justify-end">
        {rightElement ? (
          rightElement
        ) : (
          <div className="w-8" /> /* Spacer to balance layout */
        )}
      </div>
    </motion.header>
  );
};

export default Header;
