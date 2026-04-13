import React from 'react';

export const AuthLogo: React.FC = () => {
  return (
    <div className="flex items-center gap-2.5 mb-7">
      <div className="w-10 h-10 rounded-full bg-[#1a1a6e] flex items-center justify-center flex-shrink-0">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="18" width="20" height="3" rx="1" fill="white"/>
          <rect x="10" y="4" width="4" height="14" rx="1" fill="white" opacity="0.9"/>
          <rect x="4" y="8" width="4" height="10" rx="1" fill="white" opacity="0.75"/>
          <rect x="16" y="10" width="4" height="8" rx="1" fill="white" opacity="0.75"/>
          <path d="M4 6 L12 2 L20 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <span className="text-[15px] font-bold text-[#0d0d2b]">The Financial Architect</span>
    </div>
  );
};
