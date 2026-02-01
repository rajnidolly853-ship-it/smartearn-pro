import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '../../context/NotificationContext';

const Toast: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div 
      className="fixed top-safe-top left-0 right-0 z-toast flex flex-col items-center pointer-events-none p-4 gap-3"
      style={{ marginTop: '10px' }}
    >
      <AnimatePresence>
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            layout
            className={`
              pointer-events-auto
              min-w-[300px] max-w-sm
              flex items-center gap-3
              p-4 rounded-2xl
              backdrop-blur-md border shadow-lg
              ${
                notif.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                notif.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                notif.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
                'bg-blue-500/10 border-blue-500/20 text-blue-400'
              }
            `}
          >
            {/* Icon */}
            <div className="flex-shrink-0">
              {notif.type === 'success' && (
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
              {notif.type === 'error' && (
                <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
              {notif.type === 'info' && (
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                </div>
              )}
            </div>

            {/* Message */}
            <p className="text-sm font-medium flex-1">
              {notif.message}
            </p>

            {/* Close Button */}
            <button 
              onClick={() => removeNotification(notif.id)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <svg className="w-4 h-4 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
