import React from 'react';

interface DividerProps {
  className?: string;
  label?: string;
}

const Divider: React.FC<DividerProps> = ({ className = '', label }) => {
  if (label) {
    return (
      <div className={`relative flex items-center w-full py-4 ${className}`}>
        <div className="flex-grow border-t border-white/5"></div>
        <span className="flex-shrink-0 mx-4 text-xs text-gray-500 uppercase tracking-wider">
          {label}
        </span>
        <div className="flex-grow border-t border-white/5"></div>
      </div>
    );
  }

  return (
    <div className={`w-full border-t border-white/5 my-4 ${className}`} />
  );
};

export default Divider;
