// =====================================================
// FINANCE APP - Amount Display
// =====================================================

'use client';

interface AmountDisplayProps {
  amount: number;
}

export default function AmountDisplay({ amount }: AmountDisplayProps) {
  const formattedAmount = amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="px-5 py-4">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
        Amount to Record
      </p>
      <div className="flex items-baseline gap-1.5">
        <span className="font-nunito text-3xl font-black text-slate-600">$</span>
        <span className="font-nunito text-5xl font-black text-indigo-900 tracking-tight leading-none">
          {formattedAmount}
        </span>
        <span className="inline-block w-0.5 h-9 bg-indigo-900 animate-pulse ml-0.5"></span>
      </div>
    </div>
  );
}
