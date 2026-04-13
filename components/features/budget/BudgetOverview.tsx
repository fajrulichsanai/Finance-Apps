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

export default function BudgetOverview({
  totalSpent,
  monthlyGoal,
  remaining
}: BudgetOverviewProps) {
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
          Rp{Math.floor(totalSpent / 1000).toLocaleString('id-ID')}
          <span className="text-3xl">,000</span>
        </h2>

        <div className="flex gap-7">
          <div>
            <p className="text-[10px] font-semibold text-white/50 uppercase tracking-wide mb-0.5">
              Target Bulanan
            </p>
            <p className="text-base font-black text-white">
              Rp{monthlyGoal.toLocaleString('id-ID')}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-white/50 uppercase tracking-wide mb-0.5">
              Sisa
            </p>
            <p className="text-base font-black text-green-400">
              Rp{remaining.toLocaleString('id-ID')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
