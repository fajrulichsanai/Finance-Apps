import React from 'react';

const ShieldCheckIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="opacity-35">
    <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6L12 2z" stroke="#6b6b80" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M9 12l2 2 4-4" stroke="#6b6b80" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ShieldIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="opacity-35">
    <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6L12 2z" stroke="#6b6b80" strokeWidth="1.8" strokeLinejoin="round"/>
  </svg>
);

const LockIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="opacity-35">
    <rect x="5" y="11" width="14" height="10" rx="2" stroke="#6b6b80" strokeWidth="1.8"/>
    <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="#6b6b80" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="12" cy="16" r="1.5" fill="#6b6b80"/>
  </svg>
);

export const SecurityFooter: React.FC = () => {
  return (
    <div className="flex items-center justify-between mt-4 px-1 pt-3">
      <span className="text-[10px] font-semibold text-[#b0b0c0] tracking-[0.8px] uppercase">
        Encrypted by AES-256
      </span>
      <div className="flex gap-3.5 items-center">
        <ShieldCheckIcon />
        <ShieldIcon />
        <LockIcon />
      </div>
    </div>
  );
};
