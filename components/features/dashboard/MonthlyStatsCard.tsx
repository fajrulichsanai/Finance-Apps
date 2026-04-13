import React from 'react';
import { formatIDR } from '@/lib/utils/currency';

interface MonthlyStatsCardProps {
  type: 'income' | 'expense';
  amount: number;
}

export const MonthlyStatsCard: React.FC<MonthlyStatsCardProps> = ({ type, amount }) => {
  const isIncome = type === 'income';
  
  return (
    <div className="bg-white rounded-[18px] px-[18px] py-4 mb-3">
      <div className="flex items-center gap-3.5">
        <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${
          isIncome ? 'bg-[#e6f9f0]' : 'bg-[#fff0f0]'
        }`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path 
              d={isIncome ? "M12 5v14M19 12l-7 7-7-7" : "M12 19V5M5 12l7-7 7 7"}
              stroke={isIncome ? "#1a9e6e" : "#e74c3c"}
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="flex-1">
          <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">
            {isIncome ? 'Monthly Income' : 'Monthly Expenses'}
          </div>
          <div className="text-2xl font-extrabold text-[#0d0d2b]">
            {formatIDR(amount)}
          </div>
        </div>
        <div className="text-right">
          <div className={`text-xs font-bold ${isIncome ? 'text-[#1a9e6e]' : 'text-[#e74c3c]'}`}>
            {isIncome ? '+' : '-'} {formatIDR(amount)}
          </div>
        </div>
      </div>
    </div>
  );
};
