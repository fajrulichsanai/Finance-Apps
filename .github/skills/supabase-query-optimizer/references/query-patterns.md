# Query Pattern Templates

## Basic CRUD Operations

### Read Single Record
```typescript
const { data, error } = await supabase
  .from('table_name')
  .select('id, field1, field2')
  .eq('id', recordId)
  .single();
```

### Read List (Paginated)
```typescript
const { data, error } = await supabase
  .from('table_name')
  .select('id, field1, field2, created_at')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
  .limit(20);
```

### Read with Range Pagination
```typescript
const PAGE_SIZE = 20;
const from = page * PAGE_SIZE;
const to = from + PAGE_SIZE - 1;

const { data, error, count } = await supabase
  .from('table_name')
  .select('id, field1, field2', { count: 'exact' })
  .eq('user_id', userId)
  .range(from, to)
  .order('created_at', { ascending: false });
```

### Read with Join
```typescript
const { data, error } = await supabase
  .from('transactions')
  .select(`
    id,
    amount,
    description,
    created_at,
    category:categories(id, name, icon, type)
  `)
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
  .limit(20);
```

### Read with Multiple Joins
```typescript
const { data, error } = await supabase
  .from('transactions')
  .select(`
    id,
    amount,
    description,
    category:categories(name, icon),
    budget:budgets(limit, spent)
  `)
  .eq('user_id', userId)
  .limit(20);
```

### Insert
```typescript
const { data, error } = await supabase
  .from('table_name')
  .insert({
    user_id: userId,
    field1: value1,
    field2: value2
  })
  .select('id, field1, field2')
  .single();
```

### Update
```typescript
const { data, error } = await supabase
  .from('table_name')
  .update({
    field1: newValue1,
    updated_at: new Date().toISOString()
  })
  .eq('id', recordId)
  .eq('user_id', userId)  // Security check
  .select('id, field1, field2')
  .single();
```

### Delete
```typescript
const { error } = await supabase
  .from('table_name')
  .delete()
  .eq('id', recordId)
  .eq('user_id', userId);  // Security check
```

## Advanced Patterns

### Aggregation Query (RPC)
```typescript
// TypeScript
const { data, error } = await supabase
  .rpc('get_user_statistics', {
    p_user_id: userId
  });

// SQL Function
CREATE OR REPLACE FUNCTION get_user_statistics(p_user_id UUID)
RETURNS TABLE(
  total_transactions BIGINT,
  total_spent NUMERIC,
  avg_transaction NUMERIC,
  category_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT,
    COALESCE(SUM(amount), 0),
    COALESCE(AVG(amount), 0),
    COUNT(DISTINCT category_id)::BIGINT
  FROM transactions
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;
```

### Search with Filtering
```typescript
const { data, error } = await supabase
  .from('transactions')
  .select('id, amount, description, category, created_at')
  .eq('user_id', userId)
  .ilike('description', `%${searchQuery}%`)
  .gte('amount', minAmount)
  .lte('amount', maxAmount)
  .order('created_at', { ascending: false })
  .limit(50);
```

### Date Range Query
```typescript
const { data, error } = await supabase
  .from('transactions')
  .select('id, amount, category, created_at')
  .eq('user_id', userId)
  .gte('created_at', startDate)
  .lte('created_at', endDate)
  .order('created_at', { ascending: false });
```

### Batch Insert
```typescript
const { data, error } = await supabase
  .from('table_name')
  .insert([
    { user_id: userId, field1: 'value1' },
    { user_id: userId, field1: 'value2' },
    { user_id: userId, field1: 'value3' }
  ])
  .select('id, field1');
```

### Upsert (Insert or Update)
```typescript
const { data, error } = await supabase
  .from('table_name')
  .upsert({
    id: recordId,
    user_id: userId,
    field1: value1
  }, {
    onConflict: 'id'
  })
  .select();
```

