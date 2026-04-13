# Cost Efficiency Guard Skill

Pre-flight validation skill that checks database query costs BEFORE implementing features.

## Purpose

Prevents expensive patterns in Supabase Free Tier environments by validating:
1. **Query Count** (target: 1-2, max: 3-4)
2. **Payload Size** (target: <20KB, max: 50KB)
3. **Real-Time Usage** (avoid subscriptions, prefer polling)

## How to Use

### Invoke the Skill

```
@workspace /cost-efficiency-guard Implement feature X
```

The skill will analyze the proposed implementation and either:
- ✅ **Approve** - Proceed with implementation
- ⚠️ **Warn** - Suggest optimizations
- ❌ **Block** - Require redesign with cheaper alternative

### During Implementation

Add monitoring code (see `references/monitoring-utilities.ts`):

```typescript
import { QueryTracker, trackPayloadSize } from '@/lib/monitoring/cost-tracker';

// Track queries
QueryTracker.track('/dashboard', 2);

// Track payload
const { data } = await supabase.from('...').select('...').limit(20);
trackPayloadSize('/dashboard', data);
```

## Files in This Skill

| File | Purpose |
|------|---------|
| `SKILL.md` | Main skill procedures and examples |
| `references/cost-calculations.md` | Detailed formulas for cost estimation |
| `references/validation-checklist.md` | Quick pre-implementation checklist |
| `references/monitoring-utilities.ts` | Copy-paste monitoring code |
| `README.md` | This file |

## When to Use

**Use this skill BEFORE implementing:**
- New pages with database queries
- API endpoints
- Data fetching logic
- Real-time features
- Background jobs

## Workflow

1. **Invoke skill** before implementing
2. **Receive validation** (approve/warn/block)
3. **Implement feature** (with monitoring if needed)
4. **Review cost** in development (via console logs)

## Cost Thresholds

| Metric | Target | Max Acceptable | Reject If |
|--------|--------|----------------|-----------|
| Queries/Page | 1-2 | 3-4 | 5+ |
| Payload/Request | <20 KB | 50 KB | >50 KB |
| Real-Time | None | Polling | Subscriptions |

## Exception Handling

Strict enforcement is default. Exceptions may be granted for:
- Analytics/reporting (exports, dashboards)
- One-time operations (migrations, bulk actions)
- Critical UX (search, visualizations)

**Must be documented** with justification and mitigation (see SKILL.md).

## Integration with Other Skills

- **Before optimization:** Use this skill first
- **After blocking:** Use `supabase-query-optimizer` to fix queries
- **For refactoring:** Run this skill, then optimize

## Quick Reference

**Approved Pattern:**
```typescript
const { data } = await supabase
  .from('transactions')
  .select('id, amount, category, created_at')  // Specific fields
  .order('created_at', { ascending: false })
  .limit(20);  // Pagination
// 1 query, ~10KB payload, no real-time ✅
```

**Blocked Pattern:**
```typescript
const { data } = await supabase
  .from('transactions')
  .select('*');  // All fields
// No limit, 500+ rows, ~500KB payload ❌
```

## See Also

- [Supabase Query Optimizer Skill](../supabase-query-optimizer/)
- [Project Cost Guidelines](/.github/copilot-instructions.md)
- [Supabase Free Tier Pricing](https://supabase.com/pricing)
