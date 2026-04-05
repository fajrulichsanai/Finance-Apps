'use client';

import React from 'react';
import { Home, PieChart as PieChartIcon, Wallet, MoreHorizontal } from 'lucide-react';

interface BottomNavProps {
  activeTab?: 'home' | 'stats' | 'cards' | 'more';
  onTabChange?: (tab: 'home' | 'stats' | 'cards' | 'more') => void;
}

export default function BottomNav({ activeTab = 'home', onTabChange }: BottomNavProps) {
  const handleTabClick = (tab: 'home' | 'stats' | 'cards' | 'more') => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-xl border-t border-slate-100 flex items-center justify-around px-4 z-50">
      <button 
        onClick={() => handleTabClick('home')}
        className={`flex flex-col items-center gap-1 transition-colors ${
          activeTab === 'home' 
            ? 'text-blue-600' 
            : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Home size={24} />
        <span className="text-[10px] font-medium">Home</span>
      </button>
      
      <button 
        onClick={() => handleTabClick('stats')}
        className={`flex flex-col items-center gap-1 transition-colors ${
          activeTab === 'stats' 
            ? 'text-blue-600' 
            : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <PieChartIcon size={24} />
        <span className="text-[10px] font-medium">Stats</span>
      </button>
      
      {/* Floating Action Button */}
      <div className="relative -top-6">
        <button className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 flex items-center justify-center transition-transform hover:scale-105">
          <div className="w-6 h-6 relative">
            <div className="absolute inset-0 bg-white rounded-sm w-0.5 h-full left-1/2 -translate-x-1/2" />
            <div className="absolute inset-0 bg-white rounded-sm h-0.5 w-full top-1/2 -translate-y-1/2" />
          </div>
        </button>
      </div>

      <button 
        onClick={() => handleTabClick('cards')}
        className={`flex flex-col items-center gap-1 transition-colors ${
          activeTab === 'cards' 
            ? 'text-blue-600' 
            : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Wallet size={24} />
        <span className="text-[10px] font-medium">Cards</span>
      </button>
      
      <button 
        onClick={() => handleTabClick('more')}
        className={`flex flex-col items-center gap-1 transition-colors ${
          activeTab === 'more' 
            ? 'text-blue-600' 
            : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <MoreHorizontal size={24} />
        <span className="text-[10px] font-medium">More</span>
      </button>
    </div>
  );
}
