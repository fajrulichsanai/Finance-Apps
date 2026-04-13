---
name: supabase-query-optimizer
description: 'Optimize Supabase queries for cost efficiency and performance. Use when: analyzing slow queries, reducing database costs, fixing N+1 problems, implementing pagination, auditing query patterns, minimizing database load, or improving free tier usage.'
argument-hint: 'File path or feature area to optimize'
---

# Supabase Query Optimizer

Systematic approach to optimize Supabase queries for **cost efficiency** and **performance** on the Free Tier.

## When to Use

Invoke this skill when:
- Query performance is slow
- Database costs are increasing
- Pages load too many records
- Multiple queries run per component
- Need to reduce database load
- Auditing query efficiency
- Implementing new data fetching

## Core Optimization Rules

### ❌ Never Do
- `select('*')` - Overfetching data
- No pagination/limits - Loading all records
- Multiple sequential queries - N+1 problem
- Client-side filtering - Should be database-level
- Nested queries in loops - Batch instead
- Missing indexes on filtered columns

### ✅ Always Do
- Select specific fields only
- Use `.limit()` and pagination
- Batch related queries
- Filter at database level
- Index frequently queried columns
- Cache when appropriate

## Optimization Procedure

### Step 1: Analyze Current Queries

**Locate all Supabase queries** in the target area:

```bash
# Search for Supabase client usage
grep -r "supabase.from" --include="*.ts" --include="*.tsx"
```

**For each query, check:**
1. ✅ Is it selecting specific fields or using `*`?
2. ✅ Does it have a `.limit()` clause?
3. ✅ Is it paginated for large datasets?
4. ✅ Are filters pushed to database?
5. ✅ Could multiple queries be combined?

### Step 2: Identify Anti-Patterns

#### Anti-Pattern #1: SELECT *
```typescript
// ❌ BAD - Overfetching
const { data } = await supabase
  .from('transactions')
  .select('*');

// ✅ GOOD - Specific fields only
const { data } = await supabase
  .from('transactions')
  .select('id, amount, category, created_at');
```

#### Anti-Pattern #2: No Pagination
```typescript
// ❌ BAD - Loading all records
const { data } = await supabase
  .from('transactions')
  .select('id, amount, category');

// ✅ GOOD - Limited + ordered
const { data } = await supabase
  .from('transactions')
  .select('id, amount, category, created_at')
  .order('created_at', { ascending: false })
  .limit(20);

// ✅ BETTER - Paginated
const { data } = await supabase
  .from('transactions')
  .select('id, amount, category, created_at')
  .order('created_at', { ascending: false })
  .range(from, to);
```

#### Anti-Pattern #3: N+1 Queries
```typescript
// ❌ BAD - Multiple queries
const { data: transactions } = await supabase
  .from('transactions')
  .select('id, category_id');

// Then for each transaction:
for (const t of transactions) {
  const { data: category } = await supabase
    .from('categories')
    .select('name')
    .eq('id', t.category_id);
}

// ✅ GOOD - Single query with join
const { data } = await supabase
  .from('transactions')
  .select(`
    id,
    amount,
    category:categories(name, icon)
  `)
  .limit(20);
```

#### Anti-Pattern #4: Multiple Sequential Queries
```typescript
// ❌ BAD - 3 separate queries
const { data: transactions } = await supabase.from('transactions').select('*');
const { data: categories } = await supabase.from('categories').select('*');
const { data: budgets } = await supabase.from('budgets').select('*');

// ✅ GOOD - Single batch query (if related)
const { data } = await supabase
  .from('transactions')
  .select(`
    id,
    amount,
    category:categories(id, name),
    budget:budgets(id, limit)
  `)
  .limit(20);

// ✅ ACCEPTABLE - Parallel queries (if unrelated)
const [transactions, settings] = await Promise.all([
  supabase.from('transactions').select('id, amount').limit(10),
  supabase.from('user_settings').select('theme, currency').single()
]);
```

#### Anti-Pattern #5: Client-Side Filtering
```typescript
// ❌ BAD - Fetch all, filter in JS
const { data } = await supabase
  .from('transactions')
  .select('*');
const filtered = data.filter(t => t.amount > 100);

// ✅ GOOD - Filter at database
const { data } = await supabase
  .from('transactions')
  .select('id, amount, category')
  .gt('amount', 100)
  .limit(50);
```

#### Anti-Pattern #6: Missing Indexes
```typescript
// If querying frequently by user_id without index
// ❌ Performance hit on large tables
const { data } = await supabase
  .from('transactions')
  .eq('user_id', userId);  // Slow without index

// ✅ Ensure migration includes:
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
```

### Step 3: Calculate Query Cost

**Metrics to measure:**

1. **Request Count**: How many queries per page load?
   - Target: 1-2 queries
   - Acceptable: 3-5 queries
   - Bad: 6+ queries

2. **Data Transfer**: How much data is fetched?
   - Target: <50KB per request
   - Acceptable: 50-200KB
   - Bad: >200KB

3. **Record Count**: How many rows returned?
   - Target: 10-50 rows
   - Acceptable: 50-100 rows
   - Bad: 100+ rows (needs pagination)

### Step 4: Implement Optimizations

**Priority Order:**

1. **Eliminate `SELECT *`**
   - Replace with specific field lists
   - Remove unused columns

2. **Add Pagination**
   - `.limit(20)` for initial load
   - `.range(from, to)` for infinite scroll

3. **Combine Queries**
   - Use joins for related data
   - Batch independent queries with `Promise.all()`

4. **Add Indexes** (if missing)
   - Index foreign keys
   - Index frequently filtered columns
   - Create migration file

5. **Implement Caching**
   - Server Components: `fetch` with `revalidate`
   - Client Components: SWR/React Query
   - Static data: `cache: 'force-cache'`

### Step 5: Refactor Code

**Pattern: Service Layer**

Create optimized service functions in `/lib/services/`:

```typescript
// /lib/services/transactions.ts
export async function getRecentTransactions(userId: string, limit = 20) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      id,
      amount,
      description,
      created_at,
      category:categories(id, name, icon)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}
```

**Pattern: Custom Hook**

Wrap service in hook for client components:

```typescript
// /lib/hooks/useTransactions.ts
export function useTransactions(limit = 20) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getRecentTransactions(userId, limit);
      setTransactions(data);
      setLoading(false);
    }
    load();
  }, [limit]);

  return { transactions, loading };
}
```

**Pattern: Server Component**

Direct query with caching:

```typescript
// /app/dashboard/page.tsx
export const revalidate = 60; // Cache for 60 seconds

export default async function DashboardPage() {
  const supabase = createClient();
  
  const { data: transactions } = await supabase
    .from('transactions')
    .select('id, amount, category, created_at')
    .order('created_at', { ascending: false })
    .limit(10);

  return <TransactionList data={transactions} />;
}
```

### Step 6: Validate Improvements

**Checklist:**

- [ ] All queries select specific fields (no `*`)
- [ ] All list queries have `.limit()` or `.range()`
- [ ] No N+1 queries (combined into joins)
- [ ] Queries per page: ≤3 (ideal: 1-2)
- [ ] Data per request: <100KB
- [ ] Indexes exist for filtered columns
- [ ] Caching implemented where appropriate
- [ ] No client-side filtering of large datasets

**Testing:**

```bash
# 1. Check network tab in browser DevTools
# - Count Supabase API requests
# - Measure payload sizes
# - Check response times

# 2. Verify pagination
# - Load page multiple times
# - Should see consistent request count
# - Should not load all records

# 3. Test with production data volume
# - Add 1000+ test records
# - Ensure queries remain fast
```

### Step 7: Document Changes

**Update migration file** (if indexes were added):

```sql
-- 20260413_optimize_transactions.sql

-- Add indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_transactions_user_id 
  ON transactions(user_id);
  
CREATE INDEX IF NOT EXISTS idx_transactions_created_at 
  ON transactions(created_at DESC);

-- Composite index for common query pattern
CREATE INDEX IF NOT EXISTS idx_transactions_user_created 
  ON transactions(user_id, created_at DESC);
```

**Add comments to complex queries**:

