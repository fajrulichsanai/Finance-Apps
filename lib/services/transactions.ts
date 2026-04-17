// =====================================================
// FINANCE APP - Transaction Service
// =====================================================
// Description: CRUD operations for transactions
// =====================================================

import { createClient } from '@/lib/supabase/client';

export interface Transaction {
  id: string;
  user_id: string;
  category_id: string | null;
  type: 'income' | 'expense';
  amount: number;
  description?: string | null; // Optional - can be empty
  note?: string;
  transaction_date: string; // ISO date string
  created_at: string;
  updated_at: string;
  // Joined fields from category
  category_name?: string;
  category_icon?: string;
  category_color?: string;
}

export interface CreateTransactionInput {
  category_id?: string | null; // Optional - income doesn't require category
  type: 'income' | 'expense';
  amount: number;
  description?: string; // Optional - can be empty
  note?: string;
  transaction_date?: string; // ISO date, defaults to today
}

export interface UpdateTransactionInput {
  category_id?: string | null;
  type?: 'income' | 'expense';
  amount?: number;
  description?: string;
  note?: string;
  transaction_date?: string;
}

export interface TransactionFilters {
  type?: 'income' | 'expense';
  category_id?: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
}

class TransactionService {
  private supabase = createClient();

  /**
   * Get all transactions for current user with optional filters
   */
  async getTransactions(filters: TransactionFilters = {}) {
    try {
      let query = this.supabase
        .from('transactions')
        .select(`
          *,
          category:categories(
            name,
            icon,
            color
          )
        `)
        .order('transaction_date', { ascending: false })
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.type) {
        query = query.eq('type', filters.type);
      }
      if (filters.category_id) {
        query = query.eq('category_id', filters.category_id);
      }
      if (filters.start_date) {
        query = query.gte('transaction_date', filters.start_date);
      }
      if (filters.end_date) {
        query = query.lte('transaction_date', filters.end_date);
      }
      // OPTIMIZED: Add default limit to prevent unbounded queries
      if (filters.limit) {
        query = query.limit(filters.limit);
      } else {
        query = query.limit(100); // Default limit to prevent data explosion
      }
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 100) - 1);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Flatten category data
      return (data || []).map((tx: any) => ({
        ...tx,
        category_name: tx.category?.name,
        category_icon: tx.category?.icon,
        category_color: tx.category?.color,
        category: undefined // Remove nested object
      })) as Transaction[];

    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  /**
   * Get single transaction by ID
   */
  async getTransactionById(id: string) {
    try {
      const { data, error } = await this.supabase
        .from('transactions')
        .select(`
          *,
          category:categories(
            name,
            icon,
            color
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      // Flatten category data
      return {
        ...data,
        category_name: data.category?.name,
        category_icon: data.category?.icon,
        category_color: data.category?.color,
        category: undefined
      } as Transaction;

    } catch (error) {
      console.error('Error fetching transaction:', error);
      throw error;
    }
  }

  /**
   * Create new transaction
   */
  async createTransaction(input: CreateTransactionInput) {
    try {
      // Get current user
      const { data: { user }, error: authError } = await this.supabase.auth.getUser();
      if (authError) {
        console.error('[createTransaction] Auth error:', authError.message);
        throw new Error(`Authentication failed: ${authError.message}`);
      }
      if (!user) {
        throw new Error('User not authenticated');
      }

      console.log('[createTransaction] Validating input:', { type: input.type, has_category: !!input.category_id });

      // Validate amount
      if (!input.amount || input.amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }

      // Validate type
      if (!input.type || !['income', 'expense'].includes(input.type)) {
        throw new Error('Transaction type must be either "income" or "expense"');
      }

      // Validate category for expenses
      if (input.type === 'expense' && !input.category_id) {
        throw new Error('Category is required for expense transactions');
      }

      // Description is now optional - can be empty string
      const description = input.description?.trim() || '';

      console.log('[createTransaction] Inserting transaction...');

      const { data, error } = await this.supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          category_id: input.category_id || null,
          type: input.type,
          amount: input.amount,
          description: description,
          note: input.note || null,
          transaction_date: input.transaction_date || new Date().toISOString().split('T')[0]
        })
        .select(`
          *,
          category:categories(
            name,
            icon,
            color
          )
        `)
        .single();

      if (error) {
        console.error('[createTransaction] Database error:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw new Error(`Failed to create transaction: ${error.message}`);
      }

      console.log('[createTransaction] Transaction created:', data.id);

      return {
        ...data,
        category_name: data.category?.name,
        category_icon: data.category?.icon,
        category_color: data.category?.color,
        category: undefined
      } as Transaction;

    } catch (error: any) {
      const errorMsg = error?.message || 'Unknown error occurred';
      console.error('[createTransaction] Error:', errorMsg);
      throw new Error(errorMsg);
    }
  }

  /**
   * Update existing transaction
   */
  async updateTransaction(id: string, input: UpdateTransactionInput) {
    try {
      // Validate amount if provided
      if (input.amount !== undefined && input.amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }

      const { data, error } = await this.supabase
        .from('transactions')
        .update(input)
        .eq('id', id)
        .select(`
          *,
          category:categories(
            name,
            icon,
            color
          )
        `)
        .single();

      if (error) throw error;

      return {
        ...data,
        category_name: data.category?.name,
        category_icon: data.category?.icon,
        category_color: data.category?.color,
        category: undefined
      } as Transaction;

    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  }

  /**
   * Delete transaction
   */
  async deleteTransaction(id: string) {
    try {
      const { error } = await this.supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { success: true };

    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  }

  /**
   * Get recent transactions (last 30 days by default)
   */
  async getRecentTransactions(limit: number = 20) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return this.getTransactions({
      start_date: thirtyDaysAgo.toISOString().split('T')[0],
      limit
    });
  }
}

// Export singleton instance
export const transactionService = new TransactionService();
