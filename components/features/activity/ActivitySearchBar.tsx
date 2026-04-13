// =====================================================
// FINANCE APP - Activity Search Bar Component
// =====================================================

import React from 'react';
import { Search } from 'lucide-react';

interface ActivitySearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ActivitySearchBar({ value, onChange }: ActivitySearchBarProps) {
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
        />
        <div className="flex gap-1.5 items-center">
          <button 
            className="w-8 h-8 rounded-full bg-[#f2f2f5] flex items-center justify-center cursor-pointer border-none hover:bg-gray-200 transition-colors"
            aria-label="Filter"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M7 12h10M10 18h4" stroke="#666" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <button 
            className="w-8 h-8 rounded-full bg-[#f2f2f5] flex items-center justify-center cursor-pointer border-none hover:bg-gray-200 transition-colors"
            aria-label="Sort"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 3v18M3 8l9-5 9 5" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
