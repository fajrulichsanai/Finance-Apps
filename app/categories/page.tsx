// =====================================================
// FINANCE APP - Categories Management Page
// =====================================================
// Description: Manage categories (wallets) with budget
// =====================================================

'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, TrendingDown, AlertCircle, Wallet, LogOut } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import CategoryCard from '@/components/CategoryCard';
import CategoryModal from '@/components/CategoryModal';
import { useExpenseBudgets, useManageCategories } from '@/lib/hooks/useCategories';
import { useAuth } from '@/providers/AuthProvider';
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
  const { user, signOut } = useAuth();
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
  };

  const confirmDelete = async (categoryId: string) => {
    try {
      await deleteCategory(categoryId);
      refresh();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
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

  const budgetPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Dompet Saya</h1>
            <p className="text-blue-100 text-sm">Kelola budget per kategori</p>
          </div>
          <button
            onClick={() => signOut()}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Total Budget Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-xs text-blue-100 mb-1">Total Budget</p>
              <p className="font-bold text-white">{formatIDR(totalBudget)}</p>
            </div>
            <div>
              <p className="text-xs text-blue-100 mb-1">Terpakai</p>
              <p className="font-bold text-white">{formatIDR(totalSpent)}</p>
            </div>
            <div>
              <p className="text-xs text-blue-100 mb-1">Sisa</p>
              <p className={`font-bold ${totalRemaining < 0 ? 'text-red-300' : 'text-white'}`}>
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
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900 text-sm">
                {overBudgetCategories.length} kategori melebihi budget!
              </p>
              <p className="text-xs text-red-600 mt-1">
                {overBudgetCategories.map(c => c.name).join(', ')}
              </p>
            </div>
          </motion.div>
        )}

        {hasWarnings && !hasOverBudget && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3"
          >
            <TrendingDown className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-orange-900 text-sm">
                {warningCategories.length} kategori budget hampir habis
              </p>
              <p className="text-xs text-orange-600 mt-1">
                {warningCategories.map(c => c.name).join(', ')}
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Categories List */}
      <div className="px-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-gray-900">Kategori Pengeluaran</h2>
          <button
            onClick={handleCreateClick}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 text-sm mt-4">Memuat kategori...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12">
            <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Belum ada kategori</p>
            <button
              onClick={handleCreateClick}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Tambah Kategori Pertama
            </button>
          </div>
        ) : (
          <div className="grid gap-4 mb-6">
            {categories.map((category) => (
              <div key={category.id} className="relative">
                <CategoryCard
                  category={category}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />

                {/* Delete confirmation */}
                {deleteConfirm === category.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl p-5 flex flex-col items-center justify-center gap-4 border-2 border-red-200"
                  >
                    <p className="text-sm text-gray-900 text-center">
                      Hapus kategori <strong>{category.name}</strong>?
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm"
                      >
                        Batal
                      </button>
                      <button
                        onClick={() => confirmDelete(category.id)}
                        className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 text-sm"
                      >
                        Hapus
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
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

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
