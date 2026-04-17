// =====================================================
// FINANCE APP - Transaction Section Component
// =====================================================

import React from 'react';
import { ActivitySection } from '@/types';
import TransactionCard from './TransactionCard';

interface TransactionSectionProps {
  section: ActivitySection;
  isLast: boolean;
  onDeleteTransaction?: (id: string) => void;
  deletingId?: string | null;
}

export default function TransactionSection({ 
  section, 
  isLast, 
  onDeleteTransaction,
  deletingId 
}: TransactionSectionProps) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-3">
        <span className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">
          {section.label}
        </span>
        <span className="text-xs font-semibold text-gray-400">
          {section.date}
        </span>
      </div>

      {section.transactions.map((transaction) => (
        <TransactionCard 
          key={transaction.id} 
          transaction={transaction}
          onDelete={onDeleteTransaction}
          deleting={deletingId === transaction.id}
        />
      ))}

      {!isLast && <div className="h-[18px]" />}
    </div>
  );
}
