-- =====================================================
-- FINANCE APP - DATABASE MIGRATION
-- =====================================================
-- Description: Complete database schema for expense tracker
-- Author: Finance App Team
-- Date: 2026-04-05
-- =====================================================

-- =====================================================
-- TABLE: categories
-- Description: Store transaction categories (income/expense)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
  icon VARCHAR(50),
  color VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(name, type)
);

-- Index for faster queries
CREATE INDEX idx_categories_type ON public.categories(type);

-- =====================================================
-- TABLE: transactions
-- Description: Store all financial transactions
-- =====================================================
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
  amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  description VARCHAR(255),
  note TEXT,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_category_id ON public.transactions(category_id);
CREATE INDEX idx_transactions_date ON public.transactions(transaction_date DESC);
CREATE INDEX idx_transactions_user_date ON public.transactions(user_id, transaction_date DESC);
CREATE INDEX idx_transactions_type ON public.transactions(type);

-- =====================================================
-- TABLE: user_profiles
-- Description: Extended user information
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(255),
  avatar_url TEXT,
  currency VARCHAR(10) DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- FUNCTIONS: Auto update timestamp
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for auto-updating updated_at
CREATE TRIGGER update_categories_updated_at 
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at 
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES: categories (public read, admin write)
-- =====================================================
-- Everyone can read categories
CREATE POLICY "Categories are viewable by everyone"
  ON public.categories
  FOR SELECT
  USING (true);

-- Only authenticated users can insert categories (for future admin feature)
CREATE POLICY "Authenticated users can insert categories"
  ON public.categories
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- =====================================================
-- RLS POLICIES: transactions
-- =====================================================
-- Users can only see their own transactions
CREATE POLICY "Users can view own transactions"
  ON public.transactions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own transactions
CREATE POLICY "Users can insert own transactions"
  ON public.transactions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own transactions
CREATE POLICY "Users can update own transactions"
  ON public.transactions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own transactions
CREATE POLICY "Users can delete own transactions"
  ON public.transactions
  FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- RLS POLICIES: user_profiles
-- =====================================================
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON public.user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- SEED DATA: Default Categories
-- =====================================================
INSERT INTO public.categories (name, type, icon, color) VALUES
  -- Income Categories
  ('Salary', 'income', 'Zap', '#10b981'),
  ('Freelance', 'income', 'Briefcase', '#3b82f6'),
  ('Investment', 'income', 'TrendingUp', '#8b5cf6'),
  ('Gift', 'income', 'Gift', '#ec4899'),
  ('Other Income', 'income', 'DollarSign', '#6366f1'),
  
  -- Expense Categories
  ('Food & Drink', 'expense', 'Coffee', '#f59e0b'),
  ('Transport', 'expense', 'Car', '#3b82f6'),
  ('Shopping', 'expense', 'ShoppingBag', '#8b5cf6'),
  ('Entertainment', 'expense', 'Film', '#ec4899'),
  ('Housing', 'expense', 'Home', '#ef4444'),
  ('Utilities', 'expense', 'Zap', '#eab308'),
  ('Healthcare', 'expense', 'Heart', '#f43f5e'),
  ('Education', 'expense', 'BookOpen', '#06b6d4'),
  ('Other Expense', 'expense', 'MoreHorizontal', '#64748b')
ON CONFLICT (name, type) DO NOTHING;

-- =====================================================
-- HELPFUL VIEWS
-- =====================================================

-- View: Transaction with category details
CREATE OR REPLACE VIEW public.transaction_details AS
SELECT 
  t.id,
  t.user_id,
  t.type,
  t.amount,
  t.description,
  t.note,
  t.transaction_date,
  t.created_at,
  c.name AS category_name,
  c.icon AS category_icon,
  c.color AS category_color
FROM public.transactions t
LEFT JOIN public.categories c ON t.category_id = c.id;

-- =====================================================
-- STORAGE BUCKETS (Optional - for receipts/attachments)
-- =====================================================
-- Run this in Supabase dashboard if you want to store receipts
-- INSERT INTO storage.buckets (id, name, public) VALUES ('receipts', 'receipts', false);

-- =====================================================
-- FUNCTIONS: Statistics Helpers
-- =====================================================

-- Function: Get monthly summary for a user
CREATE OR REPLACE FUNCTION get_monthly_summary(
  p_user_id UUID,
  p_months INTEGER DEFAULT 6
)
RETURNS TABLE (
  month TEXT,
  total_income DECIMAL,
  total_expense DECIMAL,
  balance DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    TO_CHAR(DATE_TRUNC('month', transaction_date), 'Mon') AS month,
    COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS total_income,
    COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expense,
    COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) AS balance
  FROM public.transactions
  WHERE user_id = p_user_id
    AND transaction_date >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month' * (p_months - 1)
  GROUP BY DATE_TRUNC('month', transaction_date)
  ORDER BY DATE_TRUNC('month', transaction_date) DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get category breakdown for a user
