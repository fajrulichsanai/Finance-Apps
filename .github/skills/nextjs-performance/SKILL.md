---
name: nextjs-performance
description: 'Optimize Next.js App Router performance. Use when: diagnosing slow pages, reducing client-side JavaScript, implementing proper caching, preventing re-render loops, lazy loading components, migrating to Server Components, or auditing component boundaries.'
argument-hint: 'Page/component to optimize or full app audit'
---

# Next.js Performance Optimization

Workflow for identifying and fixing performance issues in Next.js App Router applications.

## When to Use

- Pages loading slowly or showing excessive client-side JavaScript
- Unnecessary data fetching happening client-side
- Components re-rendering too frequently
- Missing or incorrect caching strategies
- Need to audit Server vs Client Component usage
- Large bundle sizes impacting initial load

## Optimization Checklist

### 1. Server vs Client Component Audit

**Goal**: Minimize client-side JavaScript by defaulting to Server Components.

**Procedure**:
1. Identify all components with `'use client'` directive
2. For each client component, ask:
   - Does it use `useState`, `useEffect`, or event handlers?
   - Does it use browser-only APIs?
   - Could interactivity be moved to a child component?
3. Extract interactive portions into smaller Client Components
4. Convert parent to Server Component

**Anti-pattern**:
```tsx
// ❌ Entire page is client-side for one button
'use client';
export default function Dashboard() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <ServerData /> {/* Could be server component */}
      <button onClick={() => setCount(count + 1)}>{count}</button>
    </div>
  );
}
```

**Optimized**:
```tsx
// ✅ Server Component with small Client Island
export default function Dashboard() {
  return (
    <div>
      <ServerData />
      <CounterButton /> {/* Only this is 'use client' */}
    </div>
  );
}
```

### 2. Data Fetching Strategy

**Goal**: Fetch data on the server, cache appropriately, avoid client-side fetching.

**Procedure**:
1. Find all client-side data fetching (`useEffect` + `fetch`, `useSWR`, etc.)
2. Move fetching to Server Components or Server Actions
3. Implement appropriate caching strategy:
   - Static data: `{ cache: 'force-cache' }` (default)
   - Frequently updated: `{ next: { revalidate: 60 } }` (seconds)
   - User-specific: `{ cache: 'no-store' }`

**Anti-pattern**:
```tsx
// ❌ Client-side fetching
'use client';
export default function Transactions() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch('/api/transactions').then(r => r.json()).then(setData);
  }, []);
}
```

**Optimized**:
```tsx
// ✅ Server Component with caching
export default async function Transactions() {
  const data = await fetch('/api/transactions', {
    next: { revalidate: 60 } // Cache for 60 seconds
  }).then(r => r.json());
  
  return <TransactionList data={data} />;
}
```

### 3. Re-render Loop Detection

**Goal**: Prevent unnecessary re-renders that degrade performance.

**Common Causes**:
- Creating objects/arrays/functions inside render
- Missing dependencies in `useMemo`/`useCallback`
- Parent state causing child re-renders
- Context value changes triggering all consumers

**Procedure**:
1. Use React DevTools Profiler to identify frequent re-renders
2. Check for inline object/array creation in props
3. Wrap expensive computations in `useMemo`
4. Wrap callbacks in `useCallback` when passed to memoized children
5. Use `React.memo()` for expensive child components

**Anti-pattern**:
```tsx
// ❌ Re-renders on every parent render
function Parent() {
  return <ExpensiveChild config={{ theme: 'dark' }} />; // New object each render
}
```

**Optimized**:
```tsx
// ✅ Stable reference
const CONFIG = { theme: 'dark' };
function Parent() {
  return <ExpensiveChild config={CONFIG} />;
}
// Or use useMemo if dynamic
```

### 4. Lazy Loading Implementation

**Goal**: Reduce initial bundle size by deferring non-critical components.

**Candidates for Lazy Loading**:
- Modals and popups
- Chart/visualization libraries
- Heavy third-party components
- Below-the-fold content
- Conditional features (admin panels, etc.)

**Procedure**:
1. Identify components >50KB or with heavy dependencies
2. Use `next/dynamic` with `{ ssr: false }` for client-only components
3. Add loading state with `loading` option
4. Consider route-based code splitting for pages

**Implementation**:
```tsx
import dynamic from 'next/dynamic';

// ✅ Lazy load heavy chart component
const ExpensiveChart = dynamic(
  () => import('@/components/ExpensiveChart'),
  {
    loading: () => <ChartSkeleton />,
    ssr: false // Client-side only if needed
  }
);

export default function Dashboard() {
  return (
    <div>
      <QuickStats /> {/* Loads immediately */}
      <ExpensiveChart /> {/* Loads when needed */}
    </div>
  );
}
```

### 5. Caching Strategy Review

**Goal**: Balance freshness with performance using Next.js caching layers.

**Caching Hierarchy**:
1. **Request Memoization**: Automatic deduplication within single render
2. **Data Cache**: Persistent across requests (`fetch` with `cache` option)
3. **Full Route Cache**: Static routes cached at build time
4. **Router Cache**: Client-side navigation cache

**Decision Matrix**:

| Data Type | Strategy | Implementation |
|-----------|----------|----------------|
| Static content | Force cache | `{ cache: 'force-cache' }` |
| Updated hourly | Time-based revalidation | `{ next: { revalidate: 3600 } }` |
| User-specific | No cache | `{ cache: 'no-store' }` |
| On-demand updates | Tag-based revalidation | `revalidateTag('transactions')` |

**For Supabase/Database Queries**:
```tsx
// ✅ Cache database reads
export async function getTransactions() {
  const data = await supabase
    .from('transactions')
    .select('id, amount, category')
    .limit(20);
  
  return data;
}

// In page component:
export const revalidate = 60; // Revalidate every 60 seconds
```

## Audit Workflow

1. **Measure First**: Use Lighthouse, Web Vitals, React DevTools Profiler
2. **Identify Bottlenecks**: Focus on largest impact items first
3. **Apply Fixes Systematically**: Follow checklist sections 1-5
4. **Validate**: Re-measure to confirm improvement
5. **Document**: Note patterns for team consistency

## Key Performance Metrics

- **FCP (First Contentful Paint)**: < 1.8s
- **LCP (Largest Contentful Paint)**: < 2.5s
- **TBT (Total Blocking Time)**: < 200ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **Bundle Size**: Minimize client JavaScript

## Common Questions

**Q: When should I use Server Actions vs API Routes?**
A: Prefer Server Actions for mutations. Use API Routes only when Server Actions are insufficient (webhooks, external API integration).

**Q: Should all data fetching happen in Server Components?**
A: Yes, except for real-time data (use polling/websockets client-side) or data that requires user interaction to trigger.

**Q: How do I cache Supabase queries?**
A: Use Next.js `revalidate` export in page/layout or wrap Supabase calls in cached functions using `unstable_cache`.

## Next Steps

After optimization:
- Set up performance monitoring (Web Vitals)
- Create team guidelines for Server vs Client Components
- Document caching strategy for common data patterns
- Consider creating reusable cached query utilities
