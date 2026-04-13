// =====================================================
// FINANCE APP - Category Modal Component
// =====================================================
// Description: Modal for creating/editing categories
// =====================================================

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { getIconComponent, CATEGORY_ICONS, CATEGORY_COLORS } from '@/lib/utils/icons';
import type { Category, CreateCategoryInput, UpdateCategoryInput } from '@/lib/services/categories';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCategoryInput | UpdateCategoryInput) => Promise<void>;
  category?: Category | null;
  mode: 'create' | 'edit';
}

export default function CategoryModal({ isOpen, onClose, onSubmit, category, mode }: CategoryModalProps) {
  const [formData, setFormData] = useState<CreateCategoryInput | UpdateCategoryInput>({
    name: '',
    icon: 'ShoppingCart',
    color: '#1a237e',
    type: 'expense',
    budget: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form data when category changes
  useEffect(() => {
    if (category && mode === 'edit') {
      setFormData({
        name: category.name,
        icon: category.icon,
        color: category.color,
        type: category.type,
        budget: Number(category.budget)
      });
    } else {
      setFormData({
        name: '',
        icon: 'ShoppingCart',
        color: '#1a237e',
        type: 'expense',
        budget: 0
      });
    }
    setError(null);
  }, [category, mode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validation
    if (!formData.name?.trim()) {
      setError('Category name is required');
      return;
    }
    
    if (formData.budget && formData.budget < 0) {
      setError('Budget cannot be negative');
      return;
    }

    setLoading(true);

    try {
      await onSubmit(formData);
      // Parent component handles success popup and closing
    } catch (err: any) {
      console.error('Error submitting category:', err);
      // Extract meaningful error message
      const errorMessage = err?.message || 
                          err?.error?.message || 
                          err?.toString() || 
                          'Failed to save category. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center p-0">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/35"
          style={{ backdropFilter: 'blur(2px)' }}
        />

        {/* Bottom Sheet */}
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-white rounded-t-[28px] shadow-2xl w-full max-w-[430px] max-h-[95vh] overflow-y-auto"
        >
          {/* Drag Handle */}
          <div className="flex justify-center pt-3.5 pb-5">
            <div className="w-[38px] h-1 bg-gray-300 rounded-full" />
          </div>

          {/* Content Container */}
          <div className="px-6 pb-28">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[22px] font-black text-gray-900" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                {mode === 'create' ? 'Create Category' : 'Edit Category'}
              </h2>
              <button
                onClick={onClose}
                className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" strokeWidth={2.5} />
              </button>
            </div>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-5 p-3.5 bg-red-500 rounded-2xl flex items-center gap-3 shadow-lg shadow-red-500/25"
                >
                  <X className="w-5 h-5 text-white flex-shrink-0" />
                  <span className="text-sm font-bold text-white">
                    {error}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Live Preview */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-2.5">
                  Live Preview
                </label>
                <div className="bg-gray-50 rounded-[18px] py-6 px-4 flex flex-col items-center gap-2.5">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{ backgroundColor: formData.color }}
                  >
                    {React.createElement(getIconComponent(formData.icon || 'ShoppingCart'), {
                      className: 'w-7 h-7',
                      style: { color: 'white', strokeWidth: 1.8 }
                    })}
                  </div>
                  <div className="text-xl font-black text-gray-900" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    {formData.name || 'Dining Out'}
                  </div>
                  <div className="text-[13px] text-gray-400 font-medium">
                    {formData.budget && formData.budget > 0 
                      ? `Monthly Budget: Rp${formData.budget.toLocaleString('id-ID')}`
                      : 'Monthly Budget: Rp0'
                    }
                  </div>
                </div>
              </div>

              {/* Category Name */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-2.5">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Health & Fitness"
                  className="w-full px-[18px] py-4 bg-gray-50 rounded-2xl border-0 outline-none text-[14.5px] text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-900/25 transition-all"
                />
              </div>

              {/* Category Type */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-2.5">
                  Category Type
                </label>
                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'expense' })}
                    className={`flex-1 py-3.5 rounded-2xl font-bold text-sm transition-all ${
                      formData.type === 'expense'
                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    💸 Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'income' })}
                    className={`flex-1 py-3.5 rounded-2xl font-bold text-sm transition-all ${
                      formData.type === 'income'
                        ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    💰 Income
                  </button>
                </div>
              </div>

              {/* Monthly Budget */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-2.5">
                  Monthly Budget
                </label>
                <div className="relative">
                  <span className="absolute left-[18px] top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">
                    Rp
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="10000"
                    value={formData.budget || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Prevent leading zeros
                      const numValue = value === '' ? 0 : parseInt(value, 10);
                      setFormData({ ...formData, budget: isNaN(numValue) ? 0 : numValue });
                    }}
                    placeholder="0"
                    className="w-full pl-12 pr-[18px] py-4 bg-gray-50 rounded-2xl border-0 outline-none font-bold text-gray-900 text-base placeholder:text-gray-400 focus:ring-2 focus:ring-blue-900/25 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em]">
                    Select Icon
                  </label>
                  <span className="text-[13px] font-bold text-blue-900 cursor-pointer">
                    {CATEGORY_ICONS.length} Icons
                  </span>
                </div>
                <div className="relative">
                  {/* Scroll fade hint - right side */}
                  <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 rounded-r-2xl" />
                  
                  <div 
                    className="grid grid-rows-3 grid-flow-col gap-2.5 overflow-x-auto pb-2 -mx-1 px-1"
                    style={{ 
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                      WebkitOverflowScrolling: 'touch'
                    }}
                  >
                    {CATEGORY_ICONS.map((iconName) => {
                      const IconComponent = getIconComponent(iconName);
                      const isSelected = formData.icon === iconName;
                      return (
                        <button
                          key={iconName}
                          type="button"
                          onClick={() => setFormData({ ...formData, icon: iconName })}
                          className={`flex-shrink-0 w-[52px] h-[52px] rounded-2xl flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-gray-100 border-2 border-blue-900'
                              : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                          }`}
                        >
                          <IconComponent 
                            className={`w-[22px] h-[22px] ${isSelected ? 'text-blue-900' : 'text-gray-600'}`}
                            strokeWidth={1.8}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Theme Color */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-2.5">
                  Theme Color
                </label>
                <div className="flex flex-wrap gap-3">
                  {CATEGORY_COLORS.map((color) => {
                    const isSelected = formData.color === color;
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({ ...formData, color })}
                        className={`w-[46px] h-[46px] rounded-full transition-all active:scale-90 ${
                          isSelected ? 'ring-[3px] ring-offset-[3px]' : ''
                        }`}
                        style={{ 
                          backgroundColor: color,
                          outlineColor: isSelected ? color : 'transparent'
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                disabled={loading || !formData.name}
                className="w-full bg-blue-900 text-white rounded-full py-[18px] font-bold text-base shadow-lg shadow-blue-900/30 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-98"
              >
                {loading ? 'Saving...' : mode === 'create' ? 'Save Category' : 'Update Category'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
