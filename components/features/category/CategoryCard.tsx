// =====================================================
// FINANCE APP - Category Card Component
// =====================================================
// Description: Display category with budget tracking
// =====================================================

'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Edit2, Trash2, AlertTriangle, TrendingDown } from 'lucide-react';
import * as Icons from 'lucide-react';
import type { CategoryWithBudget } from '@/lib/services/categories';

interface CategoryCardProps {
  category: CategoryWithBudget;
  onEdit?: (category: CategoryWithBudget) => void;
  onDelete?: (category: CategoryWithBudget) => void;
}

// Helper to get icon component
const getIconComponent = (iconName: string) => {
  const IconComponent = (Icons as any)[iconName];
  return IconComponent || Icons.Wallet;
};

// Format currency to IDR
const formatIDR = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  const IconComponent = getIconComponent(category.icon);
  
  const budget = Number(category.budget);
  const spent = Number(category.total_spent);
  const remaining = Number(category.remaining_budget);
  const percentage = budget > 0 ? (spent / budget) * 100 : 0;

  // Status colors
  const isOverBudget = remaining < 0;
  const isWarning = !isOverBudget && remaining < budget * 0.2 && budget > 0;

  const getStatusColor = () => {
    if (isOverBudget) return 'text-red-500';
    if (isWarning) return 'text-orange-500';
    return 'text-green-500';
  };

  const getProgressColor = () => {
    if (isOverBudget) return 'bg-red-500';
    if (isWarning) return 'bg-orange-500';
    return 'bg-green-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${category.color}20` }}
          >
            <IconComponent 
              className="w-6 h-6" 
              style={{ color: category.color }}
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{category.name}</h3>
            <p className="text-xs text-gray-500">
              {category.transaction_count} transaksi
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(category)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4 text-gray-600" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(category)}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          )}
        </div>
      </div>

      {/* Budget info - only for expense categories */}
      {category.type === 'expense' && budget > 0 && (
        <>
          {/* Budget amounts */}
          <div className="space-y-2 mb-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Budget</span>
              <span className="font-semibold text-gray-900">
                {formatIDR(budget)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Terpakai</span>
              <span className="font-semibold text-gray-900">
                {formatIDR(spent)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Sisa</span>
              <span className={`font-semibold ${getStatusColor()}`}>
                {formatIDR(remaining)}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-500">Penggunaan</span>
              <span className={`text-xs font-semibold ${getStatusColor()}`}>
                {percentage.toFixed(1)}%
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(percentage, 100)}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className={`h-full ${getProgressColor()}`}
              />
            </div>
          </div>

          {/* Warning/Alert */}
          {isOverBudget && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-xs text-red-600">
                Over budget {formatIDR(Math.abs(remaining))}
              </p>
            </div>
          )}
          {isWarning && !isOverBudget && (
            <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 rounded-lg">
              <TrendingDown className="w-4 h-4 text-orange-500 flex-shrink-0" />
              <p className="text-xs text-orange-600">
                Budget hampir habis
              </p>
            </div>
          )}
        </>
      )}

      {/* Income category - simple display */}
      {category.type === 'income' && (
        <div className="pt-2 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total</span>
            <span className="font-semibold text-green-600">
              {formatIDR(spent)}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
