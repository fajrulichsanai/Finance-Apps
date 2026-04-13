---
name: cost-efficiency-guard
description: 'Pre-flight cost validation before implementing features. Use when: designing new features, implementing database queries, adding real-time functionality, building API endpoints, optimizing free tier usage, preventing costly patterns, validating architecture decisions, or ensuring budget compliance.'
argument-hint: 'Feature or implementation to validate for cost efficiency'
---

# Cost Efficiency Guard

**Preventative skill** that validates cost efficiency BEFORE generating implementation code. Acts as a gatekeeper to prevent expensive patterns in Supabase Free Tier environments.

## When to Use

Invoke this skill **BEFORE** implementing any feature that involves:
- Database queries
- Real-time subscriptions
- Data fetching logic
- API endpoints
- New pages or components with data
- Third-party integrations
- Background jobs

## Three Critical Checks

### ✅ Check #1: Query Count
**Rule**: Maximum 1-3 queries per page load

```typescript
// ❌ REJECTED - 5+ queries
async function DashboardPage() {
  const transactions = await getTransactions();     // Query 1
  const categories = await getCategories();         // Query 2
  const budgets = await getBudgets();               // Query 3
  const stats = await getStatistics();              // Query 4
  const settings = await getUserSettings();         // Query 5
  // 🚨 TOO MANY QUERIES
}

// ✅ APPROVED - 1 optimized query
async function DashboardPage() {
  const data = await supabase.rpc('get_dashboard_data'); // Single RPC
  // ✅ Efficient
}
```

**Suggested Alternatives:**
- Combine queries using JOINs or PostgreSQL functions (RPC)
- Cache frequently accessed data
- Use parallel fetching for independent queries
- Implement lazy loading for below-fold content

### ✅ Check #2: Payload Size
**Rule**: Maximum 50KB per request (target <20KB)

```typescript
// ❌ REJECTED - Large payload
const { data } = await supabase
  .from('transactions')
  .select('*')  // 🚨 Fetching all columns
  .gte('created_at', '2020-01-01'); // 🚨 No limit

// Estimated: 500 rows × 2KB = 1MB payload
// ❌ WAY TOO LARGE

// ✅ APPROVED - Minimal payload
const { data } = await supabase
  .from('transactions')
  .select('id, amount, category, created_at')  // ✅ Specific fields
  .order('created_at', { ascending: false })
  .limit(20); // ✅ Pagination

// Estimated: 20 rows × 0.5KB = 10KB
// ✅ Efficient
```

**Suggested Alternatives:**
- Select only required fields (never `SELECT *`)
- Implement pagination with `.limit()` and `.range()`
- Use incremental loading (load more on scroll)
- Filter at database level, not client-side
- Compress data (use smaller field names in RPC results)

### ✅ Check #3: Real-Time Usage
**Rule**: Avoid real-time subscriptions (Free Tier has 2 concurrent connections limit)

```typescript
// ❌ REJECTED - Real-time subscription
const subscription = supabase
  .channel('transactions')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'transactions' },
    (payload) => setData(payload.new)
  )
  .subscribe();
// 🚨 Uses 1/2 available connections
// 🚨 Stays open while page is active

// ✅ APPROVED - Manual refresh
async function refreshData() {
  const { data } = await supabase
    .from('transactions')
    .select('id, amount, category, created_at')
    .order('created_at', { ascending: false })
    .limit(20);
  setData(data);
}

// Call on mount and on user action (pull-to-refresh)
useEffect(() => { refreshData(); }, []);

// ✅ Or polling (if absolutely necessary)
useEffect(() => {
  const interval = setInterval(refreshData, 60000); // 1 minute
  return () => clearInterval(interval);
}, []);
```

**Suggested Alternatives:**
- Manual refresh button (pull-to-refresh pattern)
- Polling with reasonable intervals (30-60s minimum)
- Optimistic UI updates (update UI first, sync later)
- Scheduled background sync (when app regains focus)
- Server-sent events for critical updates only

## Validation Procedure

Run these checks in order before generating any implementation code:

### Step 1: Analyze Proposed Solution

**Questions to answer:**

1. **How many database queries will execute?**
   - Count all `supabase.from()` and `.rpc()` calls
   - Count queries in loops (multiply by iteration count)
   - Identify sequential vs. parallel queries

2. **What is the estimated payload size?**
   - How many records will be fetched?
   - How many columns per record?
   - Are there any `SELECT *` queries?
   - Is pagination implemented?

3. **Does it use real-time features?**
   - Any `.subscribe()` calls?
   - Any `.channel()` usage?
   - How long do subscriptions stay open?

### Step 2: Calculate Cost Score

| Metric | Target | Acceptable | ❌ Reject |
|--------|--------|------------|-----------|
| **Query Count** | 1-2 | 3-4 | 5+ |
| **Payload Size** | <20KB | 20-50KB | >50KB |
| **Real-Time** | None | Polling only | Subscriptions |

**Scoring:**
- All targets met = ✅ **Approved** (proceed)
- Mix of target/acceptable = ⚠️ **Warning** (suggest optimization)
- Any reject threshold = ❌ **Blocked** (require redesign)

### Step 3: Issue Warning or Approval

**If ✅ Approved:**
```
✅ Cost Efficiency: APPROVED

Query Count: 2 queries (parallel)
Payload Size: ~15KB (20 records, 4 fields each)
Real-Time: None (manual refresh only)

Proceed with implementation.
```

**If ⚠️ Warning:**
```
⚠️ Cost Efficiency: WARNING

Query Count: 4 queries
  → Suggestion: Combine using RPC function
Payload Size: ~35KB
  → Acceptable for now, but monitor
Real-Time: None

Recommend optimization before scaling.
```

**If ❌ Blocked:**
```
❌ Cost Efficiency: BLOCKED

Query Count: 8 queries (3 in loop)
  → MUST reduce to <3 queries
Payload Size: ~200KB (500 records, SELECT *)
  → MUST implement pagination
  → MUST select specific fields only
Real-Time: 2 subscriptions
  → MUST replace with polling or manual refresh

ALTERNATIVE APPROACH:
1. Create RPC function to combine queries
2. Use .limit(20) with pagination
3. Replace subscriptions with pull-to-refresh
```

### Step 4: Provide Cost-Efficient Alternative

When blocking or warning, **always provide** a concrete alternative:

**Template:**
```markdown
## Cost-Efficient Alternative

**Current Approach Issues:**
- [List specific problems with current design]

**Recommended Approach:**
1. [Step 1 with code example]
2. [Step 2 with code example]
3. [Step 3 with code example]

**Cost Comparison:**
| Metric | Original | Optimized | Improvement |
|--------|----------|-----------|-------------|
| Queries | 8 | 1 | 87.5% ↓ |
| Payload | 200KB | 15KB | 92.5% ↓ |
| Real-Time | Yes | No | Free tier safe |
```

## Common Scenarios

### Scenario A: Dashboard with Statistics

**Inefficient:**
```typescript
// 6 queries
const transactions = await getTransactions();
const categories = await getCategories();
const budgets = await getBudgets();
const totalIncome = await getTotalIncome();
const totalExpense = await getTotalExpense();
const balance = await getBalance();
```

**Cost Score:** ❌ Blocked (6 queries)

**Efficient Alternative:**
```typescript
// 1 query using RPC
const { data } = await supabase.rpc('get_dashboard_summary', {
  p_user_id: userId,
  p_date_from: startDate,
  p_date_to: endDate
});

// Returns: { transactions, categories, stats, balance }
```

**Migration SQL:**
```sql
CREATE OR REPLACE FUNCTION get_dashboard_summary(
  p_user_id UUID,
  p_date_from DATE,
  p_date_to DATE
)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'transactions', (SELECT json_agg(t) FROM (
      SELECT id, amount, category, created_at
      FROM transactions
      WHERE user_id = p_user_id
        AND created_at BETWEEN p_date_from AND p_date_to
      ORDER BY created_at DESC
      LIMIT 20
    ) t),
    'stats', (SELECT json_build_object(
      'total_income', COALESCE(SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END), 0),
      'total_expense', COALESCE(SUM(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END), 0),
      'balance', COALESCE(SUM(amount), 0)
    ) FROM transactions WHERE user_id = p_user_id)
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Scenario B: Infinite Scroll List

**Inefficient:**
```typescript
// Fetches all records at once
const { data } = await supabase
  .from('transactions')
  .select('*')
  .eq('user_id', userId);
```

**Cost Score:** ❌ Blocked (large payload, SELECT *)

**Efficient Alternative:**
```typescript
// Paginated with specific fields
const ITEMS_PER_PAGE = 20;

async function loadPage(pageIndex: number) {
  const from = pageIndex * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;
  
  const { data, count } = await supabase
    .from('transactions')
    .select('id, amount, category, created_at', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(from, to);
  
  return { data, count };
}
```

### Scenario C: Live Activity Feed

**Inefficient:**
```typescript
// Real-time subscription
const subscription = supabase
  .channel('activity')
  .on('postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'transactions' },
    handleNewTransaction
  )
  .subscribe();
```

**Cost Score:** ❌ Blocked (real-time subscription)

**Efficient Alternative:**
```typescript
// Manual refresh with visual indicator
function ActivityFeed() {
  const [data, setData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  async function refresh() {
    setIsRefreshing(true);
    const { data: latest } = await supabase
      .from('transactions')
      .select('id, amount, category, created_at')
      .order('created_at', { ascending: false })
      .limit(20);
    setData(latest);
    setIsRefreshing(false);
  }
  
  return (
    <div>
      <button onClick={refresh} disabled={isRefreshing}>
        {isRefreshing ? 'Refreshing...' : '↻ Refresh'}
      </button>
      {/* Render data */}
    </div>
  );
}
```

## Integration with Other Skills

- **Before optimization:** Use this skill to validate approach
- **After blocking:** Use `supabase-query-optimizer` to fix existing queries
- **For refactoring:** Run this skill first, then optimize

## Quick Decision Tree

```
Are you implementing a new feature?
├─ Yes → Run Cost Efficiency Guard FIRST
│  ├─ ✅ Approved → Proceed with implementation
│  ├─ ⚠️ Warning → Optimize before implementing
│  └─ ❌ Blocked → Redesign with suggested alternative
└─ No → Feature already exists?
   └─ Yes → Use supabase-query-optimizer instead
```

## Success Criteria

Implementation is cost-efficient when:
- [x] 1-3 queries maximum per page
- [x] All queries have specific field selection
- [x] All queries use `.limit()` or `.range()`
- [x] No real-time subscriptions (unless critical)
- [x] Payload size <50KB per request
- [x] No `SELECT *` queries
- [x] Filters applied at database level
- [x] Related data fetched in single query (JOINs or RPC)

## Exception Handling

### When Exceptions May Be Granted

Strict limits are the default, but **documented exceptions** may be approved for:

1. **Analytics/Reporting Features**
   - Export functionality (CSV, PDF)
   - Monthly/yearly aggregate reports
   - Admin dashboards with comprehensive data
   
2. **One-Time Operations**
   - Initial data migration
   - Bulk operations (user-initiated)
   - Cache warming on server startup

3. **Critical User Experience**
   - Search autocomplete (if cached)
   - Data visualization requiring statistical samples
   - Offline-first sync mechanisms

### Exception Documentation Template

When approving an exception, document it explicitly:

```markdown
## COST EXCEPTION APPROVED

**Feature:** [Feature name]
**Exception Type:** [Analytics/One-Time/Critical UX]
**Violations:**
- [ ] Query Count: [X] (exceeds limit of 3)
- [ ] Payload Size: [Y KB] (exceeds limit of 50KB)
- [ ] Real-Time: Yes (uses subscriptions)

**Justification:**
[Why this exception is necessary and cannot be optimized]

**Mitigation:**
- [How we're minimizing the cost impact]
- [Alternative approaches considered]
- [Monitoring plan]

**Approved By:** [Engineer name/date]
**Review Date:** [When to reassess this exception]
```

### Exception Limits

Even with exceptions, enforce:
- Maximum 10 queries per operation
- Maximum 500KB payload
- Real-time connections only for critical features
- Must include monitoring code (see below)

## Cost Monitoring Integration

When implementing features, include monitoring code to track actual costs:

### Query Count Monitoring

```typescript
// lib/monitoring/query-tracker.ts
export class QueryTracker {
  private static queries: { endpoint: string; count: number; timestamp: Date }[] = [];
  
  static track(endpoint: string, queryCount: number) {
    this.queries.push({ endpoint, queryCount, timestamp: new Date() });
    
    // Warn if exceeding threshold
    if (queryCount > 3) {
      console.warn(`⚠️ High query count on ${endpoint}: ${queryCount} queries`);
    }
  }
  
  static getReport() {
    return this.queries.reduce((acc, q) => {
      acc[q.endpoint] = (acc[q.endpoint] || 0) + q.count;
      return acc;
    }, {} as Record<string, number>);
  }
}

// Usage in page/component
export default async function DashboardPage() {
  const queryCount = 2; // Track how many queries this page makes
  QueryTracker.track('/dashboard', queryCount);
  
  // ... rest of implementation
}
```

### Payload Size Monitoring

```typescript
// lib/monitoring/payload-tracker.ts
export function trackPayloadSize(endpoint: string, data: unknown) {
  const sizeInBytes = new Blob([JSON.stringify(data)]).size;
  const sizeInKB = (sizeInBytes / 1024).toFixed(2);
  
  console.log(`📦 Payload size for ${endpoint}: ${sizeInKB} KB`);
  
  if (sizeInBytes > 50 * 1024) {
    console.error(`❌ Payload too large on ${endpoint}: ${sizeInKB} KB (max 50 KB)`);
  } else if (sizeInBytes > 20 * 1024) {
    console.warn(`⚠️ Payload approaching limit on ${endpoint}: ${sizeInKB} KB`);
  }
  
  return sizeInKB;
}

// Usage
const { data } = await supabase.from('transactions').select('...').limit(20);
trackPayloadSize('/api/transactions', data);
```

### Real-Time Connection Monitoring

```typescript
// lib/monitoring/realtime-tracker.ts
export class RealtimeTracker {
  private static connections = new Set<string>();
  
  static addConnection(channel: string) {
    this.connections.add(channel);
    console.log(`🔌 Real-time connection opened: ${channel}`);
    console.log(`📊 Active connections: ${this.connections.size}/2`);
    
    if (this.connections.size > 2) {
      console.error('❌ CRITICAL: Exceeded free tier real-time connection limit!');
    }
  }
  
  static removeConnection(channel: string) {
    this.connections.delete(channel);
    console.log(`🔌 Real-time connection closed: ${channel}`);
  }
  
  static getActiveConnections() {
    return Array.from(this.connections);
  }
}

// Usage (if real-time is approved as exception)
const channel = supabase.channel('transactions');
RealtimeTracker.addConnection('transactions');

channel.subscribe();

// Cleanup
return () => {
  channel.unsubscribe();
  RealtimeTracker.removeConnection('transactions');
};
```

### Development-Only Cost Dashboard

```typescript
// components/dev/CostMonitor.tsx
'use client';

import { useEffect, useState } from 'react';

export function CostMonitor() {
  const [stats, setStats] = useState({ queries: 0, payload: 0, realtime: 0 });
  
  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return;
    
    const interval = setInterval(() => {
      // Fetch from monitoring trackers
      setStats({
        queries: window.__queryCount || 0,
        payload: window.__totalPayload || 0,
        realtime: window.__realtimeConnections || 0
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg">
      <h3 className="font-bold mb-2">Cost Monitor</h3>
      <div className="space-y-1 text-sm">
        <div className={stats.queries > 3 ? 'text-red-400' : 'text-green-400'}>
          Queries: {stats.queries} {stats.queries > 3 && '⚠️'}
        </div>
        <div className={stats.payload > 50 ? 'text-red-400' : 'text-green-400'}>
          Payload: {stats.payload} KB {stats.payload > 50 && '⚠️'}
        </div>
        <div className={stats.realtime > 0 ? 'text-red-400' : 'text-green-400'}>
          Real-time: {stats.realtime}/2 {stats.realtime > 0 && '⚠️'}
        </div>
      </div>
    </div>
  );
}
```

Add to development layout:
```typescript
// app/layout.tsx
import { CostMonitor } from '@/components/dev/CostMonitor';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <CostMonitor />
      </body>
    </html>
  );
}
```

## Monthly Cost Review

Schedule monthly reviews to assess actual usage:

```bash
# Check database size
SELECT pg_size_pretty(pg_database_size('postgres'));

# Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

# Check query patterns
SELECT 
  query,
  calls,
  total_time,
  mean_time
FROM pg_stat_statements
ORDER BY calls DESC
LIMIT 10;
```

## References

- [Supabase Free Tier Limits](https://supabase.com/pricing)
- [PostgreSQL RPC Functions](https://supabase.com/docs/guides/database/functions)
- [Query Optimization Guide](../supabase-query-optimizer/SKILL.md)
- [Cost Calculations Reference](./references/cost-calculations.md)
- [Validation Checklist](./references/validation-checklist.md)
- [Project Guidelines](/.github/copilot-instructions.md)
