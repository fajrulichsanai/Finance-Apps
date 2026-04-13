// =====================================================
// FINANCE APP - Categories Management Page
// =====================================================
// Description: Manage categories (wallets) with budget
// =====================================================

'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, TrendingDown, AlertCircle, Wallet } from 'lucide-react';
import AppHeader from '@/components/shared/AppHeader';
import BottomNav from '@/components/shared/BottomNav';
import CategoryCard from '@/components/features/category/CategoryCard';
import CategoryModal from '@/components/features/category/CategoryModal';
import { SuccessPopup, ErrorPopup, DeleteConfirmPopup } from '@/components/ui';
import { useExpenseBudgets, useManageCategories } from '@/lib/hooks/useCategories';
import type { CategoryWithBudget, CreateCategoryInput, UpdateCategoryInput } from '@/lib/services/categories';

// Format currency to IDR
const formatIDR = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function CategoriesPage() {
  const { 
    categories,
    loading,
    refresh,
    totalBudget,
    totalSpent,
    totalRemaining,
    overBudgetCategories,
    warningCategories,
    hasOverBudget,
    hasWarnings
  } = useExpenseBudgets();

  const { createCategory, updateCategory, deleteCategory } = useManageCategories();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithBudget | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  // Popup states
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
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

  const handleDeleteClick = (category: CategoryWithBudget) => {
    setDeleteConfirm(category.id);
  };  const confirmDelete = async (categoryId: string) => {
    try {
      await deleteCategory(categoryId);
      await refresh();
      setDeleteConfirm(null);
      setSuccessMessage('Kategori berhasil dihapus');
      setShowSuccessPopup(true);
    } catch (error) {
      console.error('Error deleting category:', error);
      setErrorMessage((error as Error).message || 'Gagal menghapus kategori');
      setShowErrorPopup(true);
    }
  };

  const handleSubmit = async (data: CreateCategoryInput | UpdateCategoryInput) => {
    try {
      if (modalMode === 'create') {
        await createCategory(data as CreateCategoryInput);
        setSuccessMessage('Kategori berhasil dibuat!');
      } else if (selectedCategory) {
        await updateCategory(selectedCategory.id, data);
        setSuccessMessage('Kategori berhasil diperbarui!');
      }
      
      setModalOpen(false);
      await refresh();
      setShowSuccessPopup(true);
    } catch (error) {
      console.error('Error saving category:', error);
      setErrorMessage((error as Error).message || 'Gagal menyimpan kategori');
      setShowErrorPopup(true);
      throw error;
    }
  };

  const budgetPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-24">
      {/* GLOBAL HEADER */}
      <AppHeader />
      
      {/* Page Title */}
      <div className="px-5 py-3">
        <p className="text-[10px] font-bold text-blue-900 uppercase tracking-widest mb-1">
          Wallet Management
        </p>
        <h1 className="text-3xl font-black text-gray-900 leading-tight">
          Dompet Saya
        </h1>
      </div>

      {/* Totalbudget Card */}
      <div className="mx-5 mb-5">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-5 shadow-lg">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-xs text-blue-100 mb-1">Total Budget</p>
              <p className="font-bold text-white text-sm">{formatIDR(totalBudget)}</p>
            </div>
            <div>
              <p className="text-xs text-blue-100 mb-1">Terpakai</p>
              <p className="font-bold text-white text-sm">{formatIDR(totalSpent)}</p>
            </div>
            <div>
              <p className="text-xs text-blue-100 mb-1">Sisa</p>
              <p className={`font-bold text-sm ${totalRemaining < 0 ? 'text-red-300' : 'text-white'}`}>
                {formatIDR(totalRemaining)}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-blue-100">Penggunaan Total</span>
              <span className="text-xs font-semibold text-white">
                {budgetPercentage.toFixed(1)}%
              </span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className={`h-full ${
                  budgetPercentage >= 100 ? 'bg-red-400' :
                  budgetPercentage >= 80 ? 'bg-orange-400' :
                  'bg-green-400'
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="px-6 py-4 space-y-3">
        {hasOverBudget && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
            <TrendingDown className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-900 text-sm mb-1">Budget Terlampaui!</p>
              <p className="text-xs text-red-700">
                {overBudgetCategories.length} kategori melebihi budget yang ditentukan
              </p>
            </div>
          </div>
        )}

        {hasWarnings && !hasOverBudget && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-orange-900 text-sm mb-1">Perhatian</p>
              <p className="text-xs text-orange-700">
                {warningCategories.length} kategori mendekati batas budget (≥80%)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Categories List */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Kategori Budget</h2>
          <button
            onClick={handleCreateClick}
            className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 h-24 animate-pulse" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Wallet className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">Belum ada kategori</p>
            <button
              onClick={handleCreateClick}
              className="mt-4 text-blue-600 font-semibold text-sm"
            >
              Buat kategori pertama Anda
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onEdit={() => handleEditClick(category)}
                onDelete={() => handleDeleteClick(category)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        category={selectedCategory}
        mode={modalMode}
      />

      {/* Delete Confirmation Popup */}
      {deleteConfirm && (
        <DeleteConfirmPopup
          isOpen={true}
          title="Hapus Kategori?"
          message="Kategori yang dihapus tidak dapat dikembalikan. Transaksi dengan kategori ini akan menjadi tanpa kategori."
          confirmLabel="Hapus"
          cancelLabel="Batal"
          onConfirm={() => confirmDelete(deleteConfirm)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}

      {/* Success Popup */}
      <SuccessPopup
        isOpen={showSuccessPopup}
        title={successMessage}
        message="Perubahan telah disimpan."
        status="Tersimpan"
        onDone={() => setShowSuccessPopup(false)}
      />

      {/* Error Popup */}
      <ErrorPopup
        isOpen={showErrorPopup}
        title="Terjadi Kesalahan"
        message={errorMessage}
        onRetry={() => {
          setShowErrorPopup(false);
          if (modalMode === 'create' || modalMode === 'edit') {
            setModalOpen(true);
          }
        }}
        onCancel={() => setShowErrorPopup(false)}
      />

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
