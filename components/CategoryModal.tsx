// =====================================================
// FINANCE APP - Category Modal Component
// =====================================================
// Description: Modal for creating/editing categories
// =====================================================

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Wallet, CheckCircle } from 'lucide-react';
import * as Icons from 'lucide-react';
import type { Category, CreateCategoryInput, UpdateCategoryInput } from '@/lib/services/categories';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCategoryInput | UpdateCategoryInput) => Promise<void>;
  category?: Category | null;
  mode: 'create' | 'edit';
}

// Predefined icons and colors
const ICONS = [
  'Wallet', 'Coffee', 'ShoppingBag', 'Car', 'Home', 'Zap', 'Heart', 
  'BookOpen', 'Film', 'Music', 'Smartphone', 'Laptop', 'Gift', 
  'TrendingUp', 'DollarSign', 'CreditCard', 'PiggyBank'
];

const COLORS = [
  '#ef4444', '#f59e0b', '#eab308', '#10b981', '#3b82f6', 
  '#8b5cf6', '#ec4899', '#64748b', '#06b6d4', '#f97316'
];

export default function CategoryModal({ isOpen, onClose, onSubmit, category, mode }: CategoryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense' as 'income' | 'expense',
    icon: 'Wallet',
    color: '#3b82f6',
    budget: 0
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Initialize form data when category changes
  useEffect(() => {
    if (category && mode === 'edit') {
      setFormData({
        name: category.name,
        type: category.type,
        icon: category.icon,
        color: category.color,
        budget: Number(category.budget)
      });
    } else {
      setFormData({
        name: '',
        type: 'expense',
        icon: 'Wallet',
        color: '#3b82f6',
        budget: 0
      });
    }
  }, [category, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(formData);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Error submitting category:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent || Icons.Wallet;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">
              {mode === 'create' ? 'Tambah Kategori' : 'Edit Kategori'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Success message */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mx-6 mt-4 p-3 bg-green-50 rounded-lg flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm text-green-700">
                  {mode === 'create' ? 'Kategori berhasil dibuat!' : 'Kategori berhasil diupdate!'}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Kategori
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: Transportasi, Makanan"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipe
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'expense' })}
                  className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                    formData.type === 'expense'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  Pengeluaran
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'income' })}
                  className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                    formData.type === 'income'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  Pemasukan
                </button>
              </div>
            </div>

            {/* Budget - only for expense */}
            {formData.type === 'expense' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget (Rp)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                  placeholder="0"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                />
              </div>
            )}

            {/* Icon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon
              </label>
              <div className="grid grid-cols-6 gap-2">
                {ICONS.map((iconName) => {
                  const IconComponent = getIconComponent(iconName);
                  const isSelected = formData.icon === iconName;
                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: iconName })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <IconComponent className="w-5 h-5 mx-auto text-gray-700" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Warna
              </label>
              <div className="flex gap-2">
                {COLORS.map((color) => {
                  const isSelected = formData.color === color;
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-10 h-10 rounded-lg transition-all ${
                        isSelected ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Preview */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-2">Preview</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${formData.color}20` }}
                >
                  {React.createElement(getIconComponent(formData.icon), {
                    className: 'w-6 h-6',
                    style: { color: formData.color }
                  })}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {formData.name || 'Nama Kategori'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formData.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                    {formData.type === 'expense' && formData.budget > 0 && 
                      ` • Budget: Rp ${formData.budget.toLocaleString('id-ID')}`
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading || !formData.name}
                className="flex-1 px-4 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Menyimpan...' : mode === 'create' ? 'Tambah' : 'Update'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
