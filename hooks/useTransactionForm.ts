// =====================================================
// FINANCE APP - Transaction Form Hook
// =====================================================

'use client';

import { useState, useCallback } from 'react';
import type { TransactionFormData, TransactionType } from '@/types';
import type { CreateTransactionInput } from '@/lib/services/transactions';
import { DEFAULT_TRANSACTION_AMOUNT } from '@/lib/constants/transaction';

export function useTransactionForm() {
  const [formData, setFormData] = useState<TransactionFormData>({
    type: 'expense',
    amount: DEFAULT_TRANSACTION_AMOUNT,
    category_id: null,
    description: '',
    note: '',
    transaction_date: new Date().toISOString().split('T')[0],
    tags: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateType = useCallback((type: TransactionType) => {
    setFormData(prev => ({ ...prev, type, category_id: null }));
  }, []);

  const updateAmount = useCallback((amount: number) => {
    setFormData(prev => ({ ...prev, amount }));
  }, []);

  const updateCategory = useCallback((category_id: string) => {
    setFormData(prev => ({ ...prev, category_id }));
  }, []);

  const updateNote = useCallback((note: string) => {
    setFormData(prev => ({ ...prev, note }));
  }, []);

  const updateDescription = useCallback((description: string) => {
    setFormData(prev => ({ ...prev, description }));
  }, []);

  const updateDate = useCallback((transaction_date: string) => {
    setFormData(prev => ({ ...prev, transaction_date }));
  }, []);

  const addTag = useCallback((tag: string) => {
    const normalizedTag = tag.trim().startsWith('#') ? tag.trim() : `#${tag.trim()}`;
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.includes(normalizedTag) 
        ? prev.tags 
        : [...(prev.tags || []), normalizedTag],
    }));
  }, []);

  const removeTag = useCallback((tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || [],
    }));
  }, []);

  const validateForm = useCallback((): string | null => {
    if (formData.amount <= 0) return 'Jumlah harus lebih dari 0';
    if (formData.amount > 999_999_999) return 'Jumlah transaksi terlalu besar (max: Rp 999.999.999)';
    
    // Check for future dates
    const selectedDate = new Date(formData.transaction_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate > today) {
      return 'Tanggal transaksi tidak boleh di masa depan';
    }
    
    // Category required only for expense
    if (formData.type === 'expense' && !formData.category_id) {
      return 'Pilih kategori untuk pengeluaran';
    }
    // Description no longer required
    return null;
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData({
      type: 'expense',
      amount: DEFAULT_TRANSACTION_AMOUNT,
      category_id: null,
      description: '',
      note: '',
      transaction_date: new Date().toISOString().split('T')[0],
      tags: [],
    });
    setError(null);
  }, []);

  const prepareSubmitData = useCallback((): CreateTransactionInput => {
    const data: CreateTransactionInput = {
      type: formData.type,
      amount: formData.amount,
      description: formData.description || `${formData.type === 'income' ? 'Pemasukan' : 'Pengeluaran'} ${new Date().toLocaleDateString('id-ID')}`,
      note: formData.note,
      transaction_date: formData.transaction_date,
    };
    
    // Include category only if selected (required for expense)
    if (formData.category_id) {
      data.category_id = formData.category_id;
    }
    
    return data;
  }, [formData]);

  return {
    formData,
    isSubmitting,
    error,
    setIsSubmitting,
    setError,
    updateType,
    updateAmount,
    updateCategory,
    updateNote,
    updateDescription,
    updateDate,
    addTag,
    removeTag,
    validateForm,
    resetForm,
    prepareSubmitData,
  };
}
