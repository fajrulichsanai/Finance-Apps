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
    if (formData.amount <= 0) return 'Amount must be greater than 0';
    if (!formData.category_id) return 'Please select a category';
    if (!formData.description.trim()) return 'Description is required';
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
    return {
      type: formData.type,
      amount: formData.amount,
      category_id: formData.category_id!,
      description: formData.description,
      note: formData.note,
      transaction_date: formData.transaction_date,
    };
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
    addTag,
    removeTag,
    validateForm,
    resetForm,
    prepareSubmitData,
  };
}
