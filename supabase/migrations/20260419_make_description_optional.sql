-- filename: 20260419_make_description_optional.sql

-- PURPOSE:
-- Make description field optional for transactions to support simpler data entry
-- Description was previously required, now can be empty string or NULL

-- CHANGES:
-- * Drop the NOT NULL constraint on description field
-- * Drop the check constraint that required non-empty description
-- * Add new check that allows empty string but not just whitespace if provided

-- DEPENDENCIES:
-- * Requires transactions table to exist (from 20260413_finance_app_complete.sql)

-- ============================================================
-- SQL MIGRATION
-- ============================================================

-- Drop existing constraints on description
ALTER TABLE transactions 
  ALTER COLUMN description DROP NOT NULL;

-- Drop old check constraint if exists
ALTER TABLE transactions 
  DROP CONSTRAINT IF EXISTS transactions_description_check;

-- Add new check: if description is provided and not empty, it must not be just whitespace
ALTER TABLE transactions 
  ADD CONSTRAINT transactions_description_check 
  CHECK (
    description IS NULL 
    OR trim(description) = '' 
    OR char_length(trim(description)) > 0
  );

-- Comment
COMMENT ON COLUMN transactions.description IS 'Optional transaction description. Can be empty, NULL, or meaningful text.';
