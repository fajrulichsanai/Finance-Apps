// =====================================================
// Insight Page Hero Section
// =====================================================

export default function InsightHero() {
  return (
    <div className="py-1 px-0.5 pb-4">
      <div className="text-[9px] font-bold text-gray-400 tracking-wide uppercase mb-1">Financial Analytics</div>
      <h1 className="text-[34px] font-black text-[#0d0d2b] leading-tight tracking-tight mb-2">
        Monthly<br />Insights
      </h1>
      <div className="flex items-center gap-1.5">
        <span className="text-[13px] text-gray-500">October 2023</span>
        <div className="w-[22px] h-[22px] rounded-md bg-[#f0f0f5] flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="18" height="17" rx="2" stroke="#888" strokeWidth="2" />
            <line x1="3" y1="9" x2="21" y2="9" stroke="#888" strokeWidth="2" />
            <line x1="8" y1="2" x2="8" y2="6" stroke="#888" strokeWidth="2" strokeLinecap="round" />
            <line x1="16" y1="2" x2="16" y2="6" stroke="#888" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}
