// =====================================================
// FINANCE APP - Categories Service
// =====================================================
// Description: Manage transaction categories with budget tracking
// =====================================================

import { createClient } from '@/lib/supabase/client';

export interface Category {
  id: string;
  user_id: string | null;
  name: string;
  icon: string;
  color: string;
  budget: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryWithBudget extends Category {
  total_spent: number;
  remaining_budget: number;
  transaction_count: number;
}

export interface CreateCategoryInput {
  name: string;
  icon: string;
  color: string;
  budget?: number;
}

export interface UpdateCategoryInput {
  name?: string;
  icon?: string;
  color?: string;
  budget?: number;
}

class CategoryService {
  private supabase = createClient();

  /**
   * Get all user categories (templates + user's own)
   */
  async getAllCategories() {
    try {
      const { data, error } = await this.supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;

      return data as Category[];

    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  /**
   * Get user's categories with budget tracking
   */
  async getCategoriesWithBudget() {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await this.supabase
        .rpc('get_categories_with_budget', {
          p_user_id: user.id
        });

      if (error) throw error;

      return data as CategoryWithBudget[];

    } catch (error) {
      console.error('Error fetching categories with budget:', error);
      throw error;
    }
  }

  /**
   * Get user's own categories only (excluding templates)
   */
  async getUserCategories() {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await this.supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .order('name', { ascending: true });

      if (error) throw error;

      return data as Category[];

    } catch (error) {
      console.error('Error fetching user categories:', error);
      throw error;
    }
  }

  /**
   * Get category by ID
   */
  async getCategoryById(id: string) {
    try {
      const { data, error } = await this.supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return data as Category;

    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  }

  /**
   * Create a new category
   */
  async createCategory(input: CreateCategoryInput) {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Validate input
      if (!input.name || !input.name.trim()) {
        throw new Error('Category name is required');
      }

      const { data, error } = await this.supabase
        .from('categories')
        .insert({
          user_id: user.id,
          name: input.name.trim(),
          icon: input.icon || 'Wallet',
          color: input.color || '#3b82f6',
          budget: input.budget || 0
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error creating category:', error);
        throw new Error(error.message || 'Failed to create category');
      }

      return data as Category;

    } catch (error: any) {
      console.error('Error creating category:', error);
      throw new Error(error?.message || 'Failed to create category');
    }
  }

  /**
   * Update a category
   */
  async updateCategory(id: string, input: UpdateCategoryInput) {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Validate input if name is being updated
      if (input.name !== undefined && !input.name.trim()) {
        throw new Error('Category name cannot be empty');
      }

      // Prepare update data with trimmed name if present
      const updateData = {
        ...input,
        ...(input.name && { name: input.name.trim() })
      };

      const { data, error } = await this.supabase
        .from('categories')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Supabase error updating category:', error);
        throw new Error(error.message || 'Failed to update category');
      }

      if (!data) {
        throw new Error('Category not found or you do not have permission to update it');
      }

      return data as Category;

    } catch (error: any) {
      console.error('Error updating category:', error);
      throw new Error(error?.message || 'Failed to update category');
    }
  }

  /**
   * Delete a category
   */
  async deleteCategory(id: string) {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await this.supabase
        .from('categories')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      return true;

    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }

  /**
   * Initialize default categories for current user
   */
  async initializeUserCategories() {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await this.supabase
        .rpc('initialize_user_categories', {
          p_user_id: user.id
        });

      if (error) throw error;

      return true;

    } catch (error) {
      console.error('Error initializing user categories:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const categoryService = new CategoryService();
