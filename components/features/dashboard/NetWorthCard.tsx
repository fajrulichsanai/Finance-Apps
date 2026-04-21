import React from 'react';

interface NetWorthCardProps {
  balance: number;
  displayName: string;
}

export const NetWorthCard: React.FC<NetWorthCardProps> = ({ balance, displayName }) => {
  const isDeficit = balance < 0;
  const displayBalance = Math.abs(balance);

  return (
    <>
      <div className="text-[9px] font-bold text-gray-400 tracking-[0.8px] uppercase mb-1">
        Ringkasan Portofolio
      </div>
      <div className="text-[28px] font-extrabold text-[#0d0d2b] mb-2">
        Halo, {displayName}!
      </div>
      <div className="inline-flex items-center gap-1.5 bg-[#e6f9f0] rounded-[20px] px-3 py-1.5 mb-3.5">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6L12 2z" fill="#1a9e6e"/>
          <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="text-xs font-bold text-[#1a9e6e]">Verified Account</span>
      </div>

      <div 
        className="rounded-[20px] px-5 py-[18px] mb-3.5"
        style={{ background: 'linear-gradient(135deg, #1a1a6e 0%, #2a2a8e 60%, #1e3a8a 100%)' }}
      >
        <div className="text-[9px] font-bold text-white/55 tracking-[0.8px] uppercase mb-1.5">
          Total Kekayaan Bersih
        </div>
        <div className="text-[36px] font-extrabold text-white tracking-tight mb-3">
          {isDeficit && <span className="text-red-400">-</span>}
          <sup className="text-[20px] font-bold align-super">Rp</sup>
          {displayBalance.toLocaleString('id-ID')}
        </div>
        <div className="inline-flex items-center gap-1.5 bg-white/[0.12] rounded-[20px] px-3 py-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="17,6 23,6 23,12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-xs font-bold text-white">Pantau kekayaan Anda</span>
        </div>
      </div>
    </>
  );
};
