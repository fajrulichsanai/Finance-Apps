// =====================================================
// Category Allocation with Donut Chart
// =====================================================

import InsightCard from './InsightCard';
import { CategoryData } from '@/types';

interface CategoryAllocationProps {
  categories: CategoryData[];
}

export default function CategoryAllocation({ categories }: CategoryAllocationProps) {
  const totalAmount = categories.reduce((sum, cat) => sum + cat.amount, 0);

  return (
    <InsightCard>
      <div className="flex justify-between items-center mb-3.5">
        <div className="text-[13px] font-bold text-[#0d0d2b]">Alokasi Kategori</div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#bbb" strokeWidth="2" />
          <line x1="12" y1="8" x2="12" y2="12" stroke="#bbb" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="16" r="1" fill="#bbb" />
        </svg>
      </div>

      {/* Donut Chart */}
      <div className="relative w-[150px] h-[150px] mx-auto mb-4">
        <svg width="150" height="150" viewBox="0 0 150 150">
          <circle
            cx="75"
            cy="75"
            r="55"
            fill="none"
            stroke="#1a1a6e"
            strokeWidth="22"
            strokeDasharray="345.4"
            strokeDashoffset="0"
            transform="rotate(-90 75 75)"
          />
          <circle
            cx="75"
            cy="75"
            r="55"
            fill="none"
            stroke="#f0c040"
            strokeWidth="22"
            strokeDasharray="345.4"
            strokeDashoffset="-138.2"
            transform="rotate(-90 75 75)"
          />
          <circle
            cx="75"
            cy="75"
            r="55"
            fill="none"
            stroke="#e07040"
            strokeWidth="22"
            strokeDasharray="345.4"
            strokeDashoffset="-226.3"
            transform="rotate(-90 75 75)"
          />
          <circle
            cx="75"
            cy="75"
            r="55"
            fill="none"
            stroke="#d0d0e0"
            strokeWidth="22"
            strokeDasharray="345.4"
            strokeDashoffset="-295.4"
            transform="rotate(-90 75 75)"
          />
          <circle cx="75" cy="75" r="44" fill="white" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-[9px] text-gray-400 font-semibold uppercase tracking-wide">TOTAL</div>
          <div className="text-lg font-black text-[#0d0d2b]">${totalAmount.toLocaleString()}</div>
        </div>
      </div>

      {/* Category Legend */}
      {categories.map((cat, idx) => (
        <div
          key={idx}
          className={`flex justify-between items-center py-2 ${
            idx < categories.length - 1 ? 'border-b border-[#f0f0f5]' : ''
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: cat.color }} />
            <span className="text-[13px] text-gray-600 font-medium">{cat.name}</span>
          </div>
          <span className="text-[13px] font-bold text-[#0d0d2b]">${cat.amount.toLocaleString()}</span>
        </div>
      ))}
    </InsightCard>
  );
}
