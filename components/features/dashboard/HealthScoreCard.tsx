import React from 'react';

interface HealthScoreCardProps {
  score: number;
  standing: string;
}

export const HealthScoreCard: React.FC<HealthScoreCardProps> = ({ score, standing }) => {
  return (
    <div className="bg-white rounded-[18px] px-4 py-3.5 flex items-center gap-3.5 mb-3.5">
      <div className="relative w-[60px] h-[60px] flex-shrink-0">
        <svg width="60" height="60" viewBox="0 0 60 60" className="-rotate-90">
          <circle cx="30" cy="30" r="24" fill="none" stroke="#f0f0f5" strokeWidth="5"/>
          <circle 
            cx="30" cy="30" r="24" fill="none" stroke="#1a9e6e" strokeWidth="5"
            strokeDasharray="150.8" 
            strokeDashoffset={150.8 - (150.8 * score / 100)} 
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-lg font-extrabold text-[#0d0d2b]">
          {score}
        </div>
      </div>
      <div className="flex-1">
        <div className="text-[9px] font-bold text-gray-400 tracking-[0.8px] uppercase mb-0.5">
          Skor Kesehatan Keuangan
        </div>
        <div className="text-[15px] font-bold text-[#0d0d2b]">{standing}</div>
        <div className="text-[11px] text-gray-500 leading-tight mt-0.5">
          <span className="font-bold text-[#0d0d2b]">Wawasan Cepat:</span> Tingkat tabungan Anda {score}% bulan ini.
        </div>
      </div>
    </div>
  );
};
