// =====================================================
// FINANCE APP - Categories Hook
// =====================================================
// Description: React hooks for categories with budget tracking
// =====================================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  categoryService, 
  type Category, 
  type CategoryWithBudget,
  type CreateCategoryInput,
  type UpdateCategoryInput
} from '@/lib/services/categories';

/**
 * Hook for fetching all categories (user's own)
 */
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoryService.getUserCategories();
      setCategories(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const incomeCategories = categories.filter(c => c.type === 'income');
  const expenseCategories = categories.filter(c => c.type === 'expense');

  return {
    categories,
    incomeCategories,
    expenseCategories,
    loading,
    error,
    refresh: fetchCategories
  };
}

/**
 * Hook for categories with budget tracking
 */
export function useCategoriesWithBudget(type?: 'income' | 'expense') {
  const [categories, setCategories] = useState<CategoryWithBudget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoryService.getCategoriesWithBudget(type);
      setCategories(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching categories with budget:', err);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Calculate totals
  const totalBudget = categories.reduce((sum, cat) => sum + Number(cat.budget), 0);
  const totalSpent = categories.reduce((sum, cat) => sum + Number(cat.total_spent), 0);
  const totalRemaining = categories.reduce((sum, cat) => sum + Number(cat.remaining_budget), 0);

  // Find over-budget categories
  const overBudgetCategories = categories.filter(cat => Number(cat.remaining_budget) < 0);
  const warningCategories = categories.filter(cat => {
    const remaining = Number(cat.remaining_budget);
    const budget = Number(cat.budget);
    return remaining >= 0 && remaining < budget * 0.2; // Less than 20% remaining
  });

  return {
    categories,
    loading,
    error,
    refresh: fetchCategories,
    // Aggregates
    totalBudget,
    totalSpent,
    totalRemaining,
    // Alerts
    overBudgetCategories,
    warningCategories,
    hasOverBudget: overBudgetCategories.length > 0,
    hasWarnings: warningCategories.length > 0
  };
}

/**
 * Hook for expense categories with budget
 */
export function useExpenseBudgets() {
  return useCategoriesWithBudget('expense');
}

/**
 * Hook for managing categories (CRUD operations)
 */
export function useManageCategories() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createCategory = useCallback(async (input: CreateCategoryInput) => {
    try {
      setLoading(true);
      setError(null);
      const category = await categoryService.createCategory(input);
      return category;
    } catch (err) {
      setError(err as Error);
      console.error('Error creating category:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCategory = useCallback(async (id: string, input: UpdateCategoryInput) => {
    try {
      setLoading(true);
      setError(null);
      const category = await categoryService.updateCategory(id, input);
      return category;
    } catch (err) {
      setError(err as Error);
      console.error('Error updating category:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await categoryService.deleteCategory(id);
      return true;
    } catch (err) {
      setError(err as Error);
      console.error('Error deleting category:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const initializeCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await categoryService.initializeUserCategories();
      return true;
    } catch (err) {
      setError(err as Error);
      console.error('Error initializing categories:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createCategory,
    updateCategory,
    deleteCategory,
    initializeCategories,
    loading,
    error
  };
}
