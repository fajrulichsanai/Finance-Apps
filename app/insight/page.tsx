// =====================================================
// FINANCE APP - Insight Page (Refactored)
// =====================================================
// Clean, maintainable structure with separated components
// =====================================================

'use client';

import InsightHeader from '@/components/features/insight/InsightHeader';
import InsightHero from '@/components/features/insight/InsightHero';
import HealthScore from '@/components/features/insight/HealthScore';
import MonthOverMonth from '@/components/features/insight/MonthOverMonth';
import CategoryAllocation from '@/components/features/insight/CategoryAllocation';
import SmartRecommendations from '@/components/features/insight/SmartRecommendations';
import MonthlySpendingTrend from '@/components/features/insight/MonthlySpendingTrend';
import StatCard from '@/components/features/insight/StatCard';
import InsightBottomNav from '@/components/features/insight/InsightBottomNav';
import { MOCK_CATEGORIES, MOCK_RECOMMENDATIONS } from '@/lib/constants/insight';

export default function InsightPage() {
  const projectedNetIcon = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="inline align-middle mr-1">
      <polyline
        points="3,18 8,12 13,15 18,8 21,11"
        stroke="#aaa"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div className="min-h-screen bg-[#f2f2f5] relative pb-[90px]">
      <div className="w-full max-w-[430px] mx-auto">
        <InsightHeader />

        <div className="px-4">
          <InsightHero />
          <HealthScore />
          <MonthOverMonth />
          <CategoryAllocation categories={MOCK_CATEGORIES} />
          <SmartRecommendations recommendations={MOCK_RECOMMENDATIONS} />
          <MonthlySpendingTrend />

          <StatCard
            variant="success"
            label="Total Savings"
            value="$12,450.00"
            description="+12.5% vs last month"
            changeIndicator="increase"
          />

          <StatCard
            variant="danger"
            label="Expense Target"
            value="$3,200.00"
            description="85% of monthly limit used"
            progress={85}
          />

          <StatCard
            variant="gray"
            label="Projected Net"
            value="+$2,104.50"
            description="Based on your recurring income and current spending velocity."
            icon={projectedNetIcon}
          />

          <div className="h-2" />
        </div>

        <InsightBottomNav />
      </div>
    </div>
  );
}
