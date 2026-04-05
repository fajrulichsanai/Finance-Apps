# Finance App - Next.js Project Instructions

## Tech Stack

- **Framework**: Next.js 15.1.0 (App Router)
- **React**: 19.0.0 with Server & Client Components
- **TypeScript**: 5.8.2 (strict mode)
- **Styling**: Tailwind CSS 4.1.14
- **Backend**: Supabase (authentication & database)
- **AI**: Google GenAI (@google/genai)
- **Charts**: Recharts 3.8.1
- **Icons**: Lucide React
- **Animations**: Motion 12.23.24
- **PWA**: next-pwa for Progressive Web App features

## Project Structure

```
app/                    # Next.js App Router pages
  ├── page.tsx         # Main dashboard (client component)
  ├── layout.tsx       # Root layout with metadata
  ├── globals.css      # Global Tailwind styles
  ├── login/           # Authentication pages
  └── register/
lib/                   # Shared utilities
  ├── utils.ts         # cn() helper for className merging
  └── supabase.ts.backup # Supabase client config
public/                # Static assets
supabase/              # Supabase configuration
```

## Code Conventions

### Component Style
- Use `'use client'` directive for client components
- Prefer functional components with TypeScript types
- Use `motion` from `motion/react` for animations, not `framer-motion`
- Import utilities: `import { cn } from '@/lib/utils'`

### Styling Patterns
- Use Tailwind CSS v4 syntax
- Dark mode: `dark:` prefix for dark mode variants
- Color palette: Use blue (`blue-*`), emerald (`emerald-*`), slate (`slate-*`)
- Glass morphism: `backdrop-blur-xl bg-white/80 dark:bg-slate-800/80`
- Rounded corners: Prefer `rounded-2xl` for cards, `rounded-xl` for buttons
- Shadows: `shadow-lg` for elevated elements

### Animation Patterns
- Use `motion` components for animations
- Common variants:
  ```tsx
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
  ```
- Use `AnimatePresence` for conditional rendering

### Data Visualization
- Use Recharts components: `AreaChart`, `BarChart`, `PieChart`
- Wrap charts in `ResponsiveContainer` for responsive sizing
- Color scheme matches Tailwind classes

### Icons
- Import from `lucide-react`
- Common icons: `Wallet`, `Coffee`, `Car`, `Home`, `ShoppingBag`, `Zap`, `Moon`, `Sun`, `Bell`
- Use consistent sizing: `className="w-5 h-5"` or `size={20}`

## Authentication
- Use Supabase for authentication
- Environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Login/Register pages support Google sign-in

## UI/UX Patterns

### Layout
- Full-screen layouts: `min-h-screen` on container
- Responsive: Mobile-first with `md:`, `lg:` breakpoints
- Spacing: Consistent padding with `p-4 md:p-6 lg:p-8`

### Cards
```tsx
<div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
  {/* content */}
</div>
```

### Buttons
```tsx
<button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
  {/* content */}
</button>
```

### Theme Toggle
- Support light/dark mode
- Use `useState` for theme state
- Toggle between `Moon` and `Sun` icons

## Performance
- Use Next.js Image component for images
- Server Components by default, Client Components only when needed
- PWA enabled via next-pwa configuration

## Development Workflow
- Dev server: `npm run dev` (default port 3000)
- Build: `npm run build`
- Lint: `npm run lint`

## File Naming
- Pages: `page.tsx` (Next.js App Router convention)
- Layouts: `layout.tsx`
- Components: PascalCase (e.g., `TransactionCard.tsx`)
- Utilities: camelCase (e.g., `utils.ts`)

## Key Features
- Dashboard with balance overview
- Transaction history with icons and categories
- Charts: Area chart (balance), Bar chart (income/expense), Pie chart (categories)
- Category breakdown with custom colors
- Responsive design with dark mode
- Progressive Web App (PWA) support

---

**Token Optimization**: This file provides all essential context upfront. When working on this project, reference these patterns instead of searching the codebase repeatedly.
