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
  loading?: boolean;
  error?: Error | null;
}

export const BudgetOverviewCard: React.FC<BudgetOverviewCardProps> = ({ categories, loading = false, error = null }) => {
  return (
    <div className="bg-white rounded-[18px] px-[18px] py-4 mb-3.5">
      <div className="flex justify-between items-center mb-3.5">
        <span className="text-[9px] font-bold text-gray-400 tracking-[0.8px] uppercase">
          Ikhtisar Anggaran
        </span>
        <span className="text-[11px] font-bold text-[#1a1a6e]">
          {formatMonthYear()}
        </span>
      </div>

      {loading ? (
        <div className="space-y-3.5">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="flex justify-between mb-1.5">
                <div className="h-3 bg-gray-200 rounded w-20"></div>
                <div className="h-3 bg-gray-200 rounded w-12"></div>
              </div>
              <div className="h-1.5 bg-gray-200 rounded mb-1"></div>
              <div className="flex justify-between">
                <div className="h-2 bg-gray-200 rounded w-16"></div>
                <div className="h-2 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="py-6 text-center">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-xs font-semibold text-red-600 mb-1">Gagal Memuat Anggaran</p>
          <p className="text-[10px] text-gray-400">Silakan coba lagi nanti</p>
        </div>
      ) : categories.length > 0 ? (
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
              <span>{formatIDR(budget.spent)} terpakai</span>
              <span>{formatIDR(budget.limit)} batas</span>
            </div>
          </div>
        ))
      ) : (
        <div className="py-6 text-center">
          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-xs font-semibold text-gray-400">Belum ada data</p>
        </div>
      )}
    </div>
  );
};
