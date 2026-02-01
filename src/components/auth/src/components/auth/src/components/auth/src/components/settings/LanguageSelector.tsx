import React from 'react';
import { motion } from 'framer-motion';
import { useLang } from '../../hooks/useLanguage';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLang();

  return (
    <div className="bg-dark-800 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
            <path d="M2 12h2" />
          </svg>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">App Language</h4>
          <p className="text-xs text-gray-500">English / हिंदी</p>
        </div>
      </div>

      {/* Toggle Container */}
      <div className="flex bg-dark-950 rounded-lg p-1 border border-white/5">
        {/* English Button */}
        <button
          onClick={() => setLanguage('en')}
          className={`
            relative px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200
            ${language === 'en' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}
          `}
        >
          {language === 'en' && (
            <motion.div
              layoutId="lang-active"
              className="absolute inset-0 bg-blue-500/20 rounded-md border border-blue-500/30"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
          <span className="relative z-10">English</span>
        </button>

        {/* Hindi Button */}
        <button
          onClick={() => setLanguage('hi')}
          className={`
            relative px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200
            ${language === 'hi' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}
          `}
        >
          {language === 'hi' && (
            <motion.div
              layoutId="lang-active"
              className="absolute inset-0 bg-blue-500/20 rounded-md border border-blue-500/30"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
          <span className="relative z-10">हिंदी</span>
        </button>
      </div>
    </div>
  );
};

export default LanguageSelector;
