import React from 'react';
import Link from 'next/link';
import { getIconComponent } from '@/lib/utils/icons';
import { formatIDR } from '@/lib/utils/currency';
import type { Transaction } from '@/lib/services/transactions';

interface RecentActivityListProps {
  transactions: Transaction[];
  loading: boolean;
}

export const RecentActivityList: React.FC<RecentActivityListProps> = ({ transactions, loading }) => {

  return (
    <div className="bg-[#f7f7f9] rounded-[18px] px-[18px] py-4 mb-3.5">
      <div className="flex justify-between items-center mb-3.5">
        <span className="text-[15px] font-bold text-[#0d0d2b]">Aktivitas Terbaru</span>
        <Link href="/activity" className="text-xs font-bold text-[#1a1a6e] no-underline">
          Lihat Semua
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 py-2.5 animate-pulse">
              <div className="w-[38px] h-[38px] rounded-[10px] bg-gray-200 flex-shrink-0"></div>
              <div className="flex-1">
                <div className="h-3 bg-gray-200 rounded w-24 mb-1.5"></div>
                <div className="h-2.5 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-12"></div>
            </div>
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="py-6 text-center">
          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-xs font-semibold text-gray-400">Belum ada transaksi</p>
        </div>
      ) : (
        transactions.slice(0, 3).map((tx) => {
          const IconComponent = getIconComponent(tx.category_icon || 'Wallet');
          return (
            <div key={tx.id} className="flex items-center gap-3 py-2.5 border-t border-[#d8d8e0] first:border-t-0">
              <div 
                className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: tx.category_color ? `${tx.category_color}20` : '#dddde8' }}
              >
                <IconComponent 
                  size={18} 
                  style={{ color: tx.category_color || '#6b7280' }}
                />
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-bold text-[#0d0d2b]">{tx.description}</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wide mt-0.5">
                  {tx.type === 'income' ? 'Pemasukan' : (tx.category_name || 'Tanpa Kategori')}
                </div>
              </div>
              <div className={`text-sm font-bold ${tx.type === 'income' ? 'text-[#1a9e6e]' : 'text-[#e74c3c]'}`}>
                {tx.type === 'income' ? '+' : '-'}{formatIDR(Math.abs(tx.amount))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
