# Supabase Query Optimizer Skill

Comprehensive workflow for optimizing Supabase queries to maximize performance and minimize costs on the Free Tier.

## Skill Contents

### Core Documentation
- **SKILL.md** - Main optimization workflow and procedures

### Reference Materials
- **query-patterns.md** - Template queries and service layer patterns
- **cost-analysis.md** - Cost calculation formulas and monitoring

## Quick Start

### Invoke the Skill

Type in chat:
```
/supabase-query-optimizer [file or feature area]
```

Or mention optimization keywords:
- "optimize queries"
- "reduce database costs"
- "fix slow queries"
- "implement pagination"

### What It Does

1. **Analyzes** existing Supabase queries
2. **Identifies** anti-patterns (SELECT *, missing limits, N+1)
3. **Suggests** optimizations with code examples
4. **Validates** improvements
5. **Calculates** cost impact

## Common Use Cases

### Use Case 1: Optimize a Page
```
"Optimize queries in /app/dashboard/page.tsx"
```

**Output:**
- List of queries found
- Anti-patterns identified
- Optimized code
- Cost impact analysis

### Use Case 2: Fix Slow Loading
```
"The transaction list is loading slowly, optimize it"
```

**Output:**
- Performance analysis
- Pagination implementation
- Caching strategy
- Before/after metrics

### Use Case 3: Reduce Database Costs
```
"Audit all queries for cost efficiency"
```

**Output:**
- Full codebase scan
- Priority list of optimizations
- Estimated cost savings

## Reference Quick Access

### Query Templates

See [references/query-patterns.md](./references/query-patterns.md) for:
- Basic CRUD operations
- Pagination patterns
- Join syntax
- Service layer templates
- Hook patterns

### Cost Formulas

See [references/cost-analysis.md](./references/cost-analysis.md) for:
- Free tier limits
- Request budget calculations
- Data transfer costs
- Break-even analysis
- Monitoring queries

## Key Principles

1. **Select specific fields** - Never use `SELECT *`
2. **Always paginate** - Use `.limit()` or `.range()`
3. **Batch queries** - Combine N+1 into joins
4. **Filter at database** - Don't fetch all then filter
5. **Add indexes** - For frequently queried columns
6. **Cache aggressively** - Reduce repeated requests

## Example Outputs

### Before Optimization
```typescript
// ❌ 5 queries, 500 KB data
const { data: transactions } = await supabase.from('transactions').select('*');
const { data: categories } = await supabase.from('categories').select('*');
```

### After Optimization
```typescript
// ✅ 1 query, 5 KB data
const { data } = await supabase
  .from('transactions')
  .select('id, amount, category:categories(name, icon)')
  .limit(20);
```

### Impact Report
```
Queries reduced: 5 → 1 (80% reduction)
Data transfer: 500 KB → 5 KB (99% reduction)
Free tier usage: 150% → 30% ✅
```

## Integration with Project

This skill works seamlessly with:
- **Workspace Instructions** - Enforces query optimization rules
- **Fullstack Engineer Agent** - Uses optimization patterns when building features
- **Supabase Backend Engineer Agent** - Applies these patterns to database design

## Monitoring

Track optimization impact:

```sql
-- Check table sizes
SELECT tablename, pg_size_pretty(pg_total_relation_size('public.'||tablename))
FROM pg_tables WHERE schemaname = 'public';

-- Check index usage
SELECT tablename, indexname, idx_scan
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

## Continuous Improvement

- Run skill monthly to catch regressions
- Update patterns as Supabase adds features
- Refine cost models based on actual usage
- Share learnings in team documentation

---

**Remember:** Every query counts on the free tier. Optimize early, optimize often.
