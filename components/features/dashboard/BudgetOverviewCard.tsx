import React from 'react';
import { formatIDR } from '@/lib/utils/currency';
import { formatMonthYear } from '@/lib/utils/date';
import { getBudgetColor } from '@/lib/utils/financial';

interface BudgetCategory {
  name: string;
  spent: number;
  limit: number;
  percentage: number;
}

interface BudgetOverviewCardProps {
  categories: BudgetCategory[];
}

export const BudgetOverviewCard: React.FC<BudgetOverviewCardProps> = ({ categories }) => {
  return (
    <div className="bg-white rounded-[18px] px-[18px] py-4 mb-3.5">
      <div className="flex justify-between items-center mb-3.5">
        <span className="text-[9px] font-bold text-gray-400 tracking-[0.8px] uppercase">
          Budget Overview
        </span>
        <span className="text-[11px] font-bold text-[#1a1a6e]">
          {formatMonthYear()}
        </span>
      </div>

      {categories.length > 0 ? (
        categories.map((budget, idx) => (
          <div key={idx} className="mb-3.5 last:mb-0">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-bold text-[#0d0d2b]">
                {budget.name.toUpperCase()}
              </span>
              <span className={`text-[13px] font-bold ${budget.percentage > 90 ? 'text-[#e74c3c]' : 'text-[#0d0d2b]'}`}>
                {Math.round(budget.percentage)}%
              </span>
            </div>
            <div className="h-1.5 rounded bg-[#f0f0f5] overflow-hidden mb-1">
              <div 
                className="h-full rounded" 
                style={{ 
                  width: `${Math.min(budget.percentage, 100)}%`,
                  backgroundColor: getBudgetColor(budget.percentage)
                }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-gray-400">
              <span>{formatIDR(budget.spent)} spent</span>
              <span>{formatIDR(budget.limit)} limit</span>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-400 text-center py-4">
          No budget data available
        </p>
      )}
    </div>
  );
};
