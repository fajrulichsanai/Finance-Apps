// =====================================================
// FINANCE APP - Budget Page
// =====================================================
// Display budget overview and category limits
// =====================================================

'use client';

import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, Plus } from 'lucide-react';
import * as Icons from 'lucide-react';
import AppHeader from '@/components/shared/AppHeader';
import BottomNav from '@/components/shared/BottomNav';
import BudgetOverview from '@/components/features/budget/BudgetOverview';
import BudgetUtilization from '@/components/features/budget/BudgetUtilization';
import BudgetCategoryCard from '@/components/features/budget/BudgetCategoryCard';
import CategoryModal from '@/components/features/category/CategoryModal';
import { SuccessPopup, ErrorPopup } from '@/components/ui';
import { useExpenseBudgets, useManageCategories } from '@/lib/hooks/useCategories';
import type { CategoryWithBudget, CreateCategoryInput, UpdateCategoryInput } from '@/lib/services/categories';

// Helper to get icon component from icon name
const getIconComponent = (iconName: string) => {
  const IconComponent = (Icons as any)[iconName];
  return IconComponent || Icons.Wallet;
};

type SortOrder = 'habis-dulu' | 'masih-ada-dulu';

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
  const [sortOrder, setSortOrder] = useState<SortOrder>('habis-dulu');
  
  // Popup states
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
      
      // Close modal IMMEDIATELY to prevent reopening
      setModalOpen(false);
      
      // Refresh data
      await refresh();
      
      // Show success popup
      setShowSuccessPopup(true);
    } catch (error) {
      console.error('Error saving category:', error);
      setErrorMessage((error as Error).message || 'Failed to save category');
      setShowErrorPopup(true);
      throw error;
    }
  };

  const toggleSort = () => {
    setSortOrder(prev => prev === 'habis-dulu' ? 'masih-ada-dulu' : 'habis-dulu');
  };

  // Sort categories based on remaining budget
  const sortedCategories = useMemo(() => {
    const sorted = [...categories].sort((a, b) => {
      const remainingA = Number(a.remaining_budget) || 0;
      const remainingB = Number(b.remaining_budget) || 0;
      
      if (sortOrder === 'habis-dulu') {
        return remainingA - remainingB; // Ascending (lowest remaining first)
      } else {
        return remainingB - remainingA; // Descending (highest remaining first)
      }
    });
    return sorted;
  }, [categories, sortOrder]);

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
      {/* GLOBAL HEADER */}
      <AppHeader />

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
        <button 
          onClick={toggleSort}
          className="flex items-center gap-1.5 text-[11px] font-bold text-blue-900 uppercase tracking-wider hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition-colors active:scale-95"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          {sortOrder === 'habis-dulu' ? 'Habis Dulu' : 'Tersisa Dulu'}
        </button>
      </div>

      {/* CATEGORY CARDS */}
      <div className="px-5 space-y-3">
        {sortedCategories.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-12 px-5">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Icons.Wallet className="w-10 h-10 text-gray-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No categories yet</h3>
            <p className="text-sm text-gray-500 text-center max-w-[280px]">
              Create your first budget category to start tracking your expenses
            </p>
          </div>
        ) : (
          sortedCategories.map((category) => {
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
          })
        )}
      </div>

      {/* CREATE NEW CATEGORY BUTTON */}
      <div className="flex justify-center mt-4 mb-6">
        <button 
          onClick={handleCreateClick}
          className="flex items-center justify-center gap-2 bg-blue-900 text-white rounded-full py-4 px-7 font-bold text-sm shadow-lg shadow-blue-900/35 active:scale-98 transition-transform hover:bg-blue-800"
        >
          <Plus className="w-5 h-5" strokeWidth={2.5} />
          Buat Kategori Budget
        </button>
      </div>

      {/* CATEGORY MODAL */}
      <CategoryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        category={selectedCategory}
        mode={modalMode}
      />

      {/* SUCCESS POPUP */}
      <SuccessPopup
        isOpen={showSuccessPopup}
        title={modalMode === 'create' ? 'Kategori Berhasil Dibuat!' : 'Kategori Berhasil Diperbarui!'}
        message="Budget kategori telah disimpan dan siap digunakan."
        status="Tersimpan"
        onDone={() => setShowSuccessPopup(false)}
      />

      {/* ERROR POPUP */}
      <ErrorPopup
        isOpen={showErrorPopup}
        title="Gagal Menyimpan"
        message={errorMessage}
        onRetry={() => {
          setShowErrorPopup(false);
          setModalOpen(true);
        }}
        onCancel={() => setShowErrorPopup(false)}
      />

      {/* BOTTOM NAVIGATION */}
      <BottomNav />
    </div>
  );
}