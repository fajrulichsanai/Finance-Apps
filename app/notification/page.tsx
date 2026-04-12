'use client';

export default function NotificationPage() {
  return (
    <div className="min-h-screen bg-[#f4f4f0] flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 bg-[#f4f4f0] flex items-center gap-2.5">
        <span className="text-lg cursor-pointer text-[#3a3a5c]">←</span>
        <span className="text-[17px] font-semibold text-[#3a3a5c] flex-1">Notifications</span>
        <span className="text-[10px] font-semibold text-gray-500 tracking-wide leading-tight text-right">
          MARK ALL AS<br />READ
        </span>
        <div className="w-9 h-9 rounded-full bg-[#3a3a5c] flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" fill="white" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-3.5 pb-3.5">
        {/* TODAY label */}
        <div className="text-[11px] font-semibold text-gray-400 tracking-wider px-1.5 py-3">TODAY</div>

        {/* Budget Alert Card */}
        <div className="bg-white rounded-2xl p-4 mb-2.5 flex gap-3 items-start">
          <div className="w-[42px] h-[42px] rounded-xl bg-[#fef3cd] flex items-center justify-center flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M12 2L2 22h20L12 2z" fill="#f0ad4e" />
              <text x="11.5" y="18" textAnchor="middle" fontSize="11" fontWeight="700" fill="white">!</text>
            </svg>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <span className="text-sm font-bold text-[#2d2d4e] leading-tight max-w-[200px]">
                Budget Alert: You reached 90% of your Food budget.
              </span>
              <span className="text-[11px] text-gray-300 whitespace-nowrap ml-2 mt-0.5 leading-tight">
                2H<br />AGO
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
              Consider adjusting your spending for the next 3 days to stay within your monthly goal.
            </p>
          </div>
        </div>

        {/* Over Budget Card */}
        <div className="bg-white rounded-2xl p-4 mb-2.5 flex gap-3 items-start">
          <div className="w-[42px] h-[42px] rounded-xl bg-[#fde8e8] flex items-center justify-center flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="#e74c3c" />
              <text x="12" y="17" textAnchor="middle" fontSize="14" fontWeight="700" fill="white">!</text>
            </svg>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <span className="text-sm font-bold text-[#2d2d4e] leading-tight max-w-[200px]">
                Over Budget: Monthly Transport limit exceeded.
              </span>
              <div className="flex items-center gap-1 whitespace-nowrap ml-2 mt-0.5">
                <span className="text-[11px] text-gray-300 leading-tight">5H<br />AGO</span>
                <div className="w-2 h-2 rounded-full bg-[#3a3a9c] ml-0.5 -mt-2.5"></div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
              Your transport spending is $45.00 over the allocated $200.00 limit for this period.
            </p>
          </div>
        </div>

        {/* YESTERDAY label */}
        <div className="text-[11px] font-semibold text-gray-400 tracking-wider px-1.5 py-3">YESTERDAY</div>

        {/* Bill Reminder Card */}
        <div className="bg-white rounded-2xl p-4 mb-2.5 flex gap-3 items-start">
          <div className="w-[42px] h-[42px] rounded-xl bg-[#ede8f5] flex items-center justify-center flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="16" rx="2" fill="#9b7fd4" />
              <rect x="7" y="8" width="10" height="2" rx="1" fill="white" opacity="0.8" />
              <rect x="7" y="12" width="7" height="2" rx="1" fill="white" opacity="0.6" />
              <circle cx="18" cy="18" r="4" fill="#6c5bbf" />
              <path d="M16.5 18h3M18 16.5v3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <span className="text-sm font-bold text-[#2d2d4e] leading-tight max-w-[200px]">
                Bill Reminder: Rent is due in 2 days.
              </span>
              <span className="text-[11px] text-gray-300 whitespace-nowrap ml-2 mt-0.5 leading-tight">
                1D<br />AGO
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
              A recurring payment of $1,850.00 is scheduled for July 1st. Ensure sufficient funds.
            </p>
          </div>
        </div>

        {/* Architect Insight Card */}
        <div 
          className="rounded-2xl px-4 py-5 mb-2.5 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #2e2a6e 0%, #3d3a8c 60%, #4a4a9e 100%)' }}
        >
          <div className="absolute -right-2.5 -bottom-5 w-[100px] h-[100px] rounded-full bg-white/5"></div>
          <div className="absolute right-7 -bottom-7 w-[70px] h-[70px] rounded-full bg-white/[0.04]"></div>
          <p className="text-[15px] font-bold text-white mb-1 relative z-10">Architect Insight</p>
          <p className="text-xs text-white/70 mb-3.5 leading-relaxed relative z-10">
            Your savings rate increased by 12% compared to last month. Keep up the momentum!
          </p>
          <button className="bg-[#7fe87a] border-none rounded-[20px] px-5 py-2 text-xs font-bold text-[#1a4a18] cursor-pointer tracking-wide relative z-10">
            VIEW ANALYSIS
          </button>
        </div>

        {/* View Archive */}
        <div className="text-center py-2.5">
          <span className="text-xs text-gray-400 tracking-wide">VIEW ARCHIVE ↻</span>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="bg-white border-t border-gray-200 py-2.5 pb-4 flex justify-around items-center">
        <div className="flex flex-col items-center gap-1">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 12L12 3l9 9" stroke="#bbb" strokeWidth="2" strokeLinecap="round" />
            <rect x="6" y="12" width="12" height="10" rx="1" stroke="#bbb" strokeWidth="2" />
          </svg>
          <span className="text-[10px] text-gray-400">HOME</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="#bbb" strokeWidth="2" />
            <path d="M3 9h18M9 21V9" stroke="#bbb" strokeWidth="2" />
          </svg>
          <span className="text-[10px] text-gray-400">LEDGER</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="8" stroke="#bbb" strokeWidth="2" />
            <path d="M9 12l2 2 4-4" stroke="#bbb" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="text-[10px] text-gray-400">ASSISTANT</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <polyline points="3,18 8,12 13,15 18,8 21,11" stroke="#bbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[10px] text-gray-400">CHARTS</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" stroke="#3a3a5c" strokeWidth="2" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#3a3a5c" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="text-[10px] text-[#3a3a5c] font-semibold">PROFILE</span>
        </div>
      </div>
    </div>
  );
}