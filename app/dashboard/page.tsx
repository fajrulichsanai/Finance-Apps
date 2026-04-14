'use client';

import React from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useBalanceSummary, useCurrentMonthSummary, useCategoryBreakdown } from '@/lib/hooks/useStatistics';
import { useRecentTransactions } from '@/lib/hooks/useTransactions';
import { getDisplayName } from '@/lib/utils/user';
import { calculateHealthScore, getHealthStanding } from '@/lib/utils/financial';
import { BUDGET_THRESHOLD, RECENT_TRANSACTIONS_LIMIT, TOP_BUDGET_CATEGORIES } from '@/lib/constants/dashboard';
import { HealthScoreCard } from '@/components/features/dashboard/HealthScoreCard';
import { NetWorthCard } from '@/components/features/dashboard/NetWorthCard';
import { BudgetOverviewCard } from '@/components/features/dashboard/BudgetOverviewCard';
import { AccountsGrid } from '@/components/features/dashboard/AccountsGrid';
import { AIInsightCard } from '@/components/features/dashboard/AIInsightCard';
import { MonthlyStatsCard } from '@/components/features/dashboard/MonthlyStatsCard';
import { RecentActivityList } from '@/components/features/dashboard/RecentActivityList';
import AppHeader from '@/components/shared/AppHeader';
import BottomNav from '@/components/shared/BottomNav';

export default function DashboardPage() {
  const { user, loading } = useAuth();

  // Data hooks
  const { summary: balanceSummary, loading: balanceLoading } = useBalanceSummary();
  const { summary: monthSummary } = useCurrentMonthSummary();
  const { data: categoryData, loading: categoryLoading, error: categoryError } = useCategoryBreakdown('expense');
  const { transactions, loading: transactionsLoading } = useRecentTransactions(RECENT_TRANSACTIONS_LIMIT);

  // Derived data
  const displayName = getDisplayName(user);
  const healthScore = calculateHealthScore(
    monthSummary?.totalIncome || 0,
    monthSummary?.totalExpense || 0
  );
  const healthStanding = getHealthStanding(healthScore);

  // Budget categories with error handling
  const budgetCategories = !categoryError ? categoryData.slice(0, TOP_BUDGET_CATEGORIES).map(cat => {
    const limit = cat.total_amount * BUDGET_THRESHOLD.DEFAULT_MULTIPLIER;
    const percentage = (cat.total_amount / limit) * 100;
    return {
      name: cat.category_name,
      spent: cat.total_amount,
      limit,
      percentage,
    };
  }) : [];

  if (loading || balanceLoading) {
    return (
      <div className="min-h-screen bg-[#f0f0f0] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1a1a6e] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#6b6b80]">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] relative pb-20">
      <div className="w-full max-w-[430px] mx-auto">
        <AppHeader />

        <div className="px-4 overflow-y-auto max-h-[calc(100vh-180px)]">
          <HealthScoreCard score={healthScore} standing={healthStanding} />
          
          <NetWorthCard 
            balance={balanceSummary?.balance || 0}
            displayName={displayName}
          />

          <BudgetOverviewCard 
            categories={budgetCategories} 
            loading={categoryLoading}
            error={categoryError}
          />

          <AccountsGrid 
            cashBalance={balanceSummary?.balance || 0}
            bankBalance={0}
          />

          <AIInsightCard />

          <MonthlyStatsCard 
            type="income"
            amount={monthSummary?.totalIncome || 0}
          />

          <MonthlyStatsCard 
            type="expense"
            amount={monthSummary?.totalExpense || 0}
          />

          <RecentActivityList 
            transactions={transactions}
            loading={transactionsLoading}
          />

          <div className="h-[60px]" />
        </div>

        <BottomNav />
      </div>
    </div>
  );
}