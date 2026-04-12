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

class StatisticsService {
  private supabase = createClient();

  /**
   * Get total balance summary
   */
  async getBalanceSummary(): Promise<BalanceSummary> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await this.supabase
        .from('transactions')
        .select('type, amount')
        .eq('user_id', user.id);

      if (error) throw error;

      const totalIncome = (data || [])
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const totalExpense = (data || [])
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const balance = totalIncome - totalExpense;

      return {
        totalIncome,
        totalExpense,
        balance
      };

    } catch (error) {
      console.error('Error fetching balance summary:', error);
      throw error;
    }
  }

  /**
   * Get current month income/expense
   */
  async getCurrentMonthSummary(): Promise<BalanceSummary> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString().split('T')[0];

      const { data, error } = await this.supabase
        .from('transactions')
        .select('type, amount')
        .eq('user_id', user.id)
        .gte('transaction_date', startOfMonth);

      if (error) throw error;

      const totalIncome = (data || [])
        .filter((t: any) => t.type === 'income')
        .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

      const totalExpense = (data || [])
        .filter((t: any) => t.type === 'expense')
        .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

      return {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense
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
        .order('transaction_date', { ascending: true });

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
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await this.supabase.rpc('get_category_breakdown', {
        p_user_id: user.id,
        p_type: type,
        p_start_date: startDate || null,
        p_end_date: endDate || null
      });

      if (error) throw error;

      const total = (data || []).reduce((sum: number, cat: any) => sum + Number(cat.total_amount), 0);

      return (data || []).map((cat: any) => ({
        ...cat,
        total_amount: Number(cat.total_amount),
        percentage: total > 0 ? (Number(cat.total_amount) / total) * 100 : 0
      }));

    } catch (error) {
      console.error('Error fetching category breakdown:', error);
      throw error;
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
        .order('transaction_date', { ascending: true });

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
}

// Export singleton instance
export const statisticsService = new StatisticsService();
