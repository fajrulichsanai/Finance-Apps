# Migration Template

Complete boilerplate for creating production-ready SQL migrations.

## Full Template

```sql
-- filename: 00X_feature_name.sql
-- Sequential numbering: 001, 002, 003, etc.

-- PURPOSE:
-- [Brief 1-2 sentence description of what this migration does]
-- Example: Add savings goals feature with target amounts and deadline tracking

-- CHANGES:
-- * Create savings_goals table with user relationship
-- * Add indexes for performance optimization
-- * Enable RLS with secure access policies
-- * Add RPC function for goal progress calculation
-- * Add trigger for automatic updated_at timestamps

-- DEPENDENCIES:
-- * Requires Supabase Auth to be enabled
-- * Requires gen_random_uuid() for U00Xration (PostgreSQL built-in)
-- * [Optional] Depends on migration YYYYMMDD_other_feature.sql

-- ============================================================
-- SQL MIGRATION
-- ============================================================

-- ============================================================
-- 1. CREATE TABLES
-- ============================================================
-- [Description of what this table stores]
-- ============================================================

CREATE TABLE IF NOT EXISTS <table_name> (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign Keys
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Data Columns
  name TEXT NOT NULL,
  description TEXT,
  amount NUMERIC(15, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT <table>_name_check CHECK (char_length(trim(name)) > 0),
  CONSTRAINT <table>_amount_check CHECK (amount >= 0),
  CONSTRAINT <table>_status_check CHECK (status IN ('active', 'completed', 'cancelled')),
  CONSTRAINT <table>_user_name_unique UNIQUE (user_id, name)
);

-- ============================================================
-- 2. CREATE INDEXES
-- ============================================================

-- Index on foreign key (CRITICAL for query performance)
CREATE INDEX IF NOT EXISTS idx_<table>_user_id ON <table_name>(user_id);

-- Index on frequently filtered columns
CREATE INDEX IF NOT EXISTS idx_<table>_status ON <table_name>(status);
CREATE INDEX IF NOT EXISTS idx_<table>_created_at ON <table_name>(created_at);

-- Composite index for common query patterns
-- Example: WHERE user_id = ? AND status = ?
CREATE INDEX IF NOT EXISTS idx_<table>_user_status 
  ON <table_name>(user_id, status);

-- ============================================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE <table_name> ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 4. CREATE RLS POLICIES
-- ============================================================

-- Policy: Users can only access their own data
CREATE POLICY "users_access_own_<table>" 
  ON <table_name>
  FOR ALL 
  USING (auth.uid() = user_id);

-- Alternative: Separate policies for different operations
CREATE POLICY "users_select_own_<table>" 
  ON <table_name>
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "users_insert_own_<table>" 
  ON <table_name>
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_update_own_<table>" 
  ON <table_name>
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_delete_own_<table>" 
  ON <table_name>
  FOR DELETE 
  USING (auth.uid() = user_id);

-- ============================================================
-- 5. CREATE FUNCTIONS (RPC)
-- ============================================================
-- [Description of what this function does]
-- ============================================================

CREATE OR REPLACE FUNCTION get_<feature>_stats(p_user_id UUID)
RETURNS TABLE (
  total_count BIGINT,
  total_amount NUMERIC,
  active_count BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Security check: only allow users to query their own data
  IF auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT AS total_count,
    COALESCE(SUM(amount), 0) AS total_amount,
    COUNT(*) FILTER (WHERE status = 'active')::BIGINT AS active_count
  FROM <table_name>
  WHERE user_id = p_user_id;
END;
$$;

-- ============================================================
-- 6. CREATE TRIGGERS
-- ============================================================

-- Trigger: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_<table>_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_<table>_updated_at
  BEFORE UPDATE ON <table_name>
  FOR EACH ROW
  EXECUTE FUNCTION update_<table>_updated_at();

-- ============================================================
-- 7. ADD COMMENTS (Documentation)
-- ============================================================

COMMENT ON TABLE <table_name> IS 'Stores [description of data]. Used for [feature purpose].';
COMMENT ON COLUMN <table_name>.user_id IS 'References the owner of this record';
COMMENT ON COLUMN <table_name>.amount IS 'Stored in smallest currency unit (e.g., cents)';
COMMENT ON COLUMN <table_name>.status IS 'Record status: active, completed, or cancelled';

-- ============================================================
-- END OF MIGRATION
-- ============================================================
```

## Quick Copy: Minimal Table

For simple user-scoped data tables:

```sql
-- filename: 00X_add_<feature>.sql

CREATE TABLE IF NOT EXISTS <table_name> (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT <table>_name_check CHECK (char_length(trim(name)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_<table>_user_id ON <table_name>(user_id);

ALTER TABLE <table_name> ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_access_own_<table>" 
  ON <table_name>
  FOR ALL 
  USING (auth.uid() = user_id);

COMMENT ON TABLE <table_name> IS '[Brief description]';
```

## Common Data Types Reference

| Use Case | PostgreSQL Type | Example |
|----------|----------------|---------|
| Unique ID | `UUID` | `id UUID PRIMARY KEY DEFAULT gen_random_uuid()` |
| Money/Currency | `NUMERIC(15, 2)` | `amount NUMERIC(15, 2) NOT NULL` |
| Short Text | `TEXT` | `name TEXT NOT NULL` |
| Long Text | `TEXT` | `description TEXT` |
| Date Only | `DATE` | `deadline DATE NOT NULL` |
| Date + Time | `TIMESTAMPTZ` | `created_at TIMESTAMPTZ DEFAULT NOW()` |
| Boolean | `BOOLEAN` | `is_active BOOLEAN DEFAULT true` |
| Enum (via constraint) | `TEXT + CHECK` | `status TEXT CHECK (status IN ('active', 'done'))` |
| JSON Data | `JSONB` | `metadata JSONB DEFAULT '{}'::jsonb` |
| Integer | `BIGINT` | `count BIGINT DEFAULT 0` |
| Percentage | `NUMERIC(5, 2)` | `percentage NUMERIC(5, 2) CHECK (percentage >= 0 AND percentage <= 100)` |

## Validation Patterns

```sql
-- Non-empty text
CONSTRAINT check_name CHECK (char_length(trim(name)) > 0)

-- Positive numbers
CONSTRAINT check_amount CHECK (amount > 0)

-- Non-negative numbers  
CONSTRAINT check_balance CHECK (balance >= 0)

-- Enum values
CONSTRAINT check_type CHECK (type IN ('income', 'expense'))

-- Date range
CONSTRAINT check_dates CHECK (end_date >= start_date)

-- Percentage (0-100)
CONSTRAINT check_percentage CHECK (percentage >= 0 AND percentage <= 100)

-- Unique per user
CONSTRAINT unique_user_name UNIQUE (user_id, name)
```

## Index Patterns

```sql
-- Single column (foreign key)
CREATE INDEX idx_<table>_user_id ON <table>(user_id);

-- Single column (frequently filtered)
CREATE INDEX idx_<table>_status ON <table>(status);

-- Composite (multi-column queries)
CREATE INDEX idx_<table>_user_status ON <table>(user_id, status);

-- Date range queries
CREATE INDEX idx_<table>_date ON <table>(created_at);

-- Partial index (filtered)
CREATE INDEX idx_<table>_active ON <table>(user_id) WHERE status = 'active';
```

## RLS Policy Patterns

### Basic: Users access only their own data
```sql
CREATE POLICY "users_own_data" ON <table>
  FOR ALL USING (auth.uid() = user_id);
```

### Template + User Data: Show shared templates and user-specific
```sql
CREATE POLICY "users_see_templates_and_own" ON <table>
  FOR SELECT USING (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "users_modify_own_only" ON <table>
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### Admin Override: Admins can access all data
```sql
CREATE POLICY "admin_all_access" ON <table>
  FOR ALL USING (
    auth.uid() = user_id 
    OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );
```

### Public Read, Authenticated Write
```sql
CREATE POLICY "public_read" ON <table>
  FOR SELECT USING (true);

CREATE POLICY "authenticated_write" ON <table>
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```
