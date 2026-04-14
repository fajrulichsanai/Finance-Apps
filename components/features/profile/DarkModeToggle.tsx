import React from 'react';
import { Moon } from 'lucide-react';

interface DarkModeToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export default function DarkModeToggle({ enabled, onToggle }: DarkModeToggleProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5">
      <div className="flex items-center gap-3">
        <div className="w-[42px] h-[42px] rounded-xl bg-gray-50 flex items-center justify-center">
          <Moon className="w-5 h-5 text-gray-600" />
        </div>
        <div className="text-sm font-bold text-gray-900">Dark Mode</div>
      </div>
      
      <button
        onClick={onToggle}
        className={`relative w-[46px] h-[26px] rounded-full transition-colors ${
          enabled ? 'bg-blue-900' : 'bg-gray-200'
        }`}
        aria-label={enabled ? 'Disable dark mode' : 'Enable dark mode'}
      >
        <div
          className={`absolute top-[3px] left-[3px] w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
