// =====================================================
// FINANCE APP - Budget Summary Component
// =====================================================
// Description: Compact budget overview for dashboard
// =====================================================

'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Wallet, TrendingUp, TrendingDown, AlertTriangle, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useExpenseBudgets } from '@/lib/hooks/useCategories';

// Format currency to IDR
const formatIDR = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Compact version
const formatCompact = (amount: number) => {
  if (amount >= 1000000) {
    return `Rp ${(amount / 1000000).toFixed(1)}jt`;
  } else if (amount >= 1000) {
    return `Rp ${(amount / 1000).toFixed(0)}rb`;
  }
  return `Rp ${amount.toFixed(0)}`;
};

export default function BudgetSummary() {
  const router = useRouter();
  const { 
    totalBudget, 
    totalSpent, 
    totalRemaining, 
    hasOverBudget,
    hasWarnings,
    overBudgetCategories,
    loading 
  } = useExpenseBudgets();

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-pulse">
        <div className="h-20 bg-gray-100 rounded" />
      </div>
    );
  }

  const budgetPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-5 shadow-sm border border-blue-100"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">Budget Bulanan</h3>
            <p className="text-xs text-gray-500">Pengeluaran kategori</p>
          </div>
        </div>
        <button
          onClick={() => router.push('/categories')}
          className="p-2 hover:bg-white/50 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Budget Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3">
          <p className="text-xs text-gray-600 mb-1">Budget</p>
          <p className="font-bold text-gray-900 text-sm">{formatCompact(totalBudget)}</p>
        </div>
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3">
          <p className="text-xs text-gray-600 mb-1">Terpakai</p>
          <p className="font-bold text-gray-900 text-sm">{formatCompact(totalSpent)}</p>
        </div>
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3">
          <p className="text-xs text-gray-600 mb-1">Sisa</p>
          <p className={`font-bold text-sm ${totalRemaining < 0 ? 'text-red-500' : 'text-green-600'}`}>
            {formatCompact(totalRemaining)}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-600">Penggunaan Budget</span>
          <span className={`text-xs font-semibold ${
            budgetPercentage >= 100 ? 'text-red-500' :
            budgetPercentage >= 80 ? 'text-orange-500' :
            'text-green-600'
          }`}>
            {budgetPercentage.toFixed(0)}%
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(budgetPercentage, 100)}%` }}
            transition={{ duration: 0.5 }}
            className={`h-full ${
              budgetPercentage >= 100 ? 'bg-red-500' :
              budgetPercentage >= 80 ? 'bg-orange-500' :
              'bg-green-500'
            }`}
          />
        </div>
      </div>

      {/* Alerts */}
      {hasOverBudget && (
        <div className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg text-xs">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span className="font-medium">
            {overBudgetCategories.length} kategori melebihi budget!
          </span>
        </div>
      )}
      {hasWarnings && !hasOverBudget && (
        <div className="flex items-center gap-2 px-3 py-2 bg-orange-500 text-white rounded-lg text-xs">
          <TrendingDown className="w-4 h-4 flex-shrink-0" />
          <span className="font-medium">
            Budget hampir habis
          </span>
        </div>
      )}
      {!hasOverBudget && !hasWarnings && totalBudget > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg text-xs">
          <TrendingUp className="w-4 h-4 flex-shrink-0" />
          <span className="font-medium">
            Budget masih aman
          </span>
        </div>
      )}
    </motion.div>
  );
}
