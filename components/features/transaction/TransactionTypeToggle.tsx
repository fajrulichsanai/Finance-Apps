// =====================================================
// FINANCE APP - Transaction Type Toggle
// =====================================================

'use client';

import type { TransactionType } from '@/types';

interface TransactionTypeToggleProps {
  value: TransactionType;
  onChange: (type: TransactionType) => void;
}

export default function TransactionTypeToggle({ value, onChange }: TransactionTypeToggleProps) {
  return (
    <div className="px-5 pb-2">
      <div className="bg-white rounded-full p-1 flex shadow-md">
        <button
          type="button"
          onClick={() => onChange('expense')}
          className={`flex-1 py-2.5 px-4 rounded-full text-sm font-bold transition-all ${
            value === 'expense'
              ? 'bg-indigo-900 text-white shadow-lg shadow-indigo-900/30'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Expense
        </button>
        <button
          type="button"
          onClick={() => onChange('income')}
          className={`flex-1 py-2.5 px-4 rounded-full text-sm font-bold transition-all ${
            value === 'income'
              ? 'bg-indigo-900 text-white shadow-lg shadow-indigo-900/30'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Income
        </button>
      </div>
    </div>
  );
}
