'use client';

import React, { useState } from 'react';
import { 
  Bell, 
  Coffee, Car, Home, ShoppingBag, Zap, Plus
} from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import TransactionModal from '@/components/features/transaction/TransactionModal';
import { useBalanceSummary, useCurrentMonthSummary, useCategoryBreakdown } from '@/lib/hooks/useStatistics';
import { useRecentTransactions } from '@/lib/hooks/useTransactions';
import { transactionService } from '@/lib/services/transactions';
import type { CreateTransactionInput } from '@/lib/services/transactions';
import Link from 'next/link';

// Icon mapping helper
const iconMap: Record<string, any> = {
  Coffee, Car, Home, ShoppingBag, Zap,
  // Add more icons as needed
};

const getIconComponent = (iconName: string) => {
  return iconMap[iconName] || ShoppingBag;
};

// Format currency to IDR
const formatIDR = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function DashboardPage() {
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const { user, loading } = useAuth();

  // Real data hooks
  const { summary: balanceSummary, loading: balanceLoading } = useBalanceSummary();
  const { summary: monthSummary, refresh: refreshMonth } = useCurrentMonthSummary();
  const { data: categoryData } =  useCategoryBreakdown('expense');
  const { transactions, loading: transactionsLoading, refresh: refreshTransactions } = useRecentTransactions(10);

  // Format category data for budget bars
  const budgetCategories = categoryData.slice(0, 3).map(cat => {
    const limit = cat.total_amount * 1.25; // Calculate a default limit
    const percentage = (cat.total_amount / limit) * 100;
    return {
      name: cat.category_name,
      spent: cat.total_amount,
      limit: limit,
      percentage: percentage,
      color: cat.category_color
    };
  });

  // Handle transaction submission
  const handleAddTransaction = async (data: CreateTransactionInput) => {
    await transactionService.createTransaction(data);
    refreshTransactions();
    refreshMonth();
  };

  // Format date for display
  const formatTransactionDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hari ini';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Kemarin';
    } else {
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    }
  };

  // Get icon color based on category
  const getCategoryColor = (categoryName: string, type: string) => {
    if (type === 'income') return 'bg-emerald-100 text-emerald-600';
    
    const colorMap: Record<string, string> = {
      'Food & Drink': 'bg-orange-100 text-orange-600',
      'Transport': 'bg-blue-100 text-blue-600',
      'Shopping': 'bg-purple-100 text-purple-600',
      'Housing': 'bg-red-100 text-red-600',
      'Utilities': 'bg-yellow-100 text-yellow-600',
    };
    return colorMap[categoryName] || 'bg-slate-100 text-slate-600';
  };

  // Get user display name
  const getDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  // Calculate financial health score (simple calculation based on income vs expense ratio)
  const calculateHealthScore = () => {
    const income = monthSummary?.totalIncome || 0;
    const expense = monthSummary?.totalExpense || 0;
    if (income === 0) return 0;
    const ratio = (income - expense) / income * 100;
    return Math.min(Math.max(Math.round(ratio), 0), 100);
  };

  const healthScore = calculateHealthScore();
  const healthStanding = healthScore >= 80 ? 'Excellent standing' : healthScore >= 60 ? 'Good standing' : 'Needs improvement';

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
        
        {/* Top Nav */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 bg-[#f5f5f7]">
          <div className="flex items-center gap-2">
            <div className="w-[34px] h-[34px] rounded-full bg-[#1a1a6e] flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" fill="white"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-[15px] font-bold text-[#0d0d2b]">The Financial Architect</span>
          </div>
          <Link href="/notification">
            <button className="w-[34px] h-[34px] rounded-full bg-white border-none cursor-pointer flex items-center justify-center shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="#1a1a6e" strokeWidth="2" strokeLinecap="round"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="#1a1a6e" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </Link>
        </div>

        <div className="px-4 overflow-y-auto max-h-[calc(100vh-180px)]">
          
          {/* Health Score Card */}
          <div className="bg-white rounded-[18px] px-4 py-3.5 flex items-center gap-3.5 mb-3.5">
            <div className="relative w-[60px] h-[60px] flex-shrink-0">
              <svg width="60" height="60" viewBox="0 0 60 60" className="-rotate-90">
                <circle cx="30" cy="30" r="24" fill="none" stroke="#f0f0f5" strokeWidth="5"/>
                <circle 
                  cx="30" cy="30" r="24" fill="none" stroke="#1a9e6e" strokeWidth="5"
                  strokeDasharray="150.8" 
                  strokeDashoffset={150.8 - (150.8 * healthScore / 100)} 
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-lg font-extrabold text-[#0d0d2b]">
                {healthScore}
              </div>
            </div>
            <div className="flex-1">
              <div className="text-[9px] font-bold text-gray-400 tracking-[0.8px] uppercase mb-0.5">Financial Health Score</div>
              <div className="text-[15px] font-bold text-[#0d0d2b]">{healthStanding}</div>
              <div className="text-[11px] text-gray-500 leading-tight mt-0.5">
                <span className="font-bold text-[#0d0d2b]">Quick Insight:</span> Your savings rate is {healthScore}% this month.
              </div>
            </div>
          </div>

          {/* Portfolio Summary */}
          <div className="text-[9px] font-bold text-gray-400 tracking-[0.8px] uppercase mb-1">Portfolio Summary</div>
          <div className="text-[28px] font-extrabold text-[#0d0d2b] mb-2">Hello, {getDisplayName()}!</div>
          <div className="inline-flex items-center gap-1.5 bg-[#e6f9f0] rounded-[20px] px-3 py-1.5 mb-3.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6L12 2z" fill="#1a9e6e"/>
              <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xs font-bold text-[#1a9e6e]">Verified Account</span>
          </div>

          {/* Net Worth Card */}
          <div 
            className="rounded-[20px] px-5 py-[18px] mb-3.5"
            style={{ background: 'linear-gradient(135deg, #1a1a6e 0%, #2a2a8e 60%, #1e3a8a 100%)' }}
          >
            <div className="text-[9px] font-bold text-white/55 tracking-[0.8px] uppercase mb-1.5">Total Net Worth</div>
            <div className="text-[36px] font-extrabold text-white tracking-tight mb-3">
              <sup className="text-[20px] font-bold align-super">Rp</sup>
              {(balanceSummary?.balance || 0).toLocaleString('id-ID')}
            </div>
            <div className="inline-flex items-center gap-1.5 bg-white/[0.12] rounded-[20px] px-3 py-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="17,6 23,6 23,12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-xs font-bold text-white">Tracking your wealth</span>
            </div>
          </div>

          {/* Budget Overview */}
          <div className="bg-white rounded-[18px] px-[18px] py-4 mb-3.5">
            <div className="flex justify-between items-center mb-3.5">
              <span className="text-[9px] font-bold text-gray-400 tracking-[0.8px] uppercase">Budget Overview</span>
              <span className="text-[11px] font-bold text-[#1a1a6e]">
                {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()}
              </span>
            </div>

            {budgetCategories.length > 0 ? (
              budgetCategories.map((budget, idx) => (
                <div key={idx} className="mb-3.5 last:mb-0">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-bold text-[#0d0d2b]">{budget.name.toUpperCase()}</span>
                    <span className={`text-[13px] font-bold ${budget.percentage > 90 ? 'text-[#e74c3c]' : 'text-[#0d0d2b]'}`}>
                      {Math.round(budget.percentage)}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded bg-[#f0f0f5] overflow-hidden mb-1">
                    <div 
                      className="h-full rounded" 
                      style={{ 
                        width: `${Math.min(budget.percentage, 100)}%`,
                        backgroundColor: budget.percentage > 90 ? '#e74c3c' : budget.percentage > 70 ? '#f0c040' : '#1a9e6e'
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400">
                    <span>{formatIDR(budget.spent)} spent</span>
                    <span>{formatIDR(budget.limit)} limit</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">No budget data available</p>
            )}
          </div>

          {/* Your Accounts */}
          <div className="flex justify-between items-center mb-2.5">
            <span className="text-[9px] font-bold text-gray-400 tracking-[0.8px] uppercase">Your Accounts</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="5" cy="12" r="2" fill="#ccc"/>
              <circle cx="12" cy="12" r="2" fill="#1a1a6e"/>
              <circle cx="19" cy="12" r="2" fill="#ccc"/>
            </svg>
          </div>
          <div className="grid grid-cols-2 gap-2.5 mb-3.5">
            <div className="bg-white rounded-2xl px-4 py-3.5">
              <div className="text-[10px] font-bold text-gray-400 mb-1.5 flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="5" width="20" height="14" rx="3" stroke="#1a1a6e" strokeWidth="2"/>
                  <path d="M2 10h20" stroke="#1a1a6e" strokeWidth="2"/>
                </svg>
                CASH
              </div>
              <div className="text-xl font-extrabold text-[#0d0d2b]">
                {formatIDR(balanceSummary?.balance || 0)}
              </div>
            </div>
            <div className="bg-white rounded-2xl px-4 py-3.5">
              <div className="text-[10px] font-bold text-gray-400 mb-1.5 flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 10v11M12 10v11M16 10v11" stroke="#1a1a6e" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                BANK
              </div>
              <div className="text-xl font-extrabold text-[#0d0d2b]">
                {formatIDR(0)}
              </div>
            </div>
          </div>

          {/* AI Insight */}
          <div className="bg-[#eef0ff] rounded-[18px] px-[18px] py-4 mb-3.5 relative overflow-hidden">
            <div className="text-[9px] font-bold text-[#5555cc] tracking-[0.8px] uppercase mb-1.5 flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#5555cc" strokeWidth="2"/>
                <path d="M12 8v4l3 3" stroke="#5555cc" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              AI Architect Insight
            </div>
            <div className="text-[17px] font-extrabold text-[#0d0d2b] mb-2 leading-tight">
              {'Savings Opportunity\nDetected'.split('\n').map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
            <div className="text-xs text-[#6b6b80] leading-relaxed mb-3">
              Track your spending patterns and find opportunities to save. Set up budgets for each category to stay on track.
            </div>
            <Link href="/categories" className="text-[13px] font-bold text-[#1a1a6e] no-underline">
              View Categories →
            </Link>
            <div className="absolute right-3.5 bottom-3.5 opacity-[0.12] text-[60px] leading-none text-[#1a1a6e] pointer-events-none">
              ✦
            </div>
          </div>

          {/* Monthly Income */}
          <div className="bg-white rounded-[18px] px-[18px] py-4 mb-3">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#e6f9f0] flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M19 12l-7 7-7-7" stroke="#1a9e6e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Monthly Income</div>
                <div className="text-2xl font-extrabold text-[#0d0d2b]">{formatIDR(monthSummary?.totalIncome || 0)}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-[#1a9e6e] mb-0.5">
                  + {formatIDR(monthSummary?.totalIncome || 0)}
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Expenses */}
          <div className="bg-white rounded-[18px] px-[18px] py-4 mb-3">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#fff0f0] flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 19V5M5 12l7-7 7 7" stroke="#e74c3c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Monthly Expenses</div>
                <div className="text-2xl font-extrabold text-[#0d0d2b]">{formatIDR(monthSummary?.totalExpense || 0)}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-[#e74c3c] mb-0.5">
                  - {formatIDR(monthSummary?.totalExpense || 0)}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-[#ebebf0] rounded-[18px] px-[18px] py-4 mb-3.5">
            <div className="flex justify-between items-center mb-3.5">
              <span className="text-[15px] font-bold text-[#0d0d2b]">Recent Activity</span>
              <Link href="/statistics" className="text-xs font-bold text-[#1a1a6e] no-underline">
                View All
              </Link>
            </div>

            {transactionsLoading ? (
              <div className="text-center py-4">
                <div className="w-6 h-6 border-4 border-[#1a1a6e] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-xs text-gray-400">Loading...</p>
              </div>
            ) : transactions.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No transactions yet</p>
            ) : (
              transactions.slice(0, 3).map((tx, idx) => {
                const IconComponent = getIconComponent(tx.category_icon || 'ShoppingBag');
                return (
                  <div key={tx.id} className="flex items-center gap-3 py-2.5 border-t border-[#d8d8e0] first:border-t-0">
                    <div className="w-[38px] h-[38px] rounded-[10px] bg-[#dddde8] flex items-center justify-center flex-shrink-0">
                      <IconComponent size={18} className="text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[13px] font-bold text-[#0d0d2b]">{tx.description}</div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-wide mt-0.5">
                        {tx.category_name}
                      </div>
                    </div>
                    <div className={`text-sm font-bold ${tx.type === 'income' ? 'text-[#1a9e6e]' : 'text-[#e74c3c]'}`}>
                      {tx.type === 'income' ? '+' : '-'}{formatIDR(Math.abs(tx.amount))}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="h-[60px]" />
        </div>

        {/* FAB */}
        <button 
          onClick={() => setShowTransactionModal(true)}
          className="absolute bottom-[88px] right-5 w-[50px] h-[50px] bg-[#1a1a6e] rounded-full flex items-center justify-center cursor-pointer border-none shadow-[0_4px_16px_rgba(26,26,110,0.35)]"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Bottom Nav */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#1a1a6e] py-2.5 pb-5 flex justify-around items-center rounded-b-[36px]">
          <Link href="/dashboard" className="flex flex-col items-center gap-1 cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 12L12 3l9 9" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <rect x="6" y="12" width="12" height="10" rx="1" stroke="white" strokeWidth="2"/>
            </svg>
            <span className="text-[9px] font-semibold tracking-wide text-white">HOME</span>
          </Link>
          <Link href="/statistics" className="flex flex-col items-center gap-1 cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="rgba(255,255,255,0.45)" strokeWidth="2"/>
              <path d="M3 9h18M9 21V9" stroke="rgba(255,255,255,0.45)" strokeWidth="2"/>
            </svg>
            <span className="text-[9px] font-semibold tracking-wide text-white/45">LEDGER</span>
          </Link>
          <Link href="/categories" className="flex flex-col items-center gap-1 cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="8" stroke="rgba(255,255,255,0.45)" strokeWidth="2"/>
              <path d="M9 12l2 2 4-4" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="text-[9px] font-semibold tracking-wide text-white/45">BUDGET</span>
          </Link>
          <button className="flex flex-col items-center gap-1 cursor-pointer bg-transparent border-none">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <polyline points="3,18 8,12 13,15 18,8 21,11" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-[9px] font-semibold tracking-wide text-white/45">CHARTS</span>
          </button>
          <Link href="/notification" className="flex flex-col items-center gap-1 cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="rgba(255,255,255,0.45)" strokeWidth="2"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="text-[9px] font-semibold tracking-wide text-white/45">PROFILE</span>
          </Link>
        </div>

        {/* Transaction Modal */}
        <TransactionModal
          isOpen={showTransactionModal}
          onClose={() => setShowTransactionModal(false)}
          onSubmit={handleAddTransaction}
        />
      </div>
    </div>
  );
}
