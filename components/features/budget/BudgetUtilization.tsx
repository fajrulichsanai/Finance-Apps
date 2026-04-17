// =====================================================
// Budget Utilization Donut Chart Component
// =====================================================
// Display budget utilization percentage with donut chart
// =====================================================

'use client';

import React from 'react';

interface BudgetUtilizationProps {
  percentage: number;
  month?: string;
}

export default function BudgetUtilization({
  percentage,
  month = 'bulan ini'
}: BudgetUtilizationProps) {
  // Validate percentage
  const safePercentage = Number.isFinite(percentage) ? Math.min(Math.max(percentage, 0), 100) : 0;
  
  if (!Number.isFinite(percentage)) {
    console.warn('[BudgetUtilization] Invalid percentage:', percentage);
  }

  // Calculate stroke-dashoffset for donut chart
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (safePercentage / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl mx-5 my-3 p-5 shadow-sm border border-gray-100">
      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">
        Utilisasi
      </p>

      {/* Donut Chart */}
      <div className="relative w-30 h-30 mx-auto mb-3.5">
        <svg viewBox="0 0 100 100" className="w-30 h-30 -rotate-90">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#e8ecf8"
            strokeWidth="10"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#1e40af"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeOffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-black text-blue-900">
            {Math.round(safePercentage)}%
          </span>
        </div>
      </div>

      <p className="text-xs text-gray-500 text-center leading-relaxed">
        Anda telah menggunakan {safePercentage.toFixed(1)}% dari limit yang<br />
        ditetapkan untuk {month}.
      </p>
    </div>
  );
}
