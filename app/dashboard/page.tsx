'use client';

import React, { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import TransactionModal from '@/components/features/transaction/TransactionModal';
import { useBalanceSummary, useCurrentMonthSummary, useCategoryBreakdown } from '@/lib/hooks/useStatistics';
import { useRecentTransactions } from '@/lib/hooks/useTransactions';
import { transactionService } from '@/lib/services/transactions';
import type { CreateTransactionInput } from '@/lib/services/transactions';
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
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const { user, loading } = useAuth();

  // Data hooks
  const { summary: balanceSummary, loading: balanceLoading } = useBalanceSummary();
  const { summary: monthSummary, refresh: refreshMonth } = useCurrentMonthSummary();
  const { data: categoryData } = useCategoryBreakdown('expense');
  const { transactions, loading: transactionsLoading, refresh: refreshTransactions } = useRecentTransactions(RECENT_TRANSACTIONS_LIMIT);

  // Derived data
  const displayName = getDisplayName(user);
  const healthScore = calculateHealthScore(
    monthSummary?.totalIncome || 0,
    monthSummary?.totalExpense || 0
  );
  const healthStanding = getHealthStanding(healthScore);

  const budgetCategories = categoryData.slice(0, TOP_BUDGET_CATEGORIES).map(cat => {
    const limit = cat.total_amount * BUDGET_THRESHOLD.DEFAULT_MULTIPLIER;
    const percentage = (cat.total_amount / limit) * 100;
    return {
      name: cat.category_name,
      spent: cat.total_amount,
      limit,
      percentage,
    };
  });

  // Handlers
  const handleAddTransaction = async (data: CreateTransactionInput) => {
    await transactionService.createTransaction(data);
    refreshTransactions();
    refreshMonth();
  };

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

          <BudgetOverviewCard categories={budgetCategories} />

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

        <BottomNav onAddClick={() => setShowTransactionModal(true)} />

        <TransactionModal
          isOpen={showTransactionModal}
          onClose={() => setShowTransactionModal(false)}
          onSubmit={handleAddTransaction}
        />
      </div>
    </div>
  );
}
