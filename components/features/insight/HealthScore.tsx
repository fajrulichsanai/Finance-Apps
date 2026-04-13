// =====================================================
// Health Score Component with Circular Progress
// =====================================================

import InsightCard from './InsightCard';
import { HEALTH_SCORE } from '@/lib/constants/insight';

export default function HealthScore() {
  const { score, label, improvement, strokeDasharray, strokeDashoffset } = HEALTH_SCORE;

  return (
    <InsightCard>
      <div className="text-[13px] font-bold text-[#0d0d2b] mb-3.5">Health Score</div>
      <div className="relative w-[130px] h-[130px] mx-auto my-1 mb-3">
        <svg width="130" height="130" viewBox="0 0 130 130" className="-rotate-90">
          <circle cx="65" cy="65" r="54" fill="none" stroke="#e8f5ee" strokeWidth="10" />
          <circle
            cx="65"
            cy="65"
            r="54"
            fill="none"
            stroke="#1a9e6e"
            strokeWidth="10"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-[30px] font-black text-[#0d0d2b] leading-none">{score}</div>
          <div className="text-[10px] font-bold text-[#1a9e6e] tracking-wide">{label}</div>
        </div>
      </div>
      <div className="text-xs text-gray-500 text-center leading-relaxed mt-1.5">
        Your score increased by {improvement} points this month due to improved savings rate.
      </div>
    </InsightCard>
  );
}
