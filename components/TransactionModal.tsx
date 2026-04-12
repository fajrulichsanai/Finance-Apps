// =====================================================
// FINANCE APP - Transaction Modal
// =====================================================
// Description: Modal form for creating/editing transactions
// =====================================================

'use client';

import React, { useState, useEffect } from 'react';
import { X, Coffee, Car, Home, ShoppingBag, Zap, Gift, Briefcase, DollarSign, Heart, BookOpen, MoreHorizontal, Film, TrendingUp } from 'lucide-react';
import { useCategories } from '@/lib/hooks/useCategories';
import CustomSelect, { type SelectOption } from '@/components/CustomSelect';
import type { CreateTransactionInput, Transaction } from '@/lib/services/transactions';

// Icon mapping
const iconMap: Record<string, any> = {
  Coffee, Car, Home, ShoppingBag, Zap, Gift, Briefcase, DollarSign, Heart, BookOpen, MoreHorizontal, Film, TrendingUp
};

const getIconComponent = (iconName: string) => {
  const Icon = iconMap[iconName] || ShoppingBag;
  return <Icon className="w-5 h-5" />;
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

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTransactionInput) => Promise<void>;
  editTransaction?: Transaction | null;
  mode?: 'create' | 'edit';
}

export default function TransactionModal({
  isOpen,
  onClose,
  onSubmit,
  editTransaction,
  mode = 'create'
}: TransactionModalProps) {
  const { incomeCategories, expenseCategories, loading: categoriesLoading } = useCategories();
  
  const [formData, setFormData] = useState<CreateTransactionInput>({
    type: 'expense',
    amount: 0,
    description: '',
    category_id: null,
    note: '',
    transaction_date: new Date().toISOString().split('T')[0]
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form with edit data
  useEffect(() => {
    if (mode === 'edit' && editTransaction) {
      setFormData({
        type: editTransaction.type,
        amount: editTransaction.amount,
        description: editTransaction.description,
        category_id: editTransaction.category_id,
        note: editTransaction.note || '',
        transaction_date: editTransaction.transaction_date
      });
    }
  }, [mode, editTransaction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.description.trim()) {
      setError('Deskripsi harus diisi');
      return;
    }
    if (formData.amount <= 0) {
      setError('Jumlah harus lebih dari 0');
      return;
    }
    if (!formData.category_id) {
      setError('Silakan pilih kategori');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await onSubmit(formData);
      
      // Reset form
      setFormData({
        type: 'expense',
        amount: 0,
        description: '',
        category_id: null,
        note: '',
        transaction_date: new Date().toISOString().split('T')[0]
      });
      
      onClose();
    } catch (err) {
      setError((err as Error).message || 'Gagal menyimpan transaksi');
    } finally {
      setSubmitting(false);
    }
  };

  const currentCategories = formData.type === 'income' ? incomeCategories : expenseCategories;

  // Convert categories to SelectOption format
  const categoryOptions: SelectOption[] = currentCategories.map(cat => ({
    value: cat.id,
    label: cat.name,
    icon: getIconComponent(cat.icon || ''),
    color: cat.color ? `bg-[${cat.color}]/10 text-[${cat.color}]` : undefined
  }));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div 
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            {mode === 'edit' ? 'Edit Transaksi' : 'Tambah Transaksi'}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Type Toggle */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Tipe</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'expense', category_id: null })}
                className={`py-3 px-4 rounded-xl font-medium transition-all ${
                  formData.type === 'expense'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Pengeluaran
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'income', category_id: null })}
                className={`py-3 px-4 rounded-xl font-medium transition-all ${
                  formData.type === 'income'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Pemasukan
              </button>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-2">
              Jumlah
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">Rp</span>
              <input
                type="number"
                id="amount"
                step="1000"
                min="0"
                value={formData.amount || ''}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="0"
                required
              />
            </div>
          </div>

          {/* Category */}
          <CustomSelect
            label="Kategori"
            options={categoryOptions}
            value={formData.category_id || ''}
            onChange={(value) => setFormData({ ...formData, category_id: value })}
            placeholder="Pilih kategori"
            disabled={categoriesLoading}
          />

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
              Deskripsi
            </label>
            <input
              type="text"
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Contoh: Makan siang, Gaji, dll"
              required
            />
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-2">
              Tanggal
            </label>
            <input
              type="date"
              id="date"
              value={formData.transaction_date}
              onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Note */}
          <div>
            <label htmlFor="note" className="block text-sm font-medium text-slate-700 mb-2">
              Catatan (Opsional)
            </label>
            <textarea
              id="note"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Tambahkan catatan tambahan..."
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 px-4 rounded-xl font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Menyimpan...' : mode === 'edit' ? 'Update' : 'Tambah'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
