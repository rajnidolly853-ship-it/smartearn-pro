import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  leftIcon,
  rightIcon,
  className = '',
  containerClassName = '',
  disabled,
  ...props
}, ref) => {
  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {/* Label */}
      {label && (
        <label className="text-xs font-medium text-gray-400 ml-1">
          {label}
        </label>
      )}

      {/* Input Container */}
      <div className="relative group">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-neon-400 transition-colors">
            {leftIcon}
          </div>
        )}

        {/* Actual Input */}
        <input
          ref={ref}
          disabled={disabled}
          className={`
            w-full bg-dark-800/50 
            border border-white/5 
            rounded-xl 
            text-white placeholder-gray-600
            transition-all duration-200
            focus:outline-none focus:border-neon-500/50 focus:bg-dark-800
            focus:ring-1 focus:ring-neon-500/20
            disabled:opacity-50 disabled:cursor-not-allowed
            ${leftIcon ? 'pl-11' : 'pl-4'}
            ${rightIcon ? 'pr-11' : 'pr-4'}
            py-3.5 text-sm
            ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${className}
          `}
          {...props}
        />

        {/* Right Icon */}
        {rightIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
            {rightIcon}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-xs text-red-400 ml-1 animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
