import React from 'react';

const DisclaimerBanner: React.FC = () => {
  return (
    <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-xl p-4 my-6">
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <svg className="w-5 h-5 text-yellow-500/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <div className="text-xs text-gray-400 leading-relaxed">
          <p className="mb-2">
            <span className="font-semibold text-yellow-500/80">Disclaimer:</span> Earnings depend on ad availability and your engagement. We do not guarantee any fixed income.
          </p>
          <p>
            All tasks and rewards are subject to verification. Fraudulent activity will result in an immediate ban.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerBanner;
