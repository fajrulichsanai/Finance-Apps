'use client';

import React, { useState, useMemo } from 'react';
import { Plus, ArrowUp, ArrowDown } from 'lucide-react';
import * as Icons from 'lucide-react';
import AppHeader from '@/components/shared/AppHeader';
import BottomNav from '@/components/shared/BottomNav';
import BudgetOverview from '@/components/features/budget/BudgetOverview';
import BudgetUtilization from '@/components/features/budget/BudgetUtilization';
import BudgetCategoryCard from '@/components/features/budget/BudgetCategoryCard';
import CategoryModal from '@/components/features/category/CategoryModal';
import { SuccessPopup, ErrorPopup } from '@/components/ui';
import { useExpenseBudgets, useManageCategories } from '@/lib/hooks/useCategories';
import { getIconComponent } from '@/lib/utils/icons';
import type { CategoryWithBudget, CreateCategoryInput, UpdateCategoryInput } from '@/lib/services/categories';

type SortOrder = 'habis-dulu' | 'masih-ada-dulu';

export default function BudgetPage() {
  const { 
    categories, 
    totalBudget, 
    totalSpent, 
    totalRemaining, 
    loading,
    error,
    refresh 
  } = useExpenseBudgets();

  const { createCategory, updateCategory, deleteCategory } = useManageCategories();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithBudget | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('habis-dulu');
  
  // Popup states
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  const handleDeleteClick = (categoryId: string) => {
    setDeleteTargetId(categoryId);
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    
    setDeleteLoading(true);
    try {
      await deleteCategory(deleteTargetId);
      setShowConfirmDelete(false);
      setDeleteTargetId(null);
      await refresh();
      setSuccessMessage('Kategori berhasil dihapus');
      setShowSuccessPopup(true);
    } catch (error) {
      console.error('Error deleting category:', error);
      setErrorMessage((error as Error).message || 'Gagal menghapus kategori');
      setShowErrorPopup(true);
    } finally {
      setDeleteLoading(false);
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
      <div className="min-h-screen bg-gray-50 pb-24">
        <div className="w-full max-w-[430px] mx-auto">
          <AppHeader />
          <div className="px-5 py-6 space-y-3">
            {/* Title skeleton */}
            <div className="h-8 bg-gray-200 rounded w-32 animate-pulse mb-4"></div>
            {/* Budget Overview skeleton */}
            <div className="bg-white rounded-2xl p-5 shadow-sm space-y-3 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-40"></div>
              {[1, 2].map(i => (
                <div key={i} className="space-y-2">
                  <div className="h-2 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
            {/* Category cards skeleton */}
            {[1, 2].map(i => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm animate-pulse">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 bg-gray-200 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded mb-3"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        <AppHeader />
        <div className="flex flex-col items-center justify-center py-20 px-5">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Gagal Memuat Budget</h3>
          <p className="text-sm text-gray-500 text-center max-w-sm mb-6">
            {error.message || 'Terjadi kesalahan saat mengambil data budget'}
          </p>
          <button
            onClick={refresh}
            className="px-6 py-2.5 bg-blue-900 text-white rounded-lg font-semibold text-sm hover:bg-blue-800 active:scale-95 transition-all"
          >
            Coba Lagi
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="w-full max-w-[430px] mx-auto">
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
            className="flex items-center gap-1.5 p-2 text-blue-900 hover:bg-blue-50 rounded-lg transition-colors active:scale-95"
            title={sortOrder === 'habis-dulu' ? 'Urutkan: Habis Dulu' : 'Urutkan: Tersisa Dulu'}
          >
            {sortOrder === 'habis-dulu' ? (
              <ArrowUp className="w-5 h-5" strokeWidth={2.5} />
            ) : (
              <ArrowDown className="w-5 h-5" strokeWidth={2.5} />
            )}
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
              <h3 className="text-lg font-bold text-gray-900 mb-2">Belum ada kategori</h3>
              <p className="text-sm text-gray-500 text-center max-w-[280px]">
                Buat kategori budget pertama untuk mulai melacak pengeluaran Anda
              </p>
            </div>
          ) : (
            sortedCategories.map((category) => {
              const Icon = getIconComponent(category.icon);
              
              return (
                <BudgetCategoryCard
                  key={category.id}
                  name={category.name}
                  icon={Icon}
                  iconColor={category.color}
                  iconBgColor={`${category.color}20`}
                  transactionCount={Number(category.transaction_count) || 0}
                  spent={Number(category.total_spent) || 0}
                  limit={Number(category.budget) || 0}
                  isOverBudget={Number(category.remaining_budget) < 0}
                  onEdit={() => handleEditClick(category)}
                  onDelete={() => handleDeleteClick(category.id)}
                />
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
          title={successMessage.includes('dihapus') ? 'Kategori Berhasil Dihapus!' : (modalMode === 'create' ? 'Kategori Berhasil Dibuat!' : 'Kategori Berhasil Diperbarui!')}
          message={successMessage || 'Budget kategori telah disimpan dan siap digunakan.'}
          status="Tersimpan"
          onDone={() => {
            setShowSuccessPopup(false);
            setSuccessMessage('');
          }}
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
      </div>

      {/* DELETE CONFIRM POPUP */}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !deleteLoading && setShowConfirmDelete(false)} />
          <div className="relative bg-white rounded-3xl p-6 w-full max-w-[300px] shadow-2xl">
            <h3 className="font-bold text-lg text-gray-900 mb-2">Hapus Kategori?</h3>
            <p className="text-sm text-gray-500 mb-6">Tindakan ini tidak dapat dibatalkan. Semua transaksi di kategori ini akan tetap ada.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmDelete(false)}
                disabled={deleteLoading}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-900 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-all disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteLoading}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg font-semibold text-sm hover:bg-red-600 transition-all disabled:opacity-50"
              >
                {deleteLoading ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM NAVIGATION */}
      <BottomNav />
    </div>
  );
}