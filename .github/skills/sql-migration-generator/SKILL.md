---
name: sql-migration-generator
description: 'Generate SQL migration files for database schema changes. Use when creating tables, adding RLS policies, creating indexes, modifying database schema, or implementing security policies for Supabase PostgreSQL.'
argument-hint: 'Describe the database feature or schema change needed'
---

# SQL Migration Generator

Generate production-ready SQL migration files following Supabase best practices with proper security, indexing, and documentation.

## When to Use

- Creating new database tables
- Modifying existing schema (columns, constraints)
- Adding indexes for query optimization
- Implementing Row Level Security (RLS) policies
- Creating database functions (RPC)
- Setting up triggers or constraints
- Adding database comments/documentation

## Procedure

### 1. Analyze Requirements

First, understand what the feature needs:
- What data entities are involved?
- What relationships exist between tables?
- Who can access this data? (security model)
- What queries will run frequently? (for indexing)

### 2. Generate Migration File

Create file in `/supabase/migrations/`:

**Naming Convention:** `00X_feature_name.sql` (sequential numbering)

Example: `004_add_savings_goals.sql`, `005_add_recurring_transactions.sql`

**To find next number:**
```bash
ls supabase/migrations/ | tail -1
# If last file is 003_*, use 004_
```

### 3. Migration Structure

Follow this order (see [template](./references/migration-template.md) for full example):

```sql
-- filename: 00X_feature_name.sql

-- PURPOSE:
-- Brief description of what this migration accomplishes

-- CHANGES:
-- * Bullet list of all changes

-- DEPENDENCIES:
-- * Required extensions, functions, or prior migrations

-- ============================================================
-- SQL MIGRATION
-- ============================================================

-- 1. CREATE TABLES
-- 2. CREATE INDEXES
-- 3. ENABLE RLS
-- 4. CREATE RLS POLICIES
-- 5. CREATE FUNCTIONS (if needed)
-- 6. CREATE TRIGGERS (if needed)
-- 7. ADD COMMENTS
```

**After generating, the skill will automatically:**
1. Create the migration file in `/supabase/migrations/`
2. Run `supabase db push` to apply it
3. Confirm successful application

### 4. Required Elements

**Every table MUST have:**
- ✅ UUID primary key with `DEFAULT gen_random_uuid()`
- ✅ `user_id` foreign key to `auth.users(id) ON DELETE CASCADE`
- ✅ `created_at TIMESTAMPTZ DEFAULT NOW()`
- ✅ `updated_at TIMESTAMPTZ DEFAULT NOW()`
- ✅ Appropriate constraints (CHECK, NOT NULL, UNIQUE)
- ✅ Indexes on foreign keys and frequently queried columns
- ✅ RLS enabled: `ALTER TABLE <table> ENABLE ROW LEVEL SECURITY;`
- ✅ RLS policy: typically `CREATE POLICY "users_access_own_data" ON <table> FOR ALL USING (auth.uid() = user_id);`

**Every migration MUST include:**
- ✅ `IF NOT EXISTS` clauses to make it idempotent
- ✅ Descriptive comments explaining purpose
- ✅ Proper data types (NUMERIC for money, TIMESTAMPTZ for dates)
- ✅ Data validation (CHECK constraints)

### 5. Security Checklist

- [ ] RLS enabled on all user-facing tables
- [ ] Policies restrict access to user's own data (`auth.uid() = user_id`)
- [ ] No `SELECT *` in RPC functions
- [ ] Foreign key constraints prevent orphaned records
- [ ] Sensitive columns use appropriate types (no plain text passwords)

### 6. Performance Checklist

- [ ] Indexes on all foreign keys
- [ ] Indexes on frequently filtered columns (e.g., `user_id`, `created_at`)
**Automatically apply after generating:**
```bash
supabase db push
```

This will:
- Apply the migration to your Supabase database
- Update the migration history
- Validate SQL syntax before applying

**Manual application (if needed):**
```bash
psql -U postgres -d your_db -f supabase/migrations/00X
supabase db push
```

For local development:
```bash
psql -U postgres -d your_db -f supabase/migrations/YYYYMMDD_feature_name.sql
```

## Common Patterns

### User-Scoped Data Table
```sql
CREATE TABLE IF NOT EXISTS <table_name> (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- your columns here
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_<table>_user_id ON <table_name>(user_id);
ALTER TABLE <table_name> ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_access_own_<table>" ON <table_name> 
  FOR ALL USING (auth.uid() = user_id);
```

### Template Data (Shared + User-Specific)
```sql
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- nullable
  -- your columns here
);

-- Policy: users see templates (user_id IS NULL) + their own
CREATE POLICY "users_access_categories" ON categories 
  FOR SELECT USING (user_id IS NULL OR auth.uid() = user_id);
```

### Relation Table with Stats
```sql
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_category_id ON transactions(category_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
```

## Anti-Patterns

❌ **DO NOT:**
- Use `SERIAL` or `INT` for primary keys → Use `UUID`
- Forget `ON DELETE CASCADE` on user_id → Orphaned data on user deletion
- Use `TEXT` for amounts → Use `NUMERIC(15, 2)`
- Skip RLS → Security vulnerability
- Create tables without indexes → Slow queries
- Use generic names (`data`, `items`) → Use descriptive names
- Skip comments → Hard to maintain
- Use `SELECT *` in functions → Wasteful queries
- Forget `IF NOT EXISTS` → Migration fails on re-run

## Resources

- [Migration Template](./references/migration-template.md) - Full boilerplate with all sections
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html)

## Cost Optimization (Free Tier)

- Index only frequently queried columns
- Use `LIMIT` in RPC functions
- Avoid triggers with complex logic (use application layer)
- Keep migration files focused (one feature per file)
- Test migrations locally before pushing
