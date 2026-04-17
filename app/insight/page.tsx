// =====================================================
// FINANCE APP - Insight Page (Refactored)
// =====================================================
// Clean, maintainable structure with separated components
// =====================================================

'use client';

import AppHeader from '@/components/shared/AppHeader';
import BottomNav from '@/components/shared/BottomNav';
import InsightHero from '@/components/features/insight/InsightHero';
import HealthScore from '@/components/features/insight/HealthScore';
import MonthOverMonth from '@/components/features/insight/MonthOverMonth';
import CategoryAllocation from '@/components/features/insight/CategoryAllocation';
import SmartRecommendations from '@/components/features/insight/SmartRecommendations';
import MonthlySpendingTrend from '@/components/features/insight/MonthlySpendingTrend';
import StatCard from '@/components/features/insight/StatCard';
import InsightSkeleton from '@/components/features/insight/InsightSkeleton';
import { useBalanceSummary, useCurrentMonthSummary, useCategoryBreakdown, useMonthlyData } from '@/lib/hooks/useStatistics';
import { formatIDR } from '@/lib/utils/currency';

export default function InsightPage() {
  const { summary: balanceSummary, loading: balanceLoading } = useBalanceSummary();
  const { summary: monthSummary } = useCurrentMonthSummary();
  const { data: categoryData, loading: categoryLoading } = useCategoryBreakdown('expense');
  const { data: monthlyData } = useMonthlyData(6);

  // Calculate savings (total income - total expense)
  const totalSavings = balanceSummary?.balance || 0;
  
  // Calculate month-over-month change
  const previousMonth = monthlyData[1]?.balance || 0;
  const currentMonth = monthlyData[0]?.balance || 0;
  const savingsChange = previousMonth > 0 
    ? ((currentMonth - previousMonth) / previousMonth) * 100 
    : 0;

  // Calculate expense against a target (80% of income as target)
  const monthlyIncome = monthSummary?.totalIncome || 0;
  const monthlyExpense = monthSummary?.totalExpense || 0;
  const expenseTarget = monthlyIncome * 0.8;
  const expenseProgress = expenseTarget > 0 ? (monthlyExpense / expenseTarget) * 100 : 0;

  // Projected net (assuming current spending velocity continues)
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const currentDay = new Date().getDate();
  const projectedMonthlyExpense = (monthlyExpense / currentDay) * daysInMonth;
  const projectedNet = monthlyIncome - projectedMonthlyExpense;

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

  // Transform category data for CategoryAllocation component
  const categories = categoryData.map(cat => ({
    name: cat.category_name,
    amount: cat.total_amount,
    color: cat.category_color || '#3b82f6',
    percentage: cat.percentage || 0
  }));

  if (balanceLoading || categoryLoading) {
    return <InsightSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#f2f2f5] dark:bg-gray-900 relative pb-24 transition-colors">
      <div className="w-full max-w-[430px] mx-auto">
        <AppHeader />

        <div className="px-4">
          <InsightHero />
          <HealthScore />
          <MonthOverMonth />
          <CategoryAllocation categories={categories} />
          <SmartRecommendations recommendations={[]} />
          <MonthlySpendingTrend />

          <StatCard
            variant="success"
            label="Total Tabungan"
            value={formatIDR(totalSavings)}
            description={`${savingsChange >= 0 ? '+' : ''}${savingsChange.toFixed(1)}% vs bulan lalu`}
            changeIndicator={savingsChange >= 0 ? "increase" : "decrease"}
          />

          <StatCard
            variant="danger"
            label="Target Pengeluaran"
            value={formatIDR(expenseTarget)}
            description={`${expenseProgress.toFixed(0)}% dari limit bulanan terpakai`}
            progress={expenseProgress}
          />

          <StatCard
            variant="gray"
            label="Proyeksi Net"
            value={`${projectedNet >= 0 ? '+' : ''}${formatIDR(projectedNet)}`}
            description="Berdasarkan pendapatan berulang dan kecepatan pengeluaran saat ini."
            icon={projectedNetIcon}
          />

          <div className="h-2" />
        </div>

        <BottomNav />
      </div>
    </div>
  );
}
