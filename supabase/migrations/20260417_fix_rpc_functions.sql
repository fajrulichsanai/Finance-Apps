-- Fix RPC functions - ensure clean state

-- Drop ALL variations of get_category_breakdown
DROP FUNCTION IF EXISTS get_category_breakdown CASCADE;

-- Recreate with proper signature
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
$$;

-- Set proper owner
ALTER FUNCTION get_category_breakdown(UUID, TEXT, DATE, DATE) OWNER TO postgres;

-- Add comment
COMMENT ON FUNCTION get_category_breakdown(UUID, TEXT, DATE, DATE) IS 
  'Get category breakdown for income or expenses with total amounts and transaction counts';


-- Drop ALL variations of get_categories_with_budget
DROP FUNCTION IF EXISTS get_categories_with_budget CASCADE;

-- Recreate with proper signature  
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
    c.name,
    c.icon,
    c.color,
    c.type,
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
$$;

-- Set proper owner
ALTER FUNCTION get_categories_with_budget(UUID) OWNER TO postgres;

-- Add comment
COMMENT ON FUNCTION get_categories_with_budget(UUID) IS 
  'Get categories with budget tracking including current month spent and remaining budget';
