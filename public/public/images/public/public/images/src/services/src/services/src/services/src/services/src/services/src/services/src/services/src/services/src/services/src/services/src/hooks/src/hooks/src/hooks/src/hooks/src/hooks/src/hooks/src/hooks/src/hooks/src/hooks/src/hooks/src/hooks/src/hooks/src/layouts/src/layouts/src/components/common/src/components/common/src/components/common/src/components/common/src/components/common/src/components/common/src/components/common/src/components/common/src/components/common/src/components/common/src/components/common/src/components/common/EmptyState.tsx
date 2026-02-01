import React from 'react';
import Button from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 ${className}`}>
      {/* Icon Circle */}
      <div className="w-16 h-16 rounded-full bg-dark-800 flex items-center justify-center mb-4 text-gray-500">
        {icon || (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20 12V22H4V12" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 7H2V12H22V7Z" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 22V7" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 7H16.5A3.5 3.5 0 0 0 12 3.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 7H7.5A3.5 3.5 0 0 1 12 3.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 3.5V5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>

      {/* Text */}
      <h3 className="text-lg font-semibold text-white mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-sm text-gray-400 max-w-xs mx-auto mb-6">
          {description}
        </p>
      )}

      {/* Action */}
      {actionLabel && onAction && (
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
