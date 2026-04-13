// =====================================================
// Bottom Navigation for Insight Page
// =====================================================

import Link from 'next/link';

export default function InsightBottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white py-2.5 pb-[22px] flex justify-around items-center border-t border-gray-200 max-w-[430px] mx-auto">
      <Link href="/dashboard" className="flex flex-col items-center gap-0.5 cursor-pointer">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M3 12L12 3l9 9" stroke="#bbb" strokeWidth="2" strokeLinecap="round" />
          <rect x="6" y="12" width="12" height="10" rx="1" stroke="#bbb" strokeWidth="2" />
        </svg>
        <span className="text-[9px] font-semibold tracking-wide text-[#bbb] uppercase">Home</span>
      </Link>
      <Link href="/activity" className="flex flex-col items-center gap-0.5 cursor-pointer">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="#bbb" strokeWidth="2" />
          <path d="M3 9h18M9 21V9" stroke="#bbb" strokeWidth="2" />
        </svg>
        <span className="text-[9px] font-semibold tracking-wide text-[#bbb] uppercase">Ledger</span>
      </Link>
      <Link href="/asisstant" className="flex flex-col items-center gap-0.5 cursor-pointer">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="8" stroke="#bbb" strokeWidth="2" />
          <path d="M9 12l2 2 4-4" stroke="#bbb" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="text-[9px] font-semibold tracking-wide text-[#bbb] uppercase">Assistant</span>
      </Link>
      <div className="flex flex-col items-center gap-0.5 cursor-pointer">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <polyline
            points="3,18 8,12 13,15 18,8 21,11"
            stroke="#1a1a6e"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-[9px] font-semibold tracking-wide text-[#1a1a6e] uppercase">Charts</span>
      </div>
      <Link href="/profile" className="flex flex-col items-center gap-0.5 cursor-pointer">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" stroke="#bbb" strokeWidth="2" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#bbb" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="text-[9px] font-semibold tracking-wide text-[#bbb] uppercase">Profile</span>
      </Link>
    </div>
  );
}
