// =====================================================
// FINANCE APP - Transaction Card Component
// =====================================================

import React from 'react';
import { ActivityTransaction } from '@/types';
import TransactionIcon from './TransactionIcon';

interface TransactionCardProps {
  transaction: ActivityTransaction;
}

export default function TransactionCard({ transaction }: TransactionCardProps) {
  const isIncome = transaction.type === 'income';
  
  return (
    <div className="bg-white rounded-[18px] p-3.5 px-4 mb-2.5 flex items-start gap-3">
      <div className={`w-[46px] h-[46px] rounded-[14px] flex items-center justify-center flex-shrink-0 ${
        isIncome ? 'bg-[#e6f9f0]' : 'bg-[#f0f0f5]'
      }`}>
        <TransactionIcon iconType={transaction.icon} />
      </div>
      
      <div className="flex-1">
        <div className="text-sm font-bold text-[#0d0d2b] mb-0.5">
          {transaction.name}
        </div>
        <div className="text-xs text-gray-400 leading-relaxed">
          {transaction.category} • {transaction.description}
        </div>
      </div>
      
      <div className="text-right flex-shrink-0">
        <div className={`text-[15px] font-bold mb-1 ${
          isIncome ? 'text-[#1a9e6e]' : 'text-[#0d0d2b]'
        }`}>
          {isIncome ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
        </div>
        <div className="text-[11px] text-[#bbb]">
          {transaction.time}
        </div>
      </div>
    </div>
  );
}