### Count Only
```typescript
const { count, error } = await supabase
  .from('transactions')
  .select('*', { count: 'exact', head: true })
  .eq('user_id', userId);
```

## Service Layer Patterns

### Service Function Template
```typescript
// /lib/services/<feature>.ts
import { createClient } from '@/lib/supabase/server';

export async function getRecords(userId: string, options?: {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) {
  const supabase = createClient();
  const { limit = 20, offset = 0, sortBy = 'created_at', sortOrder = 'desc' } = options || {};

  const { data, error } = await supabase
    .from('table_name')
    .select('id, field1, field2, created_at')
    .eq('user_id', userId)
    .order(sortBy, { ascending: sortOrder === 'asc' })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data;
}
```

### Hook Pattern (Client)
```typescript
// /lib/hooks/<feature>.ts
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useRecords(limit = 20) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const supabase = createClient();
        const { data: records, error } = await supabase
          .from('table_name')
          .select('id, field1, field2')
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) throw error;
        setData(records);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [limit]);

  return { data, loading, error };
}
```

### Server Component Pattern
```typescript
// /app/<route>/page.tsx
import { createClient } from '@/lib/supabase/server';

export const revalidate = 60; // Cache for 60 seconds

export default async function Page() {
  const supabase = createClient();
  
  const { data: records } = await supabase
    .from('table_name')
    .select('id, field1, field2')
    .order('created_at', { ascending: false })
    .limit(20);

  return <Component data={records} />;
}
```

## Optimization Checklist

### Pre-Optimization
- [ ] Identify all queries in the target area
- [ ] Measure current query count per page
- [ ] Measure data transfer size
- [ ] Check for missing indexes

### Optimization
- [ ] Replace `select('*')` with specific fields
- [ ] Add `.limit()` to all list queries
- [ ] Implement pagination for large lists
- [ ] Combine N+1 queries into joins
- [ ] Batch independent queries with `Promise.all()`
- [ ] Move filters to database level
- [ ] Add caching where appropriate

### Post-Optimization
- [ ] Verify query count reduced
- [ ] Verify data transfer reduced
- [ ] Test pagination works correctly
- [ ] Confirm RLS still works
- [ ] Update tests if needed
- [ ] Document complex queries

## Index Recommendations

### Standard Indexes
```sql
-- User-scoped tables
CREATE INDEX idx_table_user_id ON table_name(user_id);

-- Timestamp sorting
CREATE INDEX idx_table_created_at ON table_name(created_at DESC);

-- Composite (user + timestamp)
CREATE INDEX idx_table_user_created ON table_name(user_id, created_at DESC);
```

### Foreign Keys
```sql
-- Always index foreign keys
CREATE INDEX idx_transactions_category_id ON transactions(category_id);
CREATE INDEX idx_transactions_budget_id ON transactions(budget_id);
```

### Search Fields
```sql
-- Text search
CREATE INDEX idx_transactions_description ON transactions USING gin(to_tsvector('english', description));

-- Partial index for common filters
CREATE INDEX idx_active_transactions ON transactions(user_id, created_at) 
  WHERE deleted_at IS NULL;
```

## Common Filters Reference

```typescript
// Equality
.eq('column', value)
.neq('column', value)

// Comparison
.gt('column', value)   // Greater than
.gte('column', value)  // Greater than or equal
.lt('column', value)   // Less than
.lte('column', value)  // Less than or equal

// Range
.gte('created_at', startDate)
.lte('created_at', endDate)

// Text search
.like('name', '%pattern%')
.ilike('name', '%pattern%')  // Case-insensitive

// Array
.in('column', [val1, val2, val3])

// Null checks
.is('column', null)
.not('column', 'is', null)

// Arrays/JSON
.contains('tags', ['tag1'])
.containedBy('tags', ['tag1', 'tag2'])

// Multiple conditions (AND)
.eq('user_id', userId)
.eq('status', 'active')

// OR conditions
.or('status.eq.active,status.eq.pending')
```
