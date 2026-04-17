// =====================================================
// FINANCE APP - Statistics Service
// =====================================================
// Description: Analytics and reporting for financial data
// =====================================================

import { createClient } from '@/lib/supabase/client';

export interface BalanceSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  percentageChange?: number;
}

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

export interface CategoryBreakdown {
  category_name: string;
  category_icon: string;
  category_color: string;
  total_amount: number;
  transaction_count: number;
  percentage?: number;
}

export interface DailyTrend {
  date: string;
  balance: number;
  income: number;
  expense: number;
}

// RPC Response Types
export interface BalanceSummaryRPC {
  total_income: number;
  total_expense: number;
  balance: number;
}

export interface DashboardDataRPC {
  total_income_all_time: number;
  total_expense_all_time: number;
  balance_all_time: number;
  total_income_month: number;
  total_expense_month: number;
  balance_month: number;
  categories_data: any[];
  recent_transactions_data: any[];
}

class StatisticsService {
  private supabase = createClient();

  /**
   * Get total balance summary (optimized with RPC - no client-side processing)
   */
  async getBalanceSummary(): Promise<BalanceSummary> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await this.supabase
        .rpc('get_balance_summary_optimized', {
          p_user_id: user.id
        })
        .single<BalanceSummaryRPC>();

      if (error) throw error;

