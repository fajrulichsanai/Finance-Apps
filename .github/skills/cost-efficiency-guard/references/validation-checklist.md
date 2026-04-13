# Pre-Implementation Checklist

Use this checklist before generating any feature implementation.

## 🔍 Query Analysis

- [ ] **Count total queries**: How many `supabase.from()` or `.rpc()` calls?
- [ ] **Check for loops**: Are any queries inside loops or maps?
- [ ] **Identify sequential queries**: Can they be combined or parallelized?
- [ ] **Review SELECT statements**: Are all using specific fields (no `*`)?
- [ ] **Verify pagination**: Do all list queries have `.limit()` or `.range()`?
- [ ] **Check filtering**: Are filters at database level (not client-side)?
- [ ] **Look for JOINs**: Can related data be fetched in one query?

### Quick Query Count

```bash
# Scan proposed code
grep -c "supabase.from\|supabase.rpc" <file>
```

**Target:** 1-2 queries
**Max acceptable:** 3-4 queries
**Reject if:** 5+ queries

---

## 📦 Payload Analysis

- [ ] **Calculate row count**: How many records will be returned?
- [ ] **Calculate row size**: Sum of all field sizes (~estimate)
- [ ] **Check for SELECT ***: Any queries fetching all columns?
- [ ] **Verify limits**: Are there `.limit()` clauses on all list queries?
- [ ] **Review field selection**: Are all fields actually needed in the UI?
- [ ] **Check nested data**: Are relationships fetched efficiently?
- [ ] **Consider compression**: Can data be reduced (e.g., abbreviations)?

### Quick Payload Estimate

```typescript
// Example calculation
const estimatedRows = 20; // From .limit(20)
const estimatedRowSize = 258; // bytes (see cost-calculations.md)
const estimatedPayload = estimatedRows * estimatedRowSize;
// = 5,160 bytes ≈ 5 KB ✅ Excellent
```

**Target:** <20 KB
**Max acceptable:** 50 KB
**Reject if:** >50 KB

---

## ⚡ Real-Time Analysis

- [ ] **Check for subscriptions**: Any `.subscribe()` or `.channel()` calls?
- [ ] **Count connections**: How many concurrent subscriptions?
- [ ] **Review duration**: How long will subscriptions stay open?
- [ ] **Evaluate necessity**: Is real-time truly required?
- [ ] **Consider alternatives**: Can polling or manual refresh work?
- [ ] **Check free tier limits**: Will it exceed 2 concurrent connections?

### Quick Real-Time Check

```bash
# Scan for real-time usage
grep -E "subscribe\(\)|channel\(" <file>
```

**Target:** No real-time subscriptions
**Max acceptable:** Polling (30-60s intervals)
**Reject if:** `.subscribe()` usage (unless absolutely critical)

---

## ✅ Final Validation

### Cost Score Calculation

1. **Query Score**
   - 1-2 queries = 10 points
   - 3-4 queries = 5 points
   - 5+ queries = 0 points

2. **Payload Score**
   - <20 KB = 10 points
   - 20-50 KB = 5 points
   - >50 KB = 0 points

3. **Real-Time Score**
   - No subscriptions = 10 points
   - Polling only = 5 points
   - Subscriptions = 0 points

**Total Score:**
- 25-30 points = ✅ **APPROVED** (proceed)
- 15-24 points = ⚠️ **WARNING** (optimize first)
- 0-14 points = ❌ **BLOCKED** (redesign required)

---

## 🛠️ Common Fixes

### If Query Count Too High

**Fix #1: Combine with RPC**
```sql
CREATE OR REPLACE FUNCTION get_combined_data(...)
RETURNS JSON AS $$
  -- Combine multiple queries into one
$$ LANGUAGE plpgsql;
```

**Fix #2: Use JOINs**
```typescript
.select('*, category:categories(name, icon)')
```

**Fix #3: Parallelize**
```typescript
const [data1, data2] = await Promise.all([
  query1(),
  query2()
]);
```

### If Payload Too Large

**Fix #1: Select Specific Fields**
```typescript
// ❌ .select('*')
// ✅ .select('id, amount, category, created_at')
```

**Fix #2: Add Pagination**
```typescript
.limit(20)
.range(0, 19)
```

**Fix #3: Implement Lazy Loading**
```typescript
// Load visible content first
// Load below-fold content on scroll
```

### If Real-Time Used

**Fix #1: Manual Refresh**
```typescript
<button onClick={refreshData}>Refresh</button>
```

**Fix #2: Polling**
```typescript
useEffect(() => {
  const interval = setInterval(fetchData, 60000);
  return () => clearInterval(interval);
}, []);
```

**Fix #3: Optimistic Updates**
```typescript
// Update UI immediately, sync in background
const optimisticUpdate = async () => {
  setData(newData); // UI update
  await supabase.from('table').insert(newData); // Background sync
};
```

---

## 📋 Decision Template

After running all checks, document the decision:

```markdown
## Cost Efficiency Validation Results

**Feature:** [Feature name]
**Date:** [Date]

### Metrics
- Query Count: [X] queries
- Estimated Payload: [Y] KB
- Real-Time: [Yes/No]

### Score: [Total]/30

### Decision: [✅ APPROVED | ⚠️ WARNING | ❌ BLOCKED]

### Notes:
[Any specific concerns or optimizations applied]

### Next Steps:
[If blocked or warned, what needs to change]
```

---

## 🎯 Best Practices

1. **Always validate before implementing**, not after
2. **Prefer RPC functions** for complex multi-query operations
3. **Never use SELECT *** in production code
4. **Always add .limit()** to list queries
5. **Avoid real-time** unless absolutely necessary
6. **Cache aggressively** with appropriate `revalidate` times
7. **Monitor actual usage** after deployment
8. **Document cost decisions** for team awareness

---

## 📊 Quick Reference Table

| Pattern | Queries | Payload | Real-Time | Status |
|---------|---------|---------|-----------|--------|
| Dashboard (RPC) | 1 | 15 KB | No | ✅ |
| Transaction List | 1 | 10 KB | No | ✅ |
| Detail Page | 2 | 5 KB | No | ✅ |
| Settings | 1 | 2 KB | No | ✅ |
| N+1 in Loop | 10+ | Varies | No | ❌ |
| SELECT * All Records | 1 | 500 KB+ | No | ❌ |
| Real-Time Feed | 1 | 10 KB | Yes | ❌ |
| Polling Feed | 1 | 10 KB | No | ✅ |
