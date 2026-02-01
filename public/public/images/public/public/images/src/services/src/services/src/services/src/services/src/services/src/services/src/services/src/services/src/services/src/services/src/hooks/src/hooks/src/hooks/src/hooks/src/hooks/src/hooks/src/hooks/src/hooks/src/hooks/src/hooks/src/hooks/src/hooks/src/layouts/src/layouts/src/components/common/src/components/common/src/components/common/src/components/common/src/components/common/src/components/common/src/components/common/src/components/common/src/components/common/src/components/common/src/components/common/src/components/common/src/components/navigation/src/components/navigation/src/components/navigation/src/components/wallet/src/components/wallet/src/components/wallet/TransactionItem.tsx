import React from 'react';
import { Transaction } from '../../types/wallet.types';
import { formatDate } from '../../utils/helpers';
import Badge from '../common/Badge';

interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const isPositive = transaction.amount > 0;
  
  const getIcon = () => {
    switch (transaction.type) {
      case 'daily_checkin': return '📅';
      case 'spin_wheel': return '🎡';
      case 'watch_ad': return '📺';
      case 'task_offer': return '✅';
      case 'referral_bonus': return '👥';
      case 'withdrawal': return '💸';
      default: return '💰';
    }
  };

  const getStatusVariant = () => {
    switch (transaction.status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      default: return 'neutral';
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-dark-800/30 border border-white/5 rounded-xl mb-3">
      <div className="flex items-center gap-3">
        {/* Icon Box */}
        <div className={`
          w-10 h-10 rounded-full flex items-center justify-center text-lg
          ${isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}
        `}>
          {getIcon()}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <span className="text-sm font-medium text-white line-clamp-1">
            {transaction.description}
          </span>
          <span className="text-xs text-gray-500">
            {formatDate(transaction.timestamp)}
          </span>
        </div>
      </div>

      {/* Amount & Status */}
      <div className="flex flex-col items-end gap-1">
        <span className={`text-sm font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? '+' : ''}{transaction.amount}
        </span>
        <Badge variant={getStatusVariant()}>
          {transaction.status}
        </Badge>
      </div>
    </div>
  );
};

export default TransactionItem;
