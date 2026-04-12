// =====================================================
// FINANCE APP - Budget Page
// =====================================================
// Display budget overview and category limits
// =====================================================

'use client';

import React, { useState } from 'react';
import { User, Bell, SlidersHorizontal, Plus } from 'lucide-react';
import * as Icons from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import BudgetOverview from '@/components/BudgetOverview';
import BudgetUtilization from '@/components/BudgetUtilization';
import BudgetCategoryCard from '@/components/BudgetCategoryCard';
import CategoryModal from '@/components/CategoryModal';
import { useExpenseBudgets, useManageCategories } from '@/lib/hooks/useCategories';
import type { CategoryWithBudget, CreateCategoryInput, UpdateCategoryInput } from '@/lib/services/categories';

// Helper to get icon component from icon name
const getIconComponent = (iconName: string) => {
  const IconComponent = (Icons as any)[iconName];
  return IconComponent || Icons.Wallet;
};

export default function BudgetPage() {
  const { 
    categories, 
    totalBudget, 
    totalSpent, 
    totalRemaining, 
    loading,
    refresh 
  } = useExpenseBudgets();

  const { createCategory, updateCategory } = useManageCategories();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithBudget | null>(null);

  const handleCreateClick = () => {
    setSelectedCategory(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const handleEditClick = (category: CategoryWithBudget) => {
    setSelectedCategory(category);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleSubmit = async (data: CreateCategoryInput | UpdateCategoryInput) => {
    try {
      if (modalMode === 'create') {
        await createCategory(data as CreateCategoryInput);
      } else if (selectedCategory) {
        await updateCategory(selectedCategory.id, data);
      }
      refresh();
    } catch (error) {
      console.error('Error saving category:', error);
      throw error;
    }
  };

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
          const Icon = getIconComponent(category.icon);
          
          return (
            <div key={category.id} onClick={() => handleEditClick(category)} className="cursor-pointer">
              <BudgetCategoryCard
                name={category.name}
                icon={Icon}
                iconColor={category.color}
                iconBgColor={`${category.color}20`}
                transactionCount={Number(category.transaction_count) || 0}
                spent={Number(category.total_spent) || 0}
                limit={Number(category.budget) || 0}
                isOverBudget={Number(category.remaining_budget) < 0}
              />
            </div>
          );
        })}
      </div>

      {/* CREATE NEW CATEGORY BUTTON */}
      <button 
        onClick={handleCreateClick}
        className="flex items-center justify-center gap-2 bg-green-500 text-white rounded-full py-4 px-7 mx-5 mt-4 mb-6 font-bold text-sm shadow-lg shadow-green-500/35 active:scale-98 transition-transform hover:bg-green-600"
      >
        <Plus className="w-5 h-5" strokeWidth={2.5} />
        Buat Kategori Budget Baru
      </button>

      {/* CATEGORY MODAL */}
      <CategoryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        category={selectedCategory}
        mode={modalMode}
      />

      {/* BOTTOM NAVIGATION */}
      <BottomNav />
    </div>
  );
}