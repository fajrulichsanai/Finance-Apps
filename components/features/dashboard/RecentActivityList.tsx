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
    <div className="bg-[#ebebf0] rounded-[18px] px-[18px] py-4 mb-3.5">
      <div className="flex justify-between items-center mb-3.5">
        <span className="text-[15px] font-bold text-[#0d0d2b]">Recent Activity</span>
        <Link href="/activity" className="text-xs font-bold text-[#1a1a6e] no-underline">
          View All
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <div className="w-6 h-6 border-4 border-[#1a1a6e] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-gray-400">Loading...</p>
        </div>
      ) : transactions.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">No transactions yet</p>
      ) : (
        transactions.slice(0, 3).map((tx) => {
          const IconComponent = getIconComponent(tx.category_icon);
          return (
            <div key={tx.id} className="flex items-center gap-3 py-2.5 border-t border-[#d8d8e0] first:border-t-0">
              <div className="w-[38px] h-[38px] rounded-[10px] bg-[#dddde8] flex items-center justify-center flex-shrink-0">
                <IconComponent size={18} className="text-gray-500" />
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-bold text-[#0d0d2b]">{tx.description}</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wide mt-0.5">
                  {tx.type === 'income' ? 'Income' : (tx.category_name || 'Uncategorized')}
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
