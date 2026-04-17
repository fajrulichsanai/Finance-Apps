// =====================================================
// Budget Overview Component
// =====================================================
// Display total spent and monthly goal summary
// =====================================================

'use client';

import React from 'react';

interface BudgetOverviewProps {
  totalSpent: number;
  monthlyGoal: number;
  remaining: number;
}

/**
 * Format currency safely, handling invalid numbers
 */
const formatCurrency = (amount: number): string => {
  if (!Number.isFinite(amount)) {
    console.warn('[formatCurrency] Invalid amount:', amount);
    return '0';
  }
  return Math.round(amount).toLocaleString('id-ID');
};

export default function BudgetOverview({
  totalSpent,
  monthlyGoal,
  remaining
}: BudgetOverviewProps) {
  // Validate inputs
  const safeSpent = Number.isFinite(totalSpent) ? totalSpent : 0;
  const safeGoal = Number.isFinite(monthlyGoal) ? monthlyGoal : 0;
  const safeRemaining = Number.isFinite(remaining) ? remaining : 0;

  return (
    <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl mx-5 p-5 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/5 rounded-full" />
      <div className="absolute -bottom-7 right-10 w-24 h-24 bg-white/5 rounded-full" />

      {/* Content */}
      <div className="relative z-10">
        <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-2">
          Total Pengeluaran Bulan Ini
        </p>
        
        <h2 className="text-5xl font-black text-white mb-4">
          Rp{formatCurrency(safeSpent)}
        </h2>

        <div className="flex gap-7">
          <div>
            <p className="text-[10px] font-semibold text-white/50 uppercase tracking-wide mb-0.5">
              Target Bulanan
            </p>
            <p className="text-base font-black text-white">
              Rp{formatCurrency(safeGoal)}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-white/50 uppercase tracking-wide mb-0.5">
              Sisa
            </p>
            <p className={`text-base font-black ${safeRemaining < 0 ? 'text-red-400' : 'text-green-400'}`}>
              Rp{formatCurrency(safeRemaining)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
