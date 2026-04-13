// =====================================================
// Insight Page Header with User Profile
// =====================================================

import Link from 'next/link';

export default function InsightHeader() {
  return (
    <div className="flex items-center justify-between px-5 pt-6 pb-3 bg-[#f2f2f5]">
      <div className="flex items-center gap-2">
        <div className="w-[34px] h-[34px] rounded-full bg-[#2a2a5e] flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" fill="white" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <span className="text-[15px] font-extrabold text-[#1a1a6e]">The Financial Architect</span>
      </div>
      <Link href="/notification">
        <button className="bg-transparent border-none cursor-pointer">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
              stroke="#1a1a6e"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="#1a1a6e" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </Link>
    </div>
  );
}
