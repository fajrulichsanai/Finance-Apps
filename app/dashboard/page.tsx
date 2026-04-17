'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useDashboardData } from '@/lib/hooks/useStatistics';
import { getDisplayName } from '@/lib/utils/user';
import { calculateHealthScore, getHealthStanding } from '@/lib/utils/financial';
import { TOP_BUDGET_CATEGORIES } from '@/lib/constants/dashboard';
import type { DashboardCategoryData, BudgetCategory } from '@/types';
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
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch for InstallPrompt (uses browser APIs)
  useEffect(() => {
    setMounted(true);
  }, []);

  // OPTIMIZED: Single RPC query instead of 4 separate queries
  // Returns: balanceSummary, monthSummary, categories, recentTransactions
  const { dashboardData, loading: dashboardLoading, error: dashboardError } = useDashboardData();

  // Derived data - memoize to prevent unnecessary re-renders
  const displayName = getDisplayName(user) || 'User';
  const monthSummary = dashboardData?.monthSummary;
  const balanceSummary = dashboardData?.balanceSummary;
  
  const categories = useMemo(
    () => dashboardData?.categories || [],
    [dashboardData?.categories]
  );
  
  const transactions = dashboardData?.recentTransactions || [];

  const healthScore = useMemo(() => 
    calculateHealthScore(
      monthSummary?.totalIncome || 0,
      monthSummary?.totalExpense || 0
    ),
    [monthSummary]
  );
  const healthStanding = useMemo(() => getHealthStanding(healthScore), [healthScore]);

  // Budget categories with actual limits from database - memoized to prevent stale data
  const budgetCategories = useMemo((): BudgetCategory[] => {
    return (categories as DashboardCategoryData[])
      .filter((cat) => Number(cat.budget) > 0)
      .slice(0, TOP_BUDGET_CATEGORIES)
      .map((cat) => {
        const spent = Number(cat.total_spent) || 0;
        const limit = Number(cat.budget) || 0;
        const percentage = limit > 0 ? (spent / limit) * 100 : 0;
        return {
          name: cat.name,
          spent,
          limit,
          percentage: Math.min(percentage, 100),
        };
      });
  }, [categories]);

  if (loading || dashboardLoading) {
    return <DashboardSkeleton />;
  }

  // Error display with retry option
  if (dashboardError) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-[430px]">
          <AppHeader />
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-red-600 mb-2 text-center">Unable to Load Dashboard</h2>
            <p className="text-sm text-gray-500 text-center mb-6">{dashboardError.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Try Again
            </button>
          </div>
          <BottomNav />
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
        
        {/* PWA Install Prompt - only render on client to prevent hydration mismatch */}
        {mounted && <InstallPrompt />}
      </div>
    </div>
  );
}