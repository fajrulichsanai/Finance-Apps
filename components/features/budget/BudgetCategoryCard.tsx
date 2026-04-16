// =====================================================
// Budget Category Card Component
// =====================================================
// Reusable card for displaying budget category info
// =====================================================

'use client';

import React from 'react';
import { LucideIcon, Trash2 } from 'lucide-react';

interface BudgetCategoryCardProps {
  name: string;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  transactionCount: number;
  spent: number;
  limit: number;
  isOverBudget?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function BudgetCategoryCard({
  name,
  icon: Icon,
  iconColor,
  iconBgColor,
  transactionCount,
  spent,
  limit,
  isOverBudget = false,
  onEdit,
  onDelete
}: BudgetCategoryCardProps) {
  const percentage = limit > 0 ? (spent / limit) * 100 : 0;
  const isWarning = percentage >= 80 && percentage < 100;

  const progressColor = isOverBudget 
    ? 'bg-red-500' 
    : isWarning 
    ? 'bg-orange-500' 
    : 'bg-green-500';

  const buttonStyle = isOverBudget
    ? 'bg-red-500 text-white hover:bg-red-600'
    : 'bg-gray-100 text-gray-900 hover:bg-gray-200';

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-fade-up">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div 
          className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0`}
          style={{ backgroundColor: iconBgColor }}
        >
          <Icon className="w-5 h-5" style={{ color: iconColor }} />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900">{name}</h3>
          <p className="text-xs text-gray-500">{transactionCount} transaksi</p>
        </div>
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
            title="Hapus kategori"
          >
            <Trash2 className="w-5 h-5" strokeWidth={1.5} />
          </button>
        )}
      </div>

      {/* Amounts */}
      <div className="flex justify-between items-end mb-2">
        <div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-0.5">
            Terpakai
          </p>
          <p className={`text-base font-bold ${isOverBudget ? 'text-red-500' : 'text-gray-900'}`}>
            Rp{spent.toLocaleString('id-ID')}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-0.5">
            Limit
          </p>
          <p className="text-sm font-bold text-gray-600">
            Rp{limit.toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      {/* Action Button */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onEdit?.();
        }}
        className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all active:scale-98 ${buttonStyle}`}
      >
        {isOverBudget ? 'Sesuaikan Budget' : 'Atur Budget'}
      </button>
    </div>
  );
}
