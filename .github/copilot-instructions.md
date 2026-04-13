# Finance App - Project Guidelines

This Next.js + Supabase finance application prioritizes **cost efficiency** (Free Tier optimization), **clean architecture**, and **maintainability**.

## Tech Stack

- **Frontend**: Next.js (App Router), TypeScript (strict), Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **Database**: PostgreSQL via Supabase (SQL-first, no ORM)

## Code Style (Non-Negotiable)

- TypeScript strict mode: **never use `any`**
- Functional components only (no class components)
- `async/await` only (no `.then()` chains)
- Keep functions small and focused (<50 lines ideal)
- Descriptive naming: no `temp`, `data`, `item`, `x`

## Next.js Patterns

**Default Strategy:**
- Use **Server Components** by default
- Client Components only when required:
  - `useState`, `useEffect`, event handlers
  - Browser APIs, interactivity

**Data Mutations:**
- Server Actions (preferred)
- API Routes only when Server Actions insufficient

## Supabase Rules (Critical)

**Security:**
- **Always enable RLS** on user-facing tables
- Never expose sensitive keys client-side

**Query Optimization:**
```typescript
// ❌ NEVER DO
.select('*')

// ✅ ALWAYS DO
.select('id, name, amount, created_at')
.limit(20)
.order('created_at', { ascending: false })
```

**Pagination:**
- Always use `LIMIT` for lists
- Implement `.range(from, to)` for large datasets

## Performance Requirements

- **No duplicate API calls** in a single render
- **No large payloads** without pagination
- **Debounce search inputs** (300-500ms)
- Use skeleton loading states
- Lazy load heavy components

## Database Conventions

**Every database change MUST:**
1. Be written in raw SQL
2. Include a migration file in `/doc/migrations/` or `/supabase/migrations/`
3. Follow naming: `YYYYMMDD_feature_name.sql`
4. Include: table creation, indexes, RLS policies, triggers (if needed)

**Example:**
```sql
-- 20260413_add_budgets.sql
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_budgets_user_id ON budgets(user_id);
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users access own budgets" ON budgets FOR ALL USING (auth.uid() = user_id);
```

**Naming Conventions:**
- Database: `snake_case` (user_id, created_at)
- TypeScript: `camelCase` (userId, createdAt)

## Project Structure (Enforce)

```
/app                        # Next.js routes
  /<route>/page.tsx         # Server Component
/components
  /ui                       # Base components (buttons, modals)
  /shared                   # Cross-feature (Header, BottomNav)
  /features/<feature>       # Feature-specific components
/hooks                      # Custom React hooks
/lib
  /supabase                 # Client/server/middleware
  /services                 # Data fetching logic
  /hooks                    # Data hooks (useTransactions)
  /constants                # Constants
  /utils                    # Utility functions
/types                      # TypeScript types
/doc/migrations             # SQL migration files
```

## UI/UX Standards

- Clean, minimal design
- Fully responsive (mobile-first)
- Skeleton loading for async content
- No layout shift (CLS = 0)
- Clear error states

## Cost Efficiency (Critical)

This app is optimized for **Supabase Free Tier**:

- Minimize database queries (1-2 per page ideal)
- Use caching aggressively (`revalidate`, `cache: 'force-cache'`)
- **Avoid realtime subscriptions** unless absolutely necessary
  - Prefer: manual refresh, polling (30-60s)
- Index frequently queried columns
- Select only required fields

## Documentation

- Database design patterns: `/doc/DASHBOARD_DATABASE_DESIGN.md`
- Feature implementation guides: `/doc/CATEGORY_MANAGEMENT_GUIDE.md`
- Migration history: `/doc/migrations/`

## Build Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run type checking
npx tsc --noEmit
```

---

**Philosophy**: Build like a startup engineer with limited budget. Every query counts. Optimize for current free tier, design for future scale.
