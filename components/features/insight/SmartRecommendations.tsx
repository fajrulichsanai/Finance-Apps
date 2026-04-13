// =====================================================
// Smart Recommendations Section
// =====================================================

import InsightCard from './InsightCard';
import { Recommendation } from '@/types';

interface SmartRecommendationsProps {
  recommendations: Recommendation[];
}

export default function SmartRecommendations({ recommendations }: SmartRecommendationsProps) {
  return (
    <InsightCard variant="primary">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-[34px] h-[34px] rounded-[10px] bg-white bg-opacity-15 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2a7 7 0 0 1 7 7c0 3-1.5 5-4 6.5V18H9v-2.5C6.5 14 5 12 5 9a7 7 0 0 1 7-7z"
              stroke="white"
              strokeWidth="2"
            />
            <line x1="9" y1="21" x2="15" y2="21" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <span className="text-base font-extrabold text-white">Smart Recommendations</span>
      </div>

      {recommendations.map((rec) => (
        <div key={rec.id} className="flex gap-2 items-start mb-2.5">
          <div className="w-[18px] h-[18px] rounded-full border-[1.5px] border-white border-opacity-40 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg width="10" height="10" viewBox="0 0 12 12">
              <path
                d="M2 6l3 3 5-5"
                stroke="rgba(255,255,255,0.6)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="text-xs text-white text-opacity-75 leading-relaxed">
            {rec.text} <strong className="text-white">{rec.highlight}</strong>
            {rec.id === 1 ? ' immediately.' : ''}
          </p>
        </div>
      ))}

      <button className="w-full mt-3.5 py-3 px-4 rounded-[50px] bg-transparent border-[1.5px] border-white border-opacity-40 text-white text-[13px] font-bold cursor-pointer flex items-center justify-center gap-1.5 hover:bg-white hover:bg-opacity-10 transition-colors">
        Implement All Suggestions ✦
      </button>
    </InsightCard>
  );
}
