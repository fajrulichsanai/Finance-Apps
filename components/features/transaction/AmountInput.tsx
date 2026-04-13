// =====================================================
// FINANCE APP - Amount Input Component
// =====================================================
// IDR currency input with auto-formatting
// =====================================================

'use client';

import { useState, useEffect } from 'react';

interface AmountInputProps {
  value: number;
  onChange: (value: number) => void;
  type?: 'income' | 'expense';
}

export default function AmountInput({ value, onChange, type = 'expense' }: AmountInputProps) {
  const [displayValue, setDisplayValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    // Format display value when value prop changes
    setDisplayValue(formatNumber(value));
  }, [value]);

  const formatNumber = (num: number): string => {
    if (num === 0) return '';
    return num.toLocaleString('id-ID');
  };

  const parseNumber = (str: string): number => {
    const cleaned = str.replace(/\D/g, '');
    return cleaned ? parseInt(cleaned, 10) : 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericValue = parseNumber(inputValue);
    
    onChange(numericValue);
    setDisplayValue(formatNumber(numericValue));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter
    if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      (e.keyCode === 88 && e.ctrlKey === true)) {
      return;
    }
    // Ensure it's a number
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  };

  const colorClass = type === 'income' ? 'text-emerald-600' : 'text-indigo-900';
  const cursorClass = isFocused ? 'border-r-2 border-indigo-900 animate-pulse' : '';

  return (
    <div className="px-5 py-6 bg-white mx-5 mb-4 rounded-2xl shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
        Jumlah Transaksi
      </p>
      <div className="flex items-baseline gap-2">
        <span className="font-nunito text-2xl font-black text-slate-600">Rp</span>
        <input
          type="text"
          value={displayValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="0"
          className={`font-nunito text-5xl font-black ${colorClass} tracking-tight leading-none bg-transparent border-none outline-none flex-1 ${cursorClass}`}
          style={{ minWidth: '120px' }}
        />
      </div>
      {value > 0 && (
        <p className="text-xs text-slate-500 mt-3">
          {new Intl.NumberFormat('id-ID', { 
            style: 'currency', 
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          }).format(value)}
        </p>
      )}
    </div>
  );
}
