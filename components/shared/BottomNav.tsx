'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Home, PieChart as PieChartIcon, Wallet, MoreHorizontal } from 'lucide-react';

interface BottomNavProps {
  onAddClick?: () => void;
}

export default function BottomNav({ onAddClick }: BottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-xl border-t border-slate-100 flex items-center justify-around px-4 z-50">
      <button 
        onClick={() => router.push('/dashboard')}
        className={`flex flex-col items-center gap-1 transition-colors ${
          isActive('/dashboard')
            ? 'text-blue-600' 
            : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Home size={24} />
        <span className="text-[10px] font-medium">Beranda</span>
      </button>
      
      <button 
        onClick={() => router.push('/statistics')}
        className={`flex flex-col items-center gap-1 transition-colors ${
          isActive('/statistics')
            ? 'text-blue-600' 
            : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <PieChartIcon size={24} />
        <span className="text-[10px] font-medium">Statistik</span>
      </button>
      
      {/* Floating Action Button */}
      <div className="relative -top-6">
        <button 
          onClick={onAddClick}
          className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 flex items-center justify-center transition-transform hover:scale-105"
        >
          <div className="w-6 h-6 relative">
            <div className="absolute inset-0 bg-white rounded-sm w-0.5 h-full left-1/2 -translate-x-1/2" />
            <div className="absolute inset-0 bg-white rounded-sm h-0.5 w-full top-1/2 -translate-y-1/2" />
          </div>
        </button>
      </div>

      <button 
        onClick={() => router.push('/categories')}
        className={`flex flex-col items-center gap-1 transition-colors ${
          isActive('/categories')
            ? 'text-blue-600' 
            : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Wallet size={24} />
        <span className="text-[10px] font-medium">Dompet</span>
      </button>
      
      <button 
        onClick={() => router.push('/profile')}
        className={`flex flex-col items-center gap-1 transition-colors ${
          isActive('/profile')
            ? 'text-blue-600' 
            : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <MoreHorizontal size={24} />
        <span className="text-[10px] font-medium">Lainnya</span>
      </button>
    </div>
  );
}
