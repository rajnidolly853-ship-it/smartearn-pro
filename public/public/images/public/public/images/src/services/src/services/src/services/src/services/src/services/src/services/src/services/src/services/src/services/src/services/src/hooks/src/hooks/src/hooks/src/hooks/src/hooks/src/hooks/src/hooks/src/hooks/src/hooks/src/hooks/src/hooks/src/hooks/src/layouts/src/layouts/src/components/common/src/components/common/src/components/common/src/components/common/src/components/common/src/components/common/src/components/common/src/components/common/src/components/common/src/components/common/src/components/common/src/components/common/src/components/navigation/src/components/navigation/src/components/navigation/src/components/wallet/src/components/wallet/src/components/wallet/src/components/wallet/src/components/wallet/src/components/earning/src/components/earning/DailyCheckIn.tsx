import React from 'react';
import { motion } from 'framer-motion';
import { DailyReward } from '../../types/task.types';

interface DailyCheckInProps {
  calendar: DailyReward[];
  onClaim: () => void;
  canClaim: boolean;
  isLoading: boolean;
}

const DailyCheckIn: React.FC<DailyCheckInProps> = ({ 
  calendar, 
  onClaim, 
  canClaim,
  isLoading 
}) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-4 gap-3">
        {calendar.map((day, index) => {
          // Last day is usually bigger (Day 7)
          const isBig = index === 6;
          
          return (
            <motion.button
              key={day.day}
              whileTap={day.isLocked ? {} : { scale: 0.95 }}
              onClick={!day.isLocked && !day.isClaimed ? onClaim : undefined}
              className={`
                relative flex flex-col items-center justify-center
                rounded-2xl border p-2
                transition-all duration-200
                ${isBig ? 'col-span-2 aspect-[2/1] bg-gradient-to-br from-neon-500/20 to-cyan-500/20 border-neon-500/30' : 'aspect-square'}
                ${day.isClaimed 
                  ? 'bg-green-500/10 border-green-500/30 opacity-60' 
                  : day.isLocked 
                    ? 'bg-dark-800 border-white/5 text-gray-500' 
                    : 'bg-white/10 border-white/20 shadow-neon-sm animate-pulse-slow cursor-pointer'
                }
              `}
              disabled={day.isLocked || day.isClaimed || isLoading}
            >
              {/* Day Label */}
              <span className="text-[10px] font-medium uppercase tracking-wider mb-1">
                Day {day.day}
              </span>

              {/* Icon/Amount */}
              <div className="flex items-center gap-1">
                <span className="text-sm">🪙</span>
                <span className={`font-bold ${day.isLocked ? 'text-gray-400' : 'text-white'}`}>
                  {day.reward}
                </span>
              </div>

              {/* Status Overlay */}
              {day.isClaimed && (
                <div className="absolute inset-0 bg-dark-950/40 flex items-center justify-center rounded-2xl">
                  <div className="bg-green-500 rounded-full p-1">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}

              {/* Lock Overlay */}
              {day.isLocked && !day.isClaimed && (
                <div className="absolute top-2 right-2 opacity-50">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Big Claim Button */}
      {canClaim && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClaim}
          disabled={isLoading}
          className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-neon-500 to-cyan-400 text-dark-950 font-bold text-lg shadow-neon flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <>
              <span>Claim Today's Reward</span>
              <span>🎁</span>
            </>
          )}
        </motion.button>
      )}
    </div>
  );
};

export default DailyCheckIn;
