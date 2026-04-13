import React from 'react';
import type { SpendingAnomaly } from '@/lib/constants/assistant';

interface SpendingAnomalyCardProps {
  data: SpendingAnomaly;
}

export default function SpendingAnomalyCard({ data }: SpendingAnomalyCardProps) {
  const getBarColor = (level: 'low' | 'mid' | 'high') => {
    switch (level) {
      case 'low': return 'bg-slate-200';
      case 'mid': return 'bg-slate-300';
      case 'high': return 'bg-red-600';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-md my-1 animate-fade-up">
      <div className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-2">
        Spending Anomaly
      </div>
      
      <div className="font-nunito text-[22px] font-extrabold text-[#12205e] leading-tight mb-1.5 whitespace-pre-line">
        {data.category}
      </div>
      
      <div className="flex items-baseline gap-2 mb-3.5">
        <div className="font-nunito text-[26px] font-extrabold text-red-600">
          +${data.amount.toFixed(2)}
        </div>
        <span className="text-[11px] text-gray-400 font-medium">
          {data.vsAverage}
        </span>
      </div>
      
      {/* Bar Chart */}
      <div className="flex items-end gap-1.5 h-14 pt-1">
        {data.chartData.map((bar, index) => (
          <div 
            key={index}
            className={`flex-1 rounded-t ${getBarColor(bar.level)} transition-all`}
            style={{ height: `${bar.height}%` }}
          />
        ))}
      </div>
    </div>
  );
}
