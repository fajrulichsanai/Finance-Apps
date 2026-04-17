# Dark Mode Implementation Plan

## Overview
Implement global dark mode system that persists across all pages and sessions.

## Current Status
- ❌ Dark mode toggle exists but not functional (TODO comment in profile page)
- ❌ No theme provider or context
- ❌ No localStorage persistence
- ❌ Tailwind dark mode not configured

## Implementation Requirements

### 1. Theme Provider Setup

Create `/providers/ThemeProvider.tsx`:

```typescript
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  if (!mounted) return null;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

### 2. Update Root Layout

Edit `/app/layout.tsx`:

```typescript
import { ThemeProvider } from '@/providers/ThemeProvider';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### 3. Configure Tailwind Dark Mode

Edit `tailwind.config.ts`:

```typescript
module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  // ... rest of config
};
```

### 4. Update Profile Page Toggle

Edit `/app/profile/page.tsx`:

```typescript
import { useTheme } from '@/providers/ThemeProvider';

export default function ProfilePage() {
  const { theme, toggleTheme } = useTheme();
  
  // Remove local isDarkMode state
  // Replace with:
  const isDarkMode = theme === 'dark';
  
  // Update toggle handler:
  const handleToggleDarkMode = () => {
    toggleTheme();
  };
  
  // Pass to DarkModeToggle:
  <DarkModeToggle enabled={isDarkMode} onToggle={handleToggleDarkMode} />
}
```

### 5. Add Dark Mode Styles to Components

Update each component with dark mode variants:

**Example for cards:**
```typescript
<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
  <p className="text-gray-900 dark:text-gray-100">Content</p>
  <span className="text-gray-600 dark:text-gray-400">Secondary text</span>
</div>
```

**Example for backgrounds:**
```typescript
<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
  {/* content */}
</div>
```

### 6. Components Requiring Dark Mode Styles

Priority order for implementation:

1. **Layout Components**
   - `/app/layout.tsx`
   - `/components/shared/AppHeader.tsx`
   - `/components/shared/BottomNav.tsx`

2. **Page Backgrounds**
   - All pages in `/app/*/page.tsx`

3. **Feature Components**
   - `/components/features/profile/*`
   - `/components/features/dashboard/*`
   - `/components/features/insight/*`
   - `/components/features/activity/*`
   - `/components/features/budget/*`

4. **UI Components**
   - `/components/ui/*`

### 7. Color Palette for Dark Mode

Define consistent dark mode colors:

```typescript
// Light Mode
bg-white -> dark:bg-gray-800
bg-gray-50 -> dark:bg-gray-900
bg-gray-100 -> dark:bg-gray-800
text-gray-900 -> dark:text-gray-100
text-gray-600 -> dark:text-gray-400
border-gray-200 -> dark:border-gray-700

// Accent colors remain the same
blue-600, green-600, red-600, etc.
```

## Testing Checklist

- [ ] Theme persists after page reload
- [ ] Theme applies to all pages
- [ ] No flash of wrong theme on load
- [ ] Toggle button updates immediately
- [ ] All text remains readable
- [ ] All components properly styled
- [ ] Images/icons visible in both modes
- [ ] Form inputs styled correctly

## Estimated Effort

- **Setup (Provider + Config):** 30 minutes
- **Styling All Components:** 2-3 hours
- **Testing & Refinement:** 1 hour

**Total:** ~4 hours

## Notes

- Use `suppressHydrationWarning` on `<html>` to prevent hydration mismatch
- Test on both desktop and mobile
- Consider system preference detection: `window.matchMedia('(prefers-color-scheme: dark)')`
- Ensure sufficient contrast ratios for accessibility (WCAG AA)

## Future Enhancements

- Auto-detect system preference on first visit
- Add "System" option (light/dark/system)
- Smooth transition animations between themes
- Per-page theme override capability
