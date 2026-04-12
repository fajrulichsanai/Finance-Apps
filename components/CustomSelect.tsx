// =====================================================
// FINANCE APP - Custom Select Component
// =====================================================
// Description: Custom dropdown component (no native select)
// =====================================================

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  color?: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = 'Pilih opsi',
  label,
  error,
  disabled = false,
  className
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find(opt => opt.value === value);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={cn('relative', className)} ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      
      {/* Select Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'w-full px-4 py-3 bg-white border rounded-xl',
          'flex items-center justify-between gap-2',
          'transition-all duration-200',
          'text-left',
          isOpen && !disabled && 'ring-2 ring-blue-500 border-blue-500',
          !isOpen && !error && 'border-slate-200 hover:border-slate-300',
          error && 'border-red-300 ring-1 ring-red-200',
          disabled && 'bg-slate-50 cursor-not-allowed opacity-60'
        )}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {selectedOption ? (
            <>
              {selectedOption.icon && (
                <div className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                  selectedOption.color || 'bg-slate-100'
                )}>
                  {selectedOption.icon}
                </div>
              )}
              <span className="text-slate-900 truncate">{selectedOption.label}</span>
            </>
          ) : (
            <span className="text-slate-400">{placeholder}</span>
          )}
        </div>
        
        <ChevronDown 
          className={cn(
            'w-5 h-5 text-slate-400 transition-transform duration-200 flex-shrink-0',
            isOpen && 'rotate-180'
          )} 
        />
      </button>

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
          <div className="max-h-60 overflow-y-auto">
            {options.length === 0 ? (
              <div className="px-4 py-3 text-sm text-slate-400 text-center">
                Tidak ada opsi tersedia
              </div>
            ) : (
              options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    'w-full px-4 py-3 flex items-center gap-2',
                    'hover:bg-slate-50 transition-colors duration-150',
                    'text-left',
                    value === option.value && 'bg-blue-50'
                  )}
                >
                  {option.icon && (
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                      option.color || 'bg-slate-100'
                    )}>
                      {option.icon}
                    </div>
                  )}
                  <span className="flex-1 text-slate-900 truncate">{option.label}</span>
                  {value === option.value && (
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
