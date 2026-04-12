// =====================================================
// FINANCE APP - Payment Account Selector
// =====================================================

'use client';

import { CreditCard, ChevronDown } from 'lucide-react';

interface PaymentAccountSelectorProps {
  accountName: string;
  onClick?: () => void;
}

export default function PaymentAccountSelector({ 
  accountName, 
  onClick 
}: PaymentAccountSelectorProps) {
  return (
    <div className="bg-white rounded-2xl mx-5 mb-4 p-4 shadow-md">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
        Payment Account
      </p>
      <button
        type="button"
        onClick={onClick}
        className="w-full flex items-center justify-between group"
      >
        <div className="flex items-center gap-2.5">
          <CreditCard className="w-5 h-5 text-slate-400" strokeWidth={1.8} />
          <span className="text-sm font-semibold text-slate-900">{accountName}</span>
        </div>
        <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" strokeWidth={2.2} />
      </button>
    </div>
  );
}
