-- Add type field to categories table to differentiate income vs expense categories

-- Add type column
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'expense'
CHECK (type IN ('income', 'expense'));

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_categories_type ON categories(type);

-- Update existing template categories to set correct type
UPDATE categories 
SET type = 'income' 
WHERE user_id IS NULL 
  AND name IN ('Salary', 'Investment', 'Other Income', 'Gaji', 'Investasi', 'Pendapatan Lain');

-- Comment
COMMENT ON COLUMN categories.type IS 'Category type: income or expense';

-- Verify update
SELECT name, type FROM categories WHERE user_id IS NULL ORDER BY type, name;
