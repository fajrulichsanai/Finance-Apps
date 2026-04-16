import React from 'react';
import Link from 'next/link';
import { CATEGORY_ICONS, DEFAULT_CATEGORY_ICON } from '@/lib/constants/dashboard';
import { formatIDR } from '@/lib/utils/currency';
import type { Transaction } from '@/lib/services/transactions';

interface RecentActivityListProps {
  transactions: Transaction[];
  loading: boolean;
}

export const RecentActivityList: React.FC<RecentActivityListProps> = ({ transactions, loading }) => {
  const getIconComponent = (iconName?: string) => {
    if (!iconName) return DEFAULT_CATEGORY_ICON;
    return CATEGORY_ICONS[iconName] || DEFAULT_CATEGORY_ICON;
  };

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
        <p className="text-sm text-gray-400 text-center py-4">Belum ada transaksi</p>
      ) : (
        transactions.slice(0, 3).map((tx) => {
          const IconComponent = getIconComponent(tx.category_icon);
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
