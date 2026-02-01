import React from 'react';
import { APP_CONFIG } from '../../config/app.config';
import { WithdrawalMethod } from '../../types/wallet.types';

interface WithdrawalMethodsProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const WithdrawalMethods: React.FC<WithdrawalMethodsProps> = ({ selectedId, onSelect }) => {
  const methods = APP_CONFIG.WITHDRAWAL.METHODS as WithdrawalMethod[];

  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {methods.map((method) => {
        const isSelected = selectedId === method.id;
        
        return (
          <button
            key={method.id}
            onClick={() => onSelect(method.id)}
            className={`
              relative p-4 rounded-2xl border transition-all duration-200
              flex flex-col items-center gap-3 text-center
              ${isSelected 
                ? 'bg-neon-500/10 border-neon-500 ring-1 ring-neon-500/50' 
                : 'bg-dark-800 border-white/5 hover:border-white/20'
              }
            `}
          >
            {/* Icon */}
            <div className="w-12 h-12 rounded-full bg-white/5 p-2 flex items-center justify-center">
              <img src={method.icon} alt={method.name} className="w-full h-full object-contain" />
            </div>

            {/* Name */}
            <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-400'}`}>
              {method.name}
            </span>

            {/* Min Amount */}
            <span className="text-[10px] text-gray-500">
              Min: {method.minAmount}
            </span>

            {/* Selected Checkmark */}
            {isSelected && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-neon-500 rounded-full flex items-center justify-center text-dark-950">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default WithdrawalMethods;