CREATE OR REPLACE FUNCTION get_category_breakdown(
  p_user_id UUID,
  p_type VARCHAR DEFAULT 'expense',
  p_start_date DATE DEFAULT NULL,
  p_end_date DATE DEFAULT NULL
)
RETURNS TABLE (
  category_name VARCHAR,
  category_icon VARCHAR,
  category_color VARCHAR,
  total_amount DECIMAL,
  transaction_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.name AS category_name,
    c.icon AS category_icon,
    c.color AS category_color,
    COALESCE(SUM(t.amount), 0) AS total_amount,
    COUNT(t.id) AS transaction_count
  FROM public.categories c
  LEFT JOIN public.transactions t 
    ON c.id = t.category_id 
    AND t.user_id = p_user_id
    AND t.type = p_type
    AND (p_start_date IS NULL OR t.transaction_date >= p_start_date)
    AND (p_end_date IS NULL OR t.transaction_date <= p_end_date)
  WHERE c.type = p_type
  GROUP BY c.id, c.name, c.icon, c.color
  HAVING COUNT(t.id) > 0
  ORDER BY total_amount DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- MIGRATION COMPLETED
-- =====================================================
-- To run this migration:
-- 1. Copy this entire SQL file
-- 2. Go to Supabase Dashboard > SQL Editor
-- 3. Paste and run
-- 4. Verify tables are created in Table Editor
-- =====================================================

-- =====================================================
-- v2: BUDGET PER KATEGORI (DOMPET)
-- =====================================================
-- Description: Mengubah categories menjadi per-user wallet dengan budget
-- Author: Finance App Team
-- Date: 2026-04-05
-- =====================================================

-- Step 1: Backup existing categories (optional, for safety)
-- CREATE TABLE IF NOT EXISTS public.categories_backup AS SELECT * FROM public.categories;

-- Step 2: Drop existing policies and constraints
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
DROP POLICY IF EXISTS "Authenticated users can insert categories" ON public.categories;

-- Step 3: Drop unique constraint (karena sekarang per-user)
ALTER TABLE public.categories DROP CONSTRAINT IF EXISTS categories_name_type_key;

-- Step 4: Add new columns to categories
ALTER TABLE public.categories 
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS budget DECIMAL(12, 2) DEFAULT 0 CHECK (budget >= 0);

-- Step 5: Create index for user_id
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON public.categories(user_id);

-- Step 6: Update existing categories to be global (NULL user_id) or assign to a specific user
-- For migration: keep existing categories as global templates (user_id = NULL)
-- Users will create their own categories based on these templates

-- Step 7: Create new RLS policies for per-user categories
-- Users can view their own categories + global templates
CREATE POLICY "Users can view own categories and templates"
  ON public.categories
  FOR SELECT
  USING (user_id = auth.uid() OR user_id IS NULL);

-- Users can insert their own categories
CREATE POLICY "Users can insert own categories"
  ON public.categories
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own categories
CREATE POLICY "Users can update own categories"
  ON public.categories
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own categories
CREATE POLICY "Users can delete own categories"
  ON public.categories
  FOR DELETE
  USING (user_id = auth.uid());

-- Step 8: Create function to get categories with budget tracking
CREATE OR REPLACE FUNCTION get_categories_with_budget(
  p_user_id UUID,
  p_type VARCHAR DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  name VARCHAR,
  type VARCHAR,
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
    c.type,
    c.icon,
    c.color,
    c.budget,
    COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END), 0) AS total_spent,
    c.budget - COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END), 0) AS remaining_budget,
    COUNT(t.id) AS transaction_count,
    c.created_at,
    c.updated_at
  FROM public.categories c
  LEFT JOIN public.transactions t 
    ON c.id = t.category_id 
    AND t.user_id = p_user_id
  WHERE c.user_id = p_user_id
    AND (p_type IS NULL OR c.type = p_type)
  GROUP BY c.id, c.user_id, c.name, c.type, c.icon, c.color, c.budget, c.created_at, c.updated_at
  ORDER BY c.name ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 9: Create function to initialize default categories for new user
CREATE OR REPLACE FUNCTION initialize_user_categories(p_user_id UUID)
RETURNS void AS $$
BEGIN
  -- Copy global template categories to user's personal categories
  INSERT INTO public.categories (user_id, name, type, icon, color, budget)
  SELECT 
    p_user_id,
    name,
    type,
    icon,
    color,
    CASE 
      WHEN type = 'expense' THEN 1000000.00  -- Default budget 1 juta untuk expense
      ELSE 0                                  -- Income tidak perlu budget
    END as budget
  FROM public.categories
  WHERE user_id IS NULL
  ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 10: Create trigger to auto-initialize categories for new users
CREATE OR REPLACE FUNCTION auto_initialize_categories()
RETURNS TRIGGER AS $$
BEGIN
  -- Initialize categories when new user profile is created
  PERFORM initialize_user_categories(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS trigger_auto_initialize_categories ON public.user_profiles;

-- Create trigger
CREATE TRIGGER trigger_auto_initialize_categories
  AFTER INSERT ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION auto_initialize_categories();

-- Step 11: Update transaction_details view to include budget info
DROP VIEW IF EXISTS public.transaction_details;

CREATE OR REPLACE VIEW public.transaction_details AS
SELECT 
  t.id,
  t.user_id,
  t.type,
  t.amount,
  t.description,
  t.note,
  t.transaction_date,
  t.created_at,
  c.name AS category_name,
  c.icon AS category_icon,
  c.color AS category_color,
  c.budget AS category_budget
FROM public.transactions t
LEFT JOIN public.categories c ON t.category_id = c.id;

-- =====================================================
-- v2 MIGRATION COMPLETED
-- =====================================================
-- Summary of changes:
-- 1. Added user_id and budget columns to categories
-- 2. Updated RLS policies for per-user categories
-- 3. Created function to get categories with budget tracking
-- 4. Created function to initialize default categories for new users
-- 5. Created trigger to auto-initialize categories
-- 6. Updated transaction_details view
-- =====================================================
