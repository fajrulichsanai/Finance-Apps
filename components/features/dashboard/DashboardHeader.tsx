import React from 'react';
import Link from 'next/link';

export const DashboardHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between px-5 pt-5 pb-3 bg-[#f5f5f7]">
      <div className="flex items-center gap-2">
        <div className="w-[34px] h-[34px] rounded-full bg-[#1a1a6e] flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" fill="white"/>
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <span className="text-[15px] font-bold text-[#0d0d2b]">The Financial Architect</span>
      </div>
      <Link href="/notification">
        <button className="w-[34px] h-[34px] rounded-full bg-white border-none cursor-pointer flex items-center justify-center shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="#1a1a6e" strokeWidth="2" strokeLinecap="round"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="#1a1a6e" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </Link>
    </div>
  );
};
