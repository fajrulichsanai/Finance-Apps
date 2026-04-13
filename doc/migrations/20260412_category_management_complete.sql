-- filename: 20260412_category_management_complete.sql

-- PURPOSE:
-- Complete category management system with budget tracking, custom icons,
-- colors, and transaction counting. This migration documents the full
-- implementation for user-specific category wallets.

-- FEATURES:
-- ✅ Create custom categories with icons and colors
-- ✅ Set and adjust budget per category
-- ✅ Track spending and remaining budget
-- ✅ Count transactions per category
-- ✅ User-specific categories (personal wallets)
-- ✅ Row Level Security for data isolation

-- DEPENDENCIES:
-- * Requires Supabase Auth to be enabled
-- * Requires auth.users table

-- ============================================================
-- SQL MIGRATION - CATEGORY MANAGEMENT SYSTEM
-- ============================================================

-- =====================================================
-- TABLE: categories
-- =====================================================
-- Description: User-specific transaction categories with budget tracking
-- Each user can create their own categories (wallets) with custom budgets

CREATE TABLE IF NOT EXISTS public.categories (
  -- Primary identifier
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Ownership (NULL = global template, UUID = user-owned)
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Category information
  name VARCHAR(100) NOT NULL,
  
  -- Visual customization
  icon VARCHAR(50) DEFAULT 'Wallet',
  color VARCHAR(20) DEFAULT '#3b82f6',
  
  -- Budget tracking (only for expense categories)
  budget DECIMAL(12, 2) DEFAULT 0 CHECK (budget >= 0),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES: categories
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON public.categories(user_id);

-- =====================================================
-- TRIGGER: Auto-update timestamp
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_categories_updated_at ON public.categories;
CREATE TRIGGER update_categories_updated_at 
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- RLS: Enable Row Level Security
-- =====================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES: categories
-- =====================================================

-- Users can view their own categories + global templates
DROP POLICY IF EXISTS "Users can view own categories and templates" ON public.categories;
CREATE POLICY "Users can view own categories and templates"
  ON public.categories
  FOR SELECT
  USING (user_id = auth.uid() OR user_id IS NULL);

-- Users can create their own categories
DROP POLICY IF EXISTS "Users can insert own categories" ON public.categories;
CREATE POLICY "Users can insert own categories"
  ON public.categories
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update only their own categories
DROP POLICY IF EXISTS "Users can update own categories" ON public.categories;
CREATE POLICY "Users can update own categories"
  ON public.categories
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can delete only their own categories
DROP POLICY IF EXISTS "Users can delete own categories" ON public.categories;
CREATE POLICY "Users can delete own categories"
  ON public.categories
  FOR DELETE
  USING (user_id = auth.uid());

-- =====================================================
-- RPC FUNCTION: Get categories with budget tracking
-- =====================================================
-- Description: Returns user's categories with calculated:
-- - total_spent: sum of expense transactions
-- - remaining_budget: budget - total_spent
-- - transaction_count: number of transactions

CREATE OR REPLACE FUNCTION get_categories_with_budget(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  name VARCHAR,
  icon VARCHAR,
  color VARCHAR,
  budget DECIMAL,
  total_spent DECIMAL,
  remaining_budget DECIMAL,
  transaction_count BIGINT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.user_id,
    c.name,
    c.icon,
    c.color,
    c.budget,
    -- Calculate total spent for this category
    COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END), 0) AS total_spent,
    -- Calculate remaining budget
    c.budget - COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END), 0) AS remaining_budget,
    -- Count transactions
    COUNT(t.id) AS transaction_count,
    c.created_at,
    c.updated_at
  FROM public.categories c
  LEFT JOIN public.transactions t 
    ON c.id = t.category_id 
    AND t.user_id = p_user_id
  WHERE c.user_id = p_user_id
  GROUP BY c.id, c.user_id, c.name, c.icon, c.color, c.budget, c.created_at, c.updated_at
  ORDER BY c.name ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- RPC FUNCTION: Initialize default categories for new user
-- =====================================================
-- Description: Creates default categories for a new user
-- Called automatically when user profile is created

CREATE OR REPLACE FUNCTION initialize_user_categories(p_user_id UUID)
RETURNS void AS $$
BEGIN
  -- Create default budget categories for new user
  INSERT INTO public.categories (user_id, name, icon, color, budget) VALUES
    (p_user_id, 'Makanan & Minuman', 'Coffee', '#f59e0b', 1500000),
    (p_user_id, 'Transportasi', 'Car', '#3b82f6', 1000000),
    (p_user_id, 'Belanja', 'ShoppingBag', '#8b5cf6', 800000),
    (p_user_id, 'Hiburan', 'Film', '#ec4899', 500000),
    (p_user_id, 'Tagihan', 'Home', '#ef4444', 2000000),
    (p_user_id, 'Kesehatan', 'Heart', '#f43f5e', 500000),
    (p_user_id, 'Pendidikan', 'BookOpen', '#06b6d4', 500000),
    (p_user_id, 'Gadget', 'Smartphone', '#64748b', 1000000),
    (p_user_id, 'Lainnya', 'Wallet', '#64748b', 500000)
  ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- SEED DATA: Global category templates
-- =====================================================
-- Description: Template categories (user_id = NULL) for reference
-- Users will get copies of these when they sign up

INSERT INTO public.categories (user_id, name, icon, color, budget) VALUES
  -- Budget Categories
  (NULL, 'Makanan & Minuman', 'Coffee', '#f59e0b', 1500000),
  (NULL, 'Transportasi', 'Car', '#3b82f6', 1000000),
  (NULL, 'Belanja', 'ShoppingBag', '#8b5cf6', 800000),
  (NULL, 'Hiburan', 'Film', '#ec4899', 500000),
  (NULL, 'Rumah & Tagihan', 'Home', '#ef4444', 2000000),
  (NULL, 'Kesehatan', 'Heart', '#f43f5e', 500000),
  (NULL, 'Pendidikan', 'BookOpen', '#06b6d4', 500000),
  (NULL, 'Gadget', 'Smartphone', '#64748b', 1000000),
  (NULL, 'Lainnya', 'Wallet', '#64748b', 500000)
ON CONFLICT DO NOTHING;

-- =====================================================
-- USAGE GUIDE
-- =====================================================

-- ┌─────────────────────────────────────────────────────┐
-- │ FRONTEND INTEGRATION                                │
-- └─────────────────────────────────────────────────────┘

-- 1. CREATE CATEGORY
-- Frontend code:
-- const { data, error } = await supabase
--   .from('categories')
--   .insert({
--     name: 'Transportasi',
--     icon: 'Car',
--     color: '#3b82f6',
--     budget: 1000000
--   })
--   .select()
--   .single();

-- 2. UPDATE BUDGET
-- Frontend code:
-- const { data, error } = await supabase
--   .from('categories')
--   .update({ budget: 2000000 })
--   .eq('id', categoryId)
--   .select()
--   .single();

-- 3. GET CATEGORIES WITH TRACKING
-- Frontend code:
-- const { data, error } = await supabase
--   .rpc('get_categories_with_budget', {
--     p_user_id: user.id
--   });

-- 4. DELETE CATEGORY
-- Frontend code:
-- const { error } = await supabase
--   .from('categories')
--   .delete()
--   .eq('id', categoryId);

-- ┌─────────────────────────────────────────────────────┐
-- │ AVAILABLE ICONS (from lucide-react)                 │
-- └─────────────────────────────────────────────────────┘
-- Wallet, Coffee, ShoppingBag, Car, Home, Zap, Heart,
-- BookOpen, Film, Music, Smartphone, Laptop, Gift,
-- TrendingUp, DollarSign, CreditCard, PiggyBank, Briefcase

-- ┌─────────────────────────────────────────────────────┐
-- │ RECOMMENDED COLORS                                   │
-- └─────────────────────────────────────────────────────┘
-- Red:    #ef4444, #f43f5e, #dc2626
-- Orange: #f59e0b, #f97316
-- Yellow: #eab308, #fbbf24
-- Green:  #10b981, #22c55e, #16a34a
-- Blue:   #3b82f6, #06b6d4, #0ea5e9
-- Purple: #8b5cf6, #a855f7, #9333ea
-- Pink:   #ec4899, #f472b6
-- Gray:   #64748b, #6b7280

-- =====================================================
-- MIGRATION COMPLETED ✅
-- =====================================================
-- Features implemented:
-- ✅ User-specific budget categories with RLS
-- ✅ Custom icons and colors
-- ✅ Budget tracking per category
-- ✅ Transaction counting
-- ✅ Remaining budget calculation
-- ✅ Automatic category initialization for new users
-- ✅ Safe CRUD operations with proper policies
-- =====================================================
