// =====================================================
// FINANCE APP - Statistics Hooks
// =====================================================
// Description: React hooks for statistics and analytics
// =====================================================

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  statisticsService,
  type BalanceSummary,
  type MonthlyData,
  type CategoryBreakdown,
  type DailyTrend
} from '@/lib/services/statistics';

export function useBalanceSummary() {
  const [summary, setSummary] = useState<BalanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await statisticsService.getBalanceSummary();
      setSummary(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching balance summary:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return {
    summary,
    loading,
    error,
    refresh: fetchSummary
  };
}

export function useCurrentMonthSummary() {
  const [summary, setSummary] = useState<BalanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await statisticsService.getCurrentMonthSummary();
      setSummary(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching current month summary:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return {
    summary,
    loading,
    error,
    refresh: fetchSummary
  };
}

export function useMonthlyData(months: number = 6) {
  const [data, setData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const monthlyData = await statisticsService.getMonthlyData(months);
      setData(monthlyData);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching monthly data:', err);
    } finally {
      setLoading(false);
    }
  }, [months]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refresh: fetchData
  };
}

export function useCategoryBreakdown(
  type: 'income' | 'expense' = 'expense',
  startDate?: string,
  endDate?: string
) {
  const [data, setData] = useState<CategoryBreakdown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const breakdown = await statisticsService.getCategoryBreakdown(type, startDate, endDate);
      setData(breakdown);
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to fetch category breakdown';
      const errorObj = new Error(errorMessage);
      setError(errorObj);
      console.error('[useCategoryBreakdown] Error:', {
        message: errorMessage,
        type,
        startDate,
        endDate
      });
    } finally {
      setLoading(false);
    }
  }, [type, startDate, endDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refresh: fetchData
  };
}

export function useDailyTrend(days: number = 7) {
  const [data, setData] = useState<DailyTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const trend = await statisticsService.getDailyTrend(days);
      setData(trend);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching daily trend:', err);
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refresh: fetchData
  };
}

export function useTopSpendingCategories(limit: number = 5) {
  const [data, setData] = useState<CategoryBreakdown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const categories = await statisticsService.getTopSpendingCategories(limit);
      setData(categories);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching top spending categories:', err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refresh: fetchData
  };
}

/**
 * OPTIMIZED: Fetch all dashboard data with single RPC call
 * Combines balance, month summary, categories, and transactions
 * Reduces 4 queries to 1 for Free Tier optimization
 */
export function useDashboardData() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchDashboardData = useCallback(async () => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      if (!isMountedRef.current) return;
      setLoading(true);
      setError(null);
      const data = await statisticsService.getDashboardData();
      
      // Debug logging to help identify data issues
      console.log('[useDashboardData] Fetched dashboard data:', {
        balanceSummary: data?.balanceSummary,
        monthSummary: data?.monthSummary,
        categoriesCount: data?.categories?.length || 0,
        transactionsCount: data?.recentTransactions?.length || 0
      });
      
      // Only update state if component still mounted
      if (isMountedRef.current) {
        setDashboardData(data);
      }
    } catch (err: any) {
      // Ignore abort errors (component unmounted or cancelled)
      if (err?.name === 'AbortError') {
        console.log('[useDashboardData] Fetch cancelled');
        return;
      }

      if (isMountedRef.current) {
        setError(err as Error);
        console.error('[useDashboardData] Error fetching dashboard data:', err);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    fetchDashboardData();

    return () => {
      isMountedRef.current = false;
      // Cancel any pending request on unmount
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchDashboardData]);

  return {
    dashboardData,
    loading,
    error,
    refresh: fetchDashboardData
  };
}
