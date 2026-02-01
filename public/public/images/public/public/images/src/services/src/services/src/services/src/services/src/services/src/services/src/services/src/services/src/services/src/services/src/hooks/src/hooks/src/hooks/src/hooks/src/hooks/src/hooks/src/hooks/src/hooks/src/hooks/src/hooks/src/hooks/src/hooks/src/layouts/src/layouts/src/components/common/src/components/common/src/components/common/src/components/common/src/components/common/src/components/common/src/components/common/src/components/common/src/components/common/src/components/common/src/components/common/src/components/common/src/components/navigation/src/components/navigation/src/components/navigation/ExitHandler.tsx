import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useBackHandler from '../../hooks/useBackHandler';
import Button from '../common/Button';

const ExitHandler: React.FC = () => {
  const { showExitConfirm, exitApp, cancelExit } = useBackHandler();

  return (
    <AnimatePresence>
      {showExitConfirm && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-modal flex items-end sm:items-center justify-center"
            onClick={cancelExit}
          >
            {/* Modal Card */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-sm bg-dark-900 border-t border-white/10 rounded-t-3xl sm:rounded-3xl p-6 m-0 sm:m-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col items-center text-center">
                {/* Icon */}
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl">👋</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">
                  Exit App?
                </h3>
                
                <p className="text-gray-400 mb-6">
                  Are you sure you want to close SmartEarn Pro?
                </p>

                <div className="flex gap-3 w-full">
                  <Button 
                    variant="ghost" 
                    fullWidth 
                    onClick={cancelExit}
                  >
                    Cancel
                  </Button>
                  
                  <Button 
                    variant="danger" 
                    fullWidth 
                    onClick={exitApp}
                  >
                    Exit
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ExitHandler;
