// =====================================================
// FINANCE APP - Activity Search Bar Component
// =====================================================

import React from 'react';
import { Search } from 'lucide-react';

interface ActivitySearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
}

export default function ActivitySearchBar({ value, onChange, onClear }: ActivitySearchBarProps) {
  return (
    <div className="px-[18px] py-1 pb-5">
      <div className="bg-white rounded-[50px] px-4 py-3 flex items-center gap-2.5">
        <Search className="w-4 h-4 text-gray-400" />
        <input 
          type="text" 
          placeholder="Cari transaksi..." 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 border-none outline-none text-sm text-gray-600 placeholder:text-gray-400 bg-transparent"
          aria-label="Search transactions"
        />
        {value && (
          <button
            onClick={onClear}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1"
            aria-label="Clear search"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
