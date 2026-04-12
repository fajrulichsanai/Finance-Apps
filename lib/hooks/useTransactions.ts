// =====================================================
// FINANCE APP - Transaction Hooks
// =====================================================
// Description: React hooks for transaction operations
// =====================================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  transactionService, 
  type Transaction,
  type CreateTransactionInput,
  type UpdateTransactionInput,
  type TransactionFilters
} from '@/lib/services/transactions';

export function useTransactions(filters?: TransactionFilters) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await transactionService.getTransactions(filters);
      setTransactions(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const createTransaction = async (input: CreateTransactionInput) => {
    try {
      const newTransaction = await transactionService.createTransaction(input);
      setTransactions(prev => [newTransaction, ...prev]);
      return newTransaction;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const updateTransaction = async (id: string, input: UpdateTransactionInput) => {
    try {
      const updated = await transactionService.updateTransaction(id, input);
      setTransactions(prev => prev.map(tx => tx.id === id ? updated : tx));
      return updated;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await transactionService.deleteTransaction(id);
      setTransactions(prev => prev.filter(tx => tx.id !== id));
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const refresh = () => {
    fetchTransactions();
  };

  return {
    transactions,
    loading,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    refresh
  };
}

export function useRecentTransactions(limit: number = 20) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRecent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await transactionService.getRecentTransactions(limit);
      setTransactions(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching recent transactions:', err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchRecent();
  }, [fetchRecent]);

  return {
    transactions,
    loading,
    error,
    refresh: fetchRecent
  };
}
