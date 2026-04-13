// =====================================================
// Month-over-Month Spending Chart
// =====================================================

import InsightCard from './InsightCard';
import { MOCK_BAR_DATA } from '@/lib/constants/insight';

export default function MonthOverMonth() {
  return (
    <InsightCard>
      <div className="text-[13px] font-bold text-[#0d0d2b] mb-3.5">Month-over-Month</div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-gray-400">Total Spending</span>
        <span className="inline-flex items-center bg-[#ffe8e8] rounded-[20px] px-2 py-0.5 text-[11px] font-bold text-[#e74c3c]">
          -4.2%↑
        </span>
      </div>

      {/* Bar Chart */}
      <div className="flex gap-[5px] items-end h-[70px] mb-3">
        {MOCK_BAR_DATA.map((bar, idx) => (
          <div
            key={idx}
            className={`flex-1 rounded-t-md ${bar.active ? 'bg-[#1a1a6e]' : 'bg-[#e8e8f0]'}`}
            style={{ height: `${bar.height}px` }}
          />
        ))}
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <div className="text-[10px] text-gray-400 mb-0.5">SAVINGS GAP</div>
          <div className="text-base font-extrabold text-[#1a9e6e]">+$420.00</div>
        </div>
        <div className="w-px bg-[#f0f0f5]" />
        <div className="flex-1">
          <div className="text-[10px] text-gray-400 mb-0.5">DAILY AVG</div>
          <div className="text-base font-extrabold text-[#0d0d2b]">$137.09</div>
        </div>
      </div>
    </InsightCard>
  );
}
