'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Home, TrendingUp, Wallet, User } from 'lucide-react';

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] h-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-slate-100 dark:border-gray-800 flex items-center justify-around px-4 z-50 transition-colors">
      <button 
        onClick={() => router.push('/dashboard')}
        className={`flex flex-col items-center gap-1 transition-colors ${
          isActive('/dashboard')
            ? 'text-blue-600' 
            : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Home size={24} />
        <span className="text-[10px] font-medium">Home</span>
      </button>
      
      <button 
        onClick={() => router.push('/insight')}
        className={`flex flex-col items-center gap-1 transition-colors ${
          isActive('/insight')
            ? 'text-blue-600' 
            : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <TrendingUp size={24} />
        <span className="text-[10px] font-medium">Insight</span>
      </button>
      
      {/* Floating Action Button - Direct to Record Page */}
      <div className="relative -top-6">
        <button 
          onClick={() => router.push('/record')}
          className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
        >
          <div className="w-6 h-6 relative">
            <div className="absolute inset-0 bg-white rounded-sm w-0.5 h-full left-1/2 -translate-x-1/2" />
            <div className="absolute inset-0 bg-white rounded-sm h-0.5 w-full top-1/2 -translate-y-1/2" />
          </div>
        </button>
      </div>

      <button 
        onClick={() => router.push('/budget')}
        className={`flex flex-col items-center gap-1 transition-colors ${
          isActive('/budget')
            ? 'text-blue-600' 
            : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Wallet size={24} />
        <span className="text-[10px] font-medium">Budget</span>
      </button>
      
      <button 
        onClick={() => router.push('/profile')}
        className={`flex flex-col items-center gap-1 transition-colors ${
          isActive('/profile')
            ? 'text-blue-600' 
            : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <User size={24} />
        <span className="text-[10px] font-medium">Akun</span>
      </button>
    </div>
  );
}
