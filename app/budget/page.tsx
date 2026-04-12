// =====================================================
// FINANCE APP - Budget Page
// =====================================================
// Display budget overview and category limits
// =====================================================

'use client';

import React from 'react';
import { User, Bell, SlidersHorizontal, Plus } from 'lucide-react';
import { Utensils, Car, FileText, Gamepad2 } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import BudgetOverview from '@/components/BudgetOverview';
import BudgetUtilization from '@/components/BudgetUtilization';
import BudgetCategoryCard from '@/components/BudgetCategoryCard';
import { useExpenseBudgets } from '@/lib/hooks/useCategories';

// Temporary icon mapping for categories
const getCategoryIcon = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('food') || lowerName.includes('makan')) return Utensils;
  if (lowerName.includes('transport') || lowerName.includes('travel')) return Car;
  if (lowerName.includes('bill') || lowerName.includes('tagihan')) return FileText;
  if (lowerName.includes('entertainment') || lowerName.includes('hiburan')) return Gamepad2;
  return FileText;
};

const getCategoryColors = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('food') || lowerName.includes('makan')) 
    return { bg: '#e6f9ee', color: '#2fa05c' };
  if (lowerName.includes('transport') || lowerName.includes('travel')) 
    return { bg: '#eaf0fb', color: '#1a2f7a' };
  if (lowerName.includes('bill') || lowerName.includes('tagihan')) 
    return { bg: '#fdeaea', color: '#d62d2d' };
  if (lowerName.includes('entertainment') || lowerName.includes('hiburan')) 
    return { bg: '#f0eaf8', color: '#7b5ea7' };
  return { bg: '#e8ecf8', color: '#6b7280' };
};

export default function BudgetPage() {
  const { 
    categories, 
    totalBudget, 
    totalSpent, 
    totalRemaining, 
    loading 
  } = useExpenseBudgets();

  const utilizationPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="animate-pulse p-5">
          <div className="h-40 bg-gray-200 rounded-2xl mb-4" />
          <div className="h-32 bg-gray-200 rounded-2xl mb-4" />
          <div className="h-48 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* HEADER */}
      <header className="bg-gray-50 px-5 pt-5 pb-2 sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center border-2 border-blue-900">
            <User className="w-6 h-6 text-white" />
          </div>
          <span className="text-lg font-extrabold text-gray-900">
            The Financial Architect
          </span>
        </div>
        <button className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
          <Bell className="w-5 h-5 text-gray-900" />
        </button>
      </header>

      {/* PAGE TITLE */}
      <div className="px-5 py-2">
        <p className="text-[10px] font-bold text-blue-900 uppercase tracking-widest mb-1">
          Portfolio Management
        </p>
        <h1 className="text-4xl font-black text-gray-900 leading-tight">
          Budget Control
        </h1>
      </div>

      {/* BUDGET OVERVIEW */}
      <BudgetOverview
        totalSpent={totalSpent}
        monthlyGoal={totalBudget}
        remaining={totalRemaining}
      />

      {/* UTILIZATION */}
      <BudgetUtilization percentage={utilizationPercentage} />

      {/* CATEGORY LIMITS HEADER */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <h2 className="text-xl font-extrabold text-gray-900">
          Limit Kategori
        </h2>
        <button className="flex items-center gap-1.5 text-[11px] font-bold text-blue-900 uppercase tracking-wider">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filter
        </button>
      </div>

      {/* CATEGORY CARDS */}
      <div className="px-5 space-y-3">
        {categories.map((category) => {
          const Icon = getCategoryIcon(category.name);
          const colors = getCategoryColors(category.name);
          
          return (
            <BudgetCategoryCard
              key={category.id}
              name={category.name}
              icon={Icon}
              iconColor={colors.color}
              iconBgColor={colors.bg}
              transactionCount={Number(category.transaction_count) || 0}
              spent={Number(category.total_spent) || 0}
              limit={Number(category.budget) || 0}
              isOverBudget={Number(category.remaining_budget) < 0}
            />
          );
        })}
      </div>

      {/* CREATE NEW CATEGORY BUTTON */}
      <button className="flex items-center justify-center gap-2 bg-green-500 text-white rounded-full py-4 px-7 mx-5 mt-4 mb-6 font-bold text-sm shadow-lg shadow-green-500/35 active:scale-98 transition-transform">
        <Plus className="w-5 h-5" strokeWidth={2.5} />
        Buat Kategori Budget Baru
      </button>

      {/* BOTTOM NAVIGATION */}
      <BottomNav />
    </div>
  );
}