'use client';

import React from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useDashboardData } from '@/lib/hooks/useStatistics';
import { getDisplayName } from '@/lib/utils/user';
import { calculateHealthScore, getHealthStanding } from '@/lib/utils/financial';
import { TOP_BUDGET_CATEGORIES } from '@/lib/constants/dashboard';
import { HealthScoreCard } from '@/components/features/dashboard/HealthScoreCard';
import { NetWorthCard } from '@/components/features/dashboard/NetWorthCard';
import { BudgetOverviewCard } from '@/components/features/dashboard/BudgetOverviewCard';
import { AIInsightCard } from '@/components/features/dashboard/AIInsightCard';
import { MonthlyStatsCard } from '@/components/features/dashboard/MonthlyStatsCard';
import { RecentActivityList } from '@/components/features/dashboard/RecentActivityList';
import AppHeader from '@/components/shared/AppHeader';
import BottomNav from '@/components/shared/BottomNav';
import InstallPrompt from '@/components/shared/InstallPrompt';
import DashboardSkeleton from '@/components/features/dashboard/DashboardSkeleton';

export default function DashboardPage() {
  const { user, loading } = useAuth();

  // OPTIMIZED: Single RPC query instead of 4 separate queries
  // Returns: balanceSummary, monthSummary, categories, recentTransactions
  const { dashboardData, loading: dashboardLoading, error: dashboardError } = useDashboardData();

  // Derived data
  const displayName = getDisplayName(user);
  const monthSummary = dashboardData?.monthSummary;
  const balanceSummary = dashboardData?.balanceSummary;
  const categories = dashboardData?.categories || [];
  const transactions = dashboardData?.recentTransactions || [];

  const healthScore = calculateHealthScore(
    monthSummary?.totalIncome || 0,
    monthSummary?.totalExpense || 0
  );
  const healthStanding = getHealthStanding(healthScore);

  // Budget categories with actual limits from database
  const budgetCategories = categories
    .filter((cat: any) => Number(cat.budget) > 0)
    .slice(0, TOP_BUDGET_CATEGORIES)
    .map((cat: any) => {
      const spent = Number(cat.total_spent) || 0;
      const limit = Number(cat.budget) || 0;
      const percentage = limit > 0 ? (spent / limit) * 100 : 0;
      return {
        name: cat.name,
        spent,
        limit,
        percentage,
      };
    });

  if (loading || dashboardLoading) {
    return <DashboardSkeleton />;
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
            loading={dashboardLoading}
            error={dashboardError}
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
            loading={dashboardLoading}
          />

          <div className="h-[60px]" />
        </div>

        <BottomNav />
        
        {/* PWA Install Prompt */}
        <InstallPrompt />
      </div>
    </div>
  );
}