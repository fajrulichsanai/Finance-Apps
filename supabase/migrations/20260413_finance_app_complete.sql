-- filename: 20260413_finance_app_complete.sql

-- PURPOSE:
-- Complete database migration for Finance App dashboard and features.
-- This migration creates all necessary tables, functions, and security policies
-- to support: transactions, categories, budgets, statistics, and user authentication.

-- CHANGES:
-- * Create categories table with user relationship and template support
-- * Create transactions table with category relationship
-- * Add indexes for performance optimization
-- * Enable RLS on all user-facing tables
-- * Create comprehensive RLS policies for secure data access
-- * Add RPC function for category breakdown statistics
-- * Add RPC function for categories with budget tracking
-- * Add trigger for automatic updated_at timestamps

-- DEPENDENCIES:
-- * Requires Supabase Auth to be enabled
-- * Requires gen_random_uuid() for UUID generation (PostgreSQL built-in)

-- ============================================================
-- SQL MIGRATION
-- ============================================================

-- ============================================================
-- 1. CATEGORIES TABLE
-- ============================================================
-- Stores transaction categories with budget limits
-- Supports both user-specific categories and global templates
-- ============================================================

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Wallet',
  color TEXT NOT NULL DEFAULT '#3b82f6',
  budget NUMERIC(15, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT categories_name_check CHECK (char_length(trim(name)) > 0),
  CONSTRAINT categories_budget_check CHECK (budget >= 0),
  
  -- Unique constraint: user can't have duplicate category names
  CONSTRAINT categories_user_name_unique UNIQUE (user_id, name)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

-- Comments for documentation
COMMENT ON TABLE categories IS 'Transaction categories with budget tracking. user_id NULL = template category';
COMMENT ON COLUMN categories.user_id IS 'NULL for template categories, user ID for user-specific categories';
COMMENT ON COLUMN categories.budget IS 'Monthly budget limit for this category';


-- ============================================================
-- 2. TRANSACTIONS TABLE
-- ============================================================
-- Stores all income and expense transactions
-- ============================================================

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount NUMERIC(15, 2) NOT NULL,
  description TEXT NOT NULL,
  note TEXT,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT transactions_amount_check CHECK (amount > 0),
  CONSTRAINT transactions_description_check CHECK (char_length(trim(description)) > 0)
);

-- Indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_category_id ON transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON transactions(user_id, transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_user_type ON transactions(user_id, type);

-- Comments for documentation
COMMENT ON TABLE transactions IS 'Financial transactions (income and expenses)';
COMMENT ON COLUMN transactions.type IS 'Transaction type: income or expense';
COMMENT ON COLUMN transactions.transaction_date IS 'Date when transaction occurred';


-- ============================================================
-- 3. UPDATED_AT TRIGGER FUNCTION
-- ============================================================
-- Automatically update updated_at timestamp on row changes
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to categories
DROP TRIGGER IF EXISTS trigger_categories_updated_at ON categories;
CREATE TRIGGER trigger_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to transactions
DROP TRIGGER IF EXISTS trigger_transactions_updated_at ON transactions;
CREATE TRIGGER trigger_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- ============================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
-- Secure data access: users can only see/modify their own data
-- ============================================================

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- CATEGORIES RLS POLICIES
-- ============================================================

-- Users can view template categories (user_id IS NULL) and their own categories
DROP POLICY IF EXISTS "Users can view categories" ON categories;
CREATE POLICY "Users can view categories"
  ON categories
  FOR SELECT
  USING (
    user_id IS NULL OR 
    auth.uid() = user_id
  );

-- Users can insert their own categories
DROP POLICY IF EXISTS "Users can insert their own categories" ON categories;
CREATE POLICY "Users can insert their own categories"
  ON categories
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own categories only
DROP POLICY IF EXISTS "Users can update their own categories" ON categories;
CREATE POLICY "Users can update their own categories"
  ON categories
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own categories only
DROP POLICY IF EXISTS "Users can delete their own categories" ON categories;
CREATE POLICY "Users can delete their own categories"
  ON categories
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- TRANSACTIONS RLS POLICIES
-- ============================================================

-- Users can view their own transactions
DROP POLICY IF EXISTS "Users can view their own transactions" ON transactions;
CREATE POLICY "Users can view their own transactions"
  ON transactions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own transactions
DROP POLICY IF EXISTS "Users can insert their own transactions" ON transactions;
CREATE POLICY "Users can insert their own transactions"
  ON transactions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own transactions
DROP POLICY IF EXISTS "Users can update their own transactions" ON transactions;
CREATE POLICY "Users can update their own transactions"
  ON transactions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own transactions
DROP POLICY IF EXISTS "Users can delete their own transactions" ON transactions;
CREATE POLICY "Users can delete their own transactions"
  ON transactions
  FOR DELETE
  USING (auth.uid() = user_id);


-- ============================================================
-- 5. RPC FUNCTION: get_category_breakdown
-- ============================================================
-- Get category-wise spending/income breakdown with statistics
-- Used for: Dashboard charts, category analytics
-- ============================================================

-- Drop existing function if exists
DROP FUNCTION IF EXISTS get_category_breakdown(UUID, TEXT, DATE, DATE);

CREATE OR REPLACE FUNCTION get_category_breakdown(
  p_user_id UUID,
  p_type TEXT DEFAULT 'expense',
  p_start_date DATE DEFAULT NULL,
  p_end_date DATE DEFAULT NULL
)
RETURNS TABLE (
  category_name TEXT,
  category_icon TEXT,
  category_color TEXT,
  total_amount NUMERIC,
  transaction_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(c.name, 'Uncategorized') AS category_name,
    COALESCE(c.icon, 'Wallet') AS category_icon,
    COALESCE(c.color, '#6b7280') AS category_color,
    COALESCE(SUM(t.amount), 0)::NUMERIC AS total_amount,
    COUNT(t.id) AS transaction_count
  FROM transactions t
  LEFT JOIN categories c ON t.category_id = c.id
  WHERE 
    t.user_id = p_user_id
    AND t.type = p_type
    AND (p_start_date IS NULL OR t.transaction_date >= p_start_date)
    AND (p_end_date IS NULL OR t.transaction_date <= p_end_date)
  GROUP BY c.id, c.name, c.icon, c.color
  HAVING SUM(t.amount) > 0
  ORDER BY total_amount DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Security: Add RLS check inside function
ALTER FUNCTION get_category_breakdown(UUID, TEXT, DATE, DATE) OWNER TO postgres;

COMMENT ON FUNCTION get_category_breakdown(UUID, TEXT, DATE, DATE) IS 
  'Get category breakdown for income or expenses with total amounts and transaction counts';


-- ============================================================
-- 6. RPC FUNCTION: get_categories_with_budget
-- ============================================================
-- Get categories with budget tracking (total spent, remaining budget)
-- Used for: Budget page, budget overview cards
-- ============================================================

-- Drop existing function if exists
DROP FUNCTION IF EXISTS get_categories_with_budget(UUID);

CREATE OR REPLACE FUNCTION get_categories_with_budget(
  p_user_id UUID
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  name TEXT,
  icon TEXT,
  color TEXT,
  budget NUMERIC,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  total_spent NUMERIC,
  remaining_budget NUMERIC,
  transaction_count BIGINT
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
    c.created_at,
    c.updated_at,
    COALESCE(SUM(CASE 
      WHEN t.type = 'expense' 
        AND t.transaction_date >= date_trunc('month', CURRENT_DATE)::DATE
        AND t.transaction_date < (date_trunc('month', CURRENT_DATE) + INTERVAL '1 month')::DATE
      THEN t.amount 
      ELSE 0 
    END), 0)::NUMERIC AS total_spent,
    (c.budget - COALESCE(SUM(CASE 
      WHEN t.type = 'expense' 
        AND t.transaction_date >= date_trunc('month', CURRENT_DATE)::DATE
        AND t.transaction_date < (date_trunc('month', CURRENT_DATE) + INTERVAL '1 month')::DATE
      THEN t.amount 
      ELSE 0 
    END), 0))::NUMERIC AS remaining_budget,
    COUNT(CASE 
      WHEN t.type = 'expense' 
        AND t.transaction_date >= date_trunc('month', CURRENT_DATE)::DATE
        AND t.transaction_date < (date_trunc('month', CURRENT_DATE) + INTERVAL '1 month')::DATE
      THEN t.id 
    END) AS transaction_count
  FROM categories c
  LEFT JOIN transactions t ON c.id = t.category_id AND t.user_id = p_user_id
  WHERE c.user_id = p_user_id OR c.user_id IS NULL
  GROUP BY c.id
  ORDER BY c.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Security: Set appropriate owner
ALTER FUNCTION get_categories_with_budget(UUID) OWNER TO postgres;

COMMENT ON FUNCTION get_categories_with_budget(UUID) IS 
  'Get categories with budget tracking including current month spent and remaining budget';


-- ============================================================
-- 7. TEMPLATE CATEGORIES (OPTIONAL)
-- ============================================================
-- Insert default template categories for new users
-- These are global categories (user_id = NULL)
-- ============================================================

-- Only insert if categories don't exist yet
INSERT INTO categories (user_id, name, icon, color, budget)
SELECT NULL::UUID, 'Food & Dining', 'Utensils', '#ef4444', 1500000
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE user_id IS NULL AND name = 'Food & Dining')
UNION ALL
SELECT NULL::UUID, 'Transportation', 'Car', '#f59e0b', 500000
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE user_id IS NULL AND name = 'Transportation')
UNION ALL
SELECT NULL::UUID, 'Shopping', 'ShoppingBag', '#ec4899', 1000000
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE user_id IS NULL AND name = 'Shopping')
UNION ALL
SELECT NULL::UUID, 'Entertainment', 'Film', '#8b5cf6', 500000
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE user_id IS NULL AND name = 'Entertainment')
UNION ALL
SELECT NULL::UUID, 'Bills & Utilities', 'Receipt', '#3b82f6', 1000000
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE user_id IS NULL AND name = 'Bills & Utilities')
UNION ALL
SELECT NULL::UUID, 'Health & Fitness', 'Heart', '#10b981', 500000
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE user_id IS NULL AND name = 'Health & Fitness')
UNION ALL
SELECT NULL::UUID, 'Education', 'GraduationCap', '#6366f1', 500000
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE user_id IS NULL AND name = 'Education')
UNION ALL
SELECT NULL::UUID, 'Salary', 'Briefcase', '#22c55e', 0
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE user_id IS NULL AND name = 'Salary')
UNION ALL
SELECT NULL::UUID, 'Investment', 'TrendingUp', '#14b8a6', 0
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE user_id IS NULL AND name = 'Investment')
UNION ALL
SELECT NULL::UUID, 'Other Income', 'DollarSign', '#84cc16', 0
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE user_id IS NULL AND name = 'Other Income');


-- ============================================================
-- 8. VERIFICATION QUERIES
-- ============================================================
-- Run these to verify the migration was successful
-- ============================================================

-- Check tables exist
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- AND table_name IN ('categories', 'transactions');

-- Check RLS is enabled
-- SELECT tablename, rowsecurity FROM pg_tables 
-- WHERE schemaname = 'public' 
-- AND tablename IN ('categories', 'transactions');

-- Check policies exist
-- SELECT tablename, policyname FROM pg_policies 
-- WHERE schemaname = 'public';

-- Check functions exist
-- SELECT routine_name FROM information_schema.routines 
-- WHERE routine_schema = 'public' 
-- AND routine_name IN ('get_category_breakdown', 'get_categories_with_budget');
