// =====================================================
// FINANCE APP - Transaction Date Picker
// =====================================================

'use client';

import { Calendar } from 'lucide-react';

interface TransactionDatePickerProps {
  date: string;
  onChange?: (date: string) => void;
}

export default function TransactionDatePicker({ date, onChange }: TransactionDatePickerProps) {
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    const isToday = d.toDateString() === today.toDateString();

    if (isToday) {
      return `Today, ${d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    }

    return d.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-2xl mx-5 mb-4 p-4 shadow-md">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
        Transaction Date
      </p>
      <div className="flex items-center gap-2.5">
        <Calendar className="w-5 h-5 text-slate-400" strokeWidth={1.8} />
        <span className="text-sm font-semibold text-slate-900">{formatDate(date)}</span>
      </div>
    </div>
  );
}
