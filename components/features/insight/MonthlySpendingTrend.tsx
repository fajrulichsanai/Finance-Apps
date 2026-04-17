// =====================================================
// Monthly Spending Trend Chart with Tab Toggle
// =====================================================

'use client';

import { useState } from 'react';
import InsightCard from './InsightCard';
import { MONTH_LABELS } from '@/lib/constants/insight';

export default function MonthlySpendingTrend() {
  const [activeTab, setActiveTab] = useState<'spending' | 'income'>('spending');

  return (
    <InsightCard>
      <div className="text-[13px] font-bold text-[#0d0d2b] mb-3.5">Tren Pengeluaran Bulanan</div>
      <p className="text-[11px] text-gray-400 mb-2.5">Data historis 6 bulan terakhir</p>

      {/* Tab Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('spending')}
          className={`px-4 py-1 rounded-[20px] text-xs font-bold cursor-pointer border-none transition-colors ${
            activeTab === 'spending' ? 'bg-[#1a1a6e] text-white' : 'bg-[#f0f0f5] text-gray-400'
          }`}
        >
          Pengeluaran
        </button>
        <button
          onClick={() => setActiveTab('income')}
          className={`px-4 py-1 rounded-[20px] text-xs font-bold cursor-pointer border-none transition-colors ${
            activeTab === 'income' ? 'bg-[#1a1a6e] text-white' : 'bg-[#f0f0f5] text-gray-400'
          }`}
        >
          Pemasukan
        </button>
      </div>

      {/* Line Chart SVG - PLACEHOLDER: Replace with real chart library */}
      <div className="w-full h-[110px] mb-2.5 flex items-center justify-center bg-gray-50 rounded text-xs text-gray-400">
        {/* TODO: Integrate Recharts with actual monthlyData prop */}
        Chart visualization pending implementation
      </div>

      {/* Month Labels */}
      <div className="flex justify-between text-[10px] text-[#bbb] font-semibold tracking-wide px-0.5">
        {MONTH_LABELS.map((month) => (
          <span key={month}>{month}</span>
        ))}
      </div>
    </InsightCard>
  );
}
