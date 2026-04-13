import React from 'react';
import Link from 'next/link';

export const AIInsightCard: React.FC = () => {
  return (
    <div className="bg-[#eef0ff] rounded-[18px] px-[18px] py-4 mb-3.5 relative overflow-hidden">
      <div className="text-[9px] font-bold text-[#5555cc] tracking-[0.8px] uppercase mb-1.5 flex items-center gap-1.5">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#5555cc" strokeWidth="2"/>
          <path d="M12 8v4l3 3" stroke="#5555cc" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        AI Architect Insight
      </div>
      <div className="text-[17px] font-extrabold text-[#0d0d2b] mb-2 leading-tight">
        <div>Savings Opportunity</div>
        <div>Detected</div>
      </div>
      <div className="text-xs text-[#6b6b80] leading-relaxed mb-3">
        Track your spending patterns and find opportunities to save. Set up budgets for each category to stay on track.
      </div>
      <Link href="/categories" className="text-[13px] font-bold text-[#1a1a6e] no-underline">
        View Categories →
      </Link>
      <div className="absolute right-3.5 bottom-3.5 opacity-[0.12] text-[60px] leading-none text-[#1a1a6e] pointer-events-none">
        ✦
      </div>
    </div>
  );
};
