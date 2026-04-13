import React from 'react';
import { formatIDR } from '@/lib/utils/currency';

interface AccountsGridProps {
  cashBalance: number;
  bankBalance: number;
}

export const AccountsGrid: React.FC<AccountsGridProps> = ({ cashBalance, bankBalance }) => {
  return (
    <>
      <div className="flex justify-between items-center mb-2.5">
        <span className="text-[9px] font-bold text-gray-400 tracking-[0.8px] uppercase">
          Your Accounts
        </span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="5" cy="12" r="2" fill="#ccc"/>
          <circle cx="12" cy="12" r="2" fill="#1a1a6e"/>
          <circle cx="19" cy="12" r="2" fill="#ccc"/>
        </svg>
      </div>
      <div className="grid grid-cols-2 gap-2.5 mb-3.5">
        <div className="bg-white rounded-2xl px-4 py-3.5">
          <div className="text-[10px] font-bold text-gray-400 mb-1.5 flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="5" width="20" height="14" rx="3" stroke="#1a1a6e" strokeWidth="2"/>
              <path d="M2 10h20" stroke="#1a1a6e" strokeWidth="2"/>
            </svg>
            CASH
          </div>
          <div className="text-xl font-extrabold text-[#0d0d2b]">
            {formatIDR(cashBalance)}
          </div>
        </div>
        <div className="bg-white rounded-2xl px-4 py-3.5">
          <div className="text-[10px] font-bold text-gray-400 mb-1.5 flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 10v11M12 10v11M16 10v11" stroke="#1a1a6e" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            BANK
          </div>
          <div className="text-xl font-extrabold text-[#0d0d2b]">
            {formatIDR(bankBalance)}
          </div>
        </div>
      </div>
    </>
  );
};
