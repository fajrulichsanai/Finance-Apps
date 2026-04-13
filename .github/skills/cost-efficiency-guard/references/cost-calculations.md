# Cost Calculation Reference

Quick formulas and examples for estimating database costs on Supabase Free Tier.

## Supabase Free Tier Limits

| Resource | Free Tier Limit | Notes |
|----------|-----------------|-------|
| **Database Size** | 500 MB | Total storage |
| **Bandwidth** | 5 GB/month | Egress data transfer |
| **API Requests** | Unlimited | But rate-limited |
| **Real-Time Connections** | 2 concurrent | Major bottleneck |
| **Database Connections** | 60 max | Connection pooling |

## Payload Size Estimation

### Formula
```
Payload Size = (Number of Rows) × (Average Row Size)
Average Row Size = Sum of all field sizes + metadata overhead (~50-100 bytes)
```

### Field Size Reference

| Data Type | Size | Example |
|-----------|------|---------|
| `UUID` | 36 bytes | `550e8400-e29b-41d4-a716-446655440000` |
| `TEXT (short)` | ~10-50 bytes | `"Groceries"` |
| `TEXT (long)` | ~100-500 bytes | Descriptions |
| `INTEGER` | 4 bytes | `42` |
| `BIGINT` | 8 bytes | `1234567890` |
| `DECIMAL(10,2)` | 8 bytes | `123.45` |
| `TIMESTAMP` | 8 bytes | `2026-04-13T10:30:00Z` |
| `BOOLEAN` | 1 byte | `true` |
| `JSON` | Variable | Depends on content |

### Example Calculations

**Transaction Record:**
```typescript
{
  id: UUID,              // 36 bytes
  user_id: UUID,         // 36 bytes
  amount: DECIMAL,       // 8 bytes
  category: TEXT,        // 20 bytes avg
  description: TEXT,     // 100 bytes avg
  created_at: TIMESTAMP  // 8 bytes
}
// Total: ~208 bytes + 50 bytes overhead = 258 bytes per row
```

**Scenario: Fetch 100 transactions**
```
100 rows × 258 bytes = 25.8 KB ✅ Acceptable
```

**Scenario: Fetch 500 transactions with SELECT ***
```
500 rows × 258 bytes = 129 KB ❌ Too large
```

**Scenario: Fetch 20 transactions (4 fields only)**
```typescript
.select('id, amount, category, created_at')
// 36 + 8 + 20 + 8 = 72 bytes per row
20 rows × 72 bytes = 1.44 KB ✅ Excellent
```

## Query Count Estimation

### Pattern Recognition

**1 Query (Ideal):**
```typescript
// Single RPC or simple fetch
const { data } = await supabase.rpc('get_dashboard');
```

**2-3 Queries (Good):**
```typescript
// Parallel independent queries
const [transactions, settings] = await Promise.all([
  supabase.from('transactions').select('...').limit(20),
  supabase.from('user_settings').select('...').single()
]);
```

**4-5 Queries (Warning):**
```typescript
// Multiple sequential queries
const transactions = await getTransactions();
const categories = await getCategories();
const budgets = await getBudgets();
const stats = await getStats();
```

**6+ Queries (Blocked):**
```typescript
// Queries in loops or excessive endpoints
for (const category of categories) {
  const total = await getCategoryTotal(category.id); // ❌
}
```

### Hidden Query Multipliers

**Watch for loops:**
```typescript
// Appears to be 1 query, but actually N queries
for (let i = 0; i < 10; i++) {
  await supabase.from('table').select('*').eq('id', ids[i]);
}
// Real cost: 10 queries ❌
```

**Watch for component renders:**
```typescript
// If this component renders 5 times
function Component() {
  useEffect(() => {
    supabase.from('table').select('*'); // Runs every render
  }, []); // Missing dependency array might cause re-runs
}
```

## Bandwidth Calculations

### Monthly Bandwidth = Sum of all API responses

**Example month:**
- 1,000 page loads
- Average 3 queries per page
- Average 15 KB per query response

```
1,000 loads × 3 queries × 15 KB = 45 MB/month
✅ Well within 5 GB limit
```

**High-usage scenario:**
- 10,000 page loads (popular app)
- 5 queries per page (not optimized)
- Average 50 KB per query (no pagination)

```
10,000 loads × 5 queries × 50 KB = 2.5 GB/month
⚠️ Half of free tier limit
```

**Critical scenario:**
- Real-time subscription sending 10 KB every 5 seconds
- User session average: 30 minutes

```
10 KB × 12 updates/min × 30 min = 3.6 MB per user session
If 100 users/day: 360 MB/day = 10.8 GB/month
❌ Exceeds free tier limit
```

## Real-Time Connection Cost

### Free Tier: 2 Concurrent Connections

**Scenario A: Single User**
```typescript
// User opens 2 tabs
// Tab 1: 1 subscription
// Tab 2: 1 subscription
// Total: 2/2 connections used ⚠️ At capacity
```

**Scenario B: Two Users**
```typescript
// User 1: 1 subscription
// User 2: 1 subscription
// Total: 2/2 connections used ✅ OK
```

**Scenario C: Three Users**
```typescript
// User 1: 1 subscription
// User 2: 1 subscription
// User 3: 1 subscription ❌ REJECTED (over limit)
```

**Conclusion:** Real-time is not viable for multi-user apps on free tier.

## Decision Matrix

| Metric | ✅ Green | ⚠️ Yellow | ❌ Red |
|--------|---------|----------|--------|
| **Queries/Page** | 1-2 | 3-4 | 5+ |
| **Payload/Request** | <20 KB | 20-50 KB | >50 KB |
| **Records/Request** | 10-20 | 20-50 | >50 |
| **Bandwidth/Month** | <1 GB | 1-3 GB | >3 GB |
| **SELECT Fields** | Specific | Most fields | * (all) |
| **Real-Time** | None | Polling | Subscriptions |
| **Indexes** | All filters | Most filters | Missing |

## Optimization ROI Calculator

**Before optimization:**
- Queries: 8 per page
- Payload: 200 KB per page
- 1,000 page loads/month

```
Total bandwidth: 1,000 × 200 KB × 8 = 1.6 GB/month
```

**After optimization:**
- Queries: 2 per page (RPC + settings)
- Payload: 15 KB per page
- 1,000 page loads/month

```
Total bandwidth: 1,000 × 15 KB × 2 = 30 MB/month
Savings: 1.57 GB/month (98% reduction) 🎉
```

## Free Tier Sustainability Score

Calculate your sustainability score:

```
Score = (
  Query Efficiency × 0.4 +
  Payload Efficiency × 0.3 +
  Real-Time Avoidance × 0.3
) × 100

Where:
- Query Efficiency = min(2 / actual_queries, 1)
- Payload Efficiency = min(20KB / actual_payload_kb, 1)
- Real-Time Avoidance = 1 if no subscriptions, 0 if using subscriptions
```

**Example A: Well-optimized app**
```
Queries: 2
Payload: 15 KB
Real-time: None

Score = (
  (2/2) × 0.4 +
  (20/15) × 0.3 +
  1 × 0.3
) × 100 = 100 ✅ Excellent
```

**Example B: Needs optimization**
```
Queries: 5
Payload: 50 KB
Real-time: Polling

Score = (
  (2/5) × 0.4 +
  (20/50) × 0.3 +
  1 × 0.3
) × 100 = 58 ⚠️ Needs improvement
```

**Example C: Over budget**
```
Queries: 10
Payload: 200 KB
Real-time: Subscriptions

Score = (
  (2/10) × 0.4 +
  (20/200) × 0.3 +
  0 × 0.3
) × 100 = 11 ❌ Critical
```

## Target Benchmarks

### Per Page Load
- Queries: 1-2 (max 3)
- Payload: <20 KB (max 50 KB)
- Response time: <500ms
- No real-time subscriptions

### Per Feature
- Database tables: Minimize
- Indexes: All filtered columns
- RLS policies: Simple and efficient
- Migrations: Forward-compatible

### Per Month (1,000 active users)
- Bandwidth: <2 GB
- Database size: <300 MB
- API requests: <100,000
- Real-time connections: 0-1 concurrent