      return {
        totalIncome: Number(data?.total_income) || 0,
        totalExpense: Number(data?.total_expense) || 0,
        balance: Number(data?.balance) || 0
      };

    } catch (error) {
      console.error('Error fetching balance summary:', error);
      throw error;
    }
  }

  /**
   * Get current month income/expense (optimized with RPC)
   */
  async getCurrentMonthSummary(): Promise<BalanceSummary> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await this.supabase
        .rpc('get_current_month_summary_optimized', {
          p_user_id: user.id
        })
        .single<BalanceSummaryRPC>();

      if (error) throw error;

      return {
        totalIncome: Number(data?.total_income) || 0,
        totalExpense: Number(data?.total_expense) || 0,
        balance: Number(data?.balance) || 0
      };

    } catch (error) {
      console.error('Error fetching current month summary:', error);
      throw error;
    }
  }

  /**
   * Get monthly data for charts (last N months)
   */
  async getMonthlyData(months: number = 6): Promise<MonthlyData[]> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Calculate start date
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months + 1);
      startDate.setDate(1);

      const { data, error } = await this.supabase
        .from('transactions')
        .select('transaction_date, type, amount')
        .eq('user_id', user.id)
        .gte('transaction_date', startDate.toISOString().split('T')[0])
        .order('transaction_date', { ascending: true })
        .limit(10000); // OPTIMIZED: Add limit to prevent huge payloads

      if (error) throw error;

      // Group by month
      const monthlyMap = new Map<string, { income: number; expense: number }>();

      (data || []).forEach((tx: any) => {
        const date = new Date(tx.transaction_date);
        const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
        
        if (!monthlyMap.has(monthKey)) {
          monthlyMap.set(monthKey, { income: 0, expense: 0 });
        }

        const monthData = monthlyMap.get(monthKey)!;
        if (tx.type === 'income') {
          monthData.income += Number(tx.amount);
        } else {
          monthData.expense += Number(tx.amount);
        }
      });

      // Convert to array
      return Array.from(monthlyMap.entries()).map(([month, data]) => ({
        month,
        income: data.income,
        expense: data.expense,
        balance: data.income - data.expense
      }));

    } catch (error) {
      console.error('Error fetching monthly data:', error);
      throw error;
    }
  }

  /**
   * Get category breakdown (using database function)
   */
  async getCategoryBreakdown(
    type: 'income' | 'expense' = 'expense',
    startDate?: string,
    endDate?: string
  ): Promise<CategoryBreakdown[]> {
    try {
      // Get authenticated user
      const { data: { user }, error: authError } = await this.supabase.auth.getUser();
      if (authError) {
        console.error('[getCategoryBreakdown] Auth error:', {
          message: authError.message,
          status: authError.status,
          name: authError.name
        });
        throw new Error(`Authentication failed: ${authError.message}`);
      }
      if (!user) {
        console.error('[getCategoryBreakdown] No user found');
        throw new Error('User not authenticated');
      }

      console.log('[getCategoryBreakdown] Calling RPC with params:', {
        user_id: user.id,
        type,
        start_date: startDate || 'null',
        end_date: endDate || 'null'
      });

      const { data, error } = await this.supabase.rpc('get_category_breakdown', {
        p_user_id: user.id,
        p_type: type,
        p_start_date: startDate || null,
        p_end_date: endDate || null
      });

      if (error) {
        console.error('[getCategoryBreakdown] RPC error:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          raw: JSON.stringify(error, null, 2)
        });
        const errorMessage = error.message || 'Unknown RPC error';
        const errorDetails = error.details || '';
        const errorHint = error.hint ? ` (Hint: ${error.hint})` : '';
        throw new Error(`Failed to fetch category breakdown: ${errorMessage}${errorDetails ? ' - ' + errorDetails : ''}${errorHint}`);
      }

      console.log('[getCategoryBreakdown] RPC success, rows:', (data || []).length);

      // Handle empty data - this is valid (no transactions yet)
      if (!data || data.length === 0) {
        console.log('[getCategoryBreakdown] No data found - returning empty array');
        return [];
      }

      const total = data.reduce((sum: number, cat: any) => sum + Number(cat.total_amount), 0);

      const result = data.map((cat: any) => ({
        ...cat,
        total_amount: Number(cat.total_amount),
        percentage: total > 0 ? (Number(cat.total_amount) / total) * 100 : 0
      }));

      console.log('[getCategoryBreakdown] Processed results:', result.length, 'categories');
      return result;

    } catch (error: any) {
      const errorMsg = error?.message || 'Unknown error';
      const errorDetails = {
        name: error?.name,
        message: errorMsg,
        stack: error?.stack?.split('\n')[0]
      };
      console.error('[getCategoryBreakdown] Caught error:', errorDetails);
      throw new Error(errorMsg);
    }
  }

  /**
   * Get daily balance trend (last N days)
   */
  async getDailyTrend(days: number = 7): Promise<DailyTrend[]> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days + 1);

      const { data, error } = await this.supabase
        .from('transactions')
        .select('transaction_date, type, amount')
        .eq('user_id', user.id)
        .gte('transaction_date', startDate.toISOString().split('T')[0])
        .order('transaction_date', { ascending: true })
        .limit(1000); // OPTIMIZED: Add limit to prevent huge payloads

      if (error) throw error;

      // Group by date
      const dateMap = new Map<string, { income: number; expense: number }>();

      // Initialize all dates in range
      for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateKey = date.toISOString().split('T')[0];
        dateMap.set(dateKey, { income: 0, expense: 0 });
      }

      // Populate with actual data
      (data || []).forEach((tx: any) => {
        const dateKey = tx.transaction_date;
        if (dateMap.has(dateKey)) {
          const dayData = dateMap.get(dateKey)!;
          if (tx.type === 'income') {
            dayData.income += Number(tx.amount);
          } else {
            dayData.expense += Number(tx.amount);
          }
        }
      });

      // Calculate cumulative balance
      let cumulativeBalance = 0;
      return Array.from(dateMap.entries()).map(([date, data]) => {
        cumulativeBalance += data.income - data.expense;
        return {
          date,
          income: data.income,
          expense: data.expense,
          balance: cumulativeBalance
        };
      });

    } catch (error) {
      console.error('Error fetching daily trend:', error);
      throw error;
    }
  }

  /**
   * Get top spending categories (current month)
   */
  async getTopSpendingCategories(limit: number = 5): Promise<CategoryBreakdown[]> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString().split('T')[0];
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString().split('T')[0];

    const breakdown = await this.getCategoryBreakdown('expense', startOfMonth, endOfMonth);
    return breakdown.slice(0, limit);
  }

  /**
   * OPTIMIZED: Get all dashboard data in single RPC call
   * Combines: balance summary, month summary, categories with budget, recent transactions
   * Reduces 4 queries to 1 - critical for Supabase Free Tier
   */
  async getDashboardData() {
    try {
      const { data: { user }, error: authError } = await this.supabase.auth.getUser();
      if (authError) {
        console.error('[getDashboardData] Auth error:', authError.message);
        throw new Error(`Authentication failed: ${authError.message}`);
      }
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await this.supabase
        .rpc('get_dashboard_data', {
          p_user_id: user.id
        })
        .single<DashboardDataRPC>();

      if (error) {
        console.error('[getDashboardData] RPC error:', {
          message: error.message,
          details: error.details,
          code: error.code
        });
        throw new Error(`Failed to fetch dashboard data: ${error.message}`);
      }

      // Parse JSON fields if they're strings
      const categoriesData = typeof data?.categories_data === 'string' 
        ? JSON.parse(data.categories_data) 
        : data?.categories_data || [];
      const transactionsData = typeof data?.recent_transactions_data === 'string'
        ? JSON.parse(data.recent_transactions_data)
        : data?.recent_transactions_data || [];

      return {
        balanceSummary: {
          totalIncome: Number(data?.total_income_all_time) || 0,
          totalExpense: Number(data?.total_expense_all_time) || 0,
          balance: Number(data?.balance_all_time) || 0
        },
        monthSummary: {
          totalIncome: Number(data?.total_income_month) || 0,
          totalExpense: Number(data?.total_expense_month) || 0,
          balance: Number(data?.balance_month) || 0
        },
        categories: categoriesData,
        recentTransactions: transactionsData
      };
    } catch (error) {
      console.error('[getDashboardData] Error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const statisticsService = new StatisticsService();