```typescript
// Optimized query: fetches only 20 most recent transactions
// with category details in a single request (no N+1)
const { data } = await supabase
  .from('transactions')
  .select(`
    id,
    amount,
    category:categories(name, icon)
  `)
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
  .limit(20);
```

## Common Optimization Patterns

### Pattern 1: Dashboard Aggregates
```typescript
// Instead of: fetch all + calculate in JS
// Use: RPC function for server-side aggregation

const { data } = await supabase
  .rpc('get_user_statistics', { user_id: userId });

// SQL function:
CREATE FUNCTION get_user_statistics(user_id UUID)
RETURNS JSON AS $$
  SELECT json_build_object(
    'total_transactions', COUNT(*),
    'total_spent', SUM(amount),
    'avg_transaction', AVG(amount)
  )
  FROM transactions
  WHERE user_id = $1;
$$ LANGUAGE sql;
```

### Pattern 2: Search with Debouncing
```typescript
// Client component with debounced search
const [query, setQuery] = useState('');
const debouncedQuery = useDebounce(query, 500);

useEffect(() => {
  if (debouncedQuery) {
    searchTransactions(debouncedQuery);
  }
}, [debouncedQuery]);

async function searchTransactions(q: string) {
  const { data } = await supabase
    .from('transactions')
    .select('id, description, amount')
    .ilike('description', `%${q}%`)
    .limit(10);
}
```

### Pattern 3: Infinite Scroll Pagination
```typescript
const [page, setPage] = useState(0);
const PAGE_SIZE = 20;

async function loadMore() {
  const from = page * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  
  const { data } = await supabase
    .from('transactions')
    .select('id, amount, category')
    .range(from, to)
    .order('created_at', { ascending: false });
  
  setPage(p => p + 1);
}
```

## Cost Impact Analysis

**Before Optimization:**
```
- Query: SELECT * FROM transactions
- Records: 1000
- Fields: 15
- Size: ~500KB
- Queries per page: 5
- Total data: ~2.5MB per page load
```

**After Optimization:**
```
- Query: SELECT id, amount, category FROM transactions LIMIT 20
- Records: 20
- Fields: 3
- Size: ~5KB
- Queries per page: 1-2
- Total data: ~10KB per page load
```

**Savings: 99.6% reduction in data transfer**

## Free Tier Limits (Reference)

| Resource | Free Tier Limit | Optimized Usage |
|----------|-----------------|-----------------|
| Database Size | 500 MB | Select only needed fields |
| API Requests | 50,000/month | Batch queries, cache aggressively |
| Bandwidth | 5 GB | Pagination, specific fields |
| Realtime Connections | 200 | Avoid realtime, use polling |

**Formula:**
```
Daily requests budget = 50,000 / 30 = ~1,666/day
Per user per day = 1,666 / active_users
Target: <50 requests per active user per day
```

## Output Format

When completing an optimization, provide:

```markdown
## 🔍 Query Analysis

**Files analyzed:** [list]
**Queries found:** [count]

## ❌ Issues Identified

1. [Specific anti-pattern with code example]
2. [Another issue]

## ✅ Optimizations Applied

1. [Change made with before/after]
2. [Another optimization]

## 📊 Impact

- Queries reduced: [before] → [after]
- Data transfer: [before] → [after]
- Estimated cost savings: [percentage]

## 📝 Migration File

[If indexes added, show migration file path]
```

## Quick Reference Card

```typescript
// ❌ AVOID
.select('*')
.select('*').eq('user_id', id)  // No limit

// ✅ USE
.select('id, name, amount')
.select('id, name').limit(20)
.select('id, name').range(0, 19)

// 🔗 JOINS
.select('*, category:categories(name)')

// 🎯 FILTERS
.eq('user_id', id)
.gt('amount', 100)
.ilike('name', '%search%')

// 📄 PAGINATION
.limit(20)
.range(from, to)
.order('created_at', { ascending: false })

// 🔐 ALWAYS
.eq('user_id', userId)  // Ensure RLS compatibility
```

---

**Remember:** Every query costs resources. Optimize for the 80% use case, not the 1% edge case.
