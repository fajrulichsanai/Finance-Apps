-- filename: 20260420_fix_rpc_type_mismatch.sql

-- PURPOSE:
-- Fix RPC function return type mismatches (VARCHAR vs TEXT)
-- Caused by: CHECK constraints and COALESCE operations causing PostgreSQL
-- to infer VARCHAR instead of TEXT in return types

-- CHANGES:
-- * Fix get_category_breakdown: Cast all TEXT columns to ::TEXT
-- * Fix get_categories_with_budget: Cast all TEXT columns to ::TEXT
-- * Add proper error handling for empty results

-- IMPACT:
-- * Resolves "structure of query does not match function result type" errors
-- * Ensures clean type matching between RETURNS TABLE and SELECT

-- ============================================================
-- SQL MIGRATION
-- ============================================================

-- ============================================================
-- 1. FIX: get_category_breakdown
-- ============================================================

DROP FUNCTION IF EXISTS get_category_breakdown(UUID, TEXT, DATE, DATE) CASCADE;

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
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(c.name, 'Uncategorized')::TEXT AS category_name,
    COALESCE(c.icon, 'Wallet')::TEXT AS category_icon,
    COALESCE(c.color, '#6b7280')::TEXT AS category_color,
    COALESCE(SUM(t.amount), 0)::NUMERIC AS total_amount,
    COUNT(t.id)::BIGINT AS transaction_count
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
  
  -- Handle empty result set explicitly
  IF NOT FOUND THEN
    RAISE NOTICE 'No transactions found for user % with type %', p_user_id, p_type;
  END IF;
END;
$$;

ALTER FUNCTION get_category_breakdown(UUID, TEXT, DATE, DATE) OWNER TO postgres;

COMMENT ON FUNCTION get_category_breakdown(UUID, TEXT, DATE, DATE) IS 
  'Get category breakdown for income or expenses with total amounts and transaction counts. Fixed: explicit TEXT casting to prevent VARCHAR mismatch.';


-- ============================================================
-- 2. FIX: get_categories_with_budget
-- ============================================================

DROP FUNCTION IF EXISTS get_categories_with_budget(UUID) CASCADE;

CREATE OR REPLACE FUNCTION get_categories_with_budget(
  p_user_id UUID
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  name TEXT,
  icon TEXT,
  color TEXT,
  type TEXT,
  budget NUMERIC,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  total_spent NUMERIC,
  remaining_budget NUMERIC,
  transaction_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.user_id,
    c.name::TEXT,
    c.icon::TEXT,
    c.color::TEXT,
    c.type::TEXT,
    c.budget::NUMERIC,
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
    END)::BIGINT AS transaction_count
  FROM categories c
  LEFT JOIN transactions t ON c.id = t.category_id AND t.user_id = p_user_id
  WHERE c.user_id = p_user_id OR c.user_id IS NULL
  GROUP BY c.id, c.name, c.icon, c.color, c.type, c.budget, c.created_at, c.updated_at
  ORDER BY c.name;
  
  -- Handle empty result set explicitly
  IF NOT FOUND THEN
    RAISE NOTICE 'No categories found for user %', p_user_id;
  END IF;
END;
$$;

ALTER FUNCTION get_categories_with_budget(UUID) OWNER TO postgres;

COMMENT ON FUNCTION get_categories_with_budget(UUID) IS 
  'Get categories with budget tracking including current month spent and remaining budget. Fixed: explicit TEXT casting to prevent VARCHAR mismatch.';
