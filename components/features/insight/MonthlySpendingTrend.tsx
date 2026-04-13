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

      {/* Line Chart SVG */}
      <svg className="w-full h-[110px] mb-2.5" viewBox="0 0 320 110" preserveAspectRatio="none">
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1a6e" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#1a1a6e" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0,70 C30,65 50,40 80,50 C110,60 130,30 160,45 C190,60 210,25 240,35 C270,45 295,55 320,40"
          fill="none"
          stroke="#1a1a6e"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M0,70 C30,65 50,40 80,50 C110,60 130,30 160,45 C190,60 210,25 240,35 C270,45 295,55 320,40 L320,110 L0,110 Z"
          fill="url(#grad)"
        />
      </svg>

      {/* Month Labels */}
      <div className="flex justify-between text-[10px] text-[#bbb] font-semibold tracking-wide px-0.5">
        {MONTH_LABELS.map((month) => (
          <span key={month}>{month}</span>
        ))}
      </div>
    </InsightCard>
  );
}
