import { Coffee, Car, Home, ShoppingBag, Zap, LucideIcon } from 'lucide-react';

/**
 * Dashboard-specific constants and configurations
 */

// Icon mapping for categories
export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Coffee,
  Car,
  Home,
  ShoppingBag,
  Zap,
};

export const DEFAULT_CATEGORY_ICON = ShoppingBag;

// Category color mappings
export const CATEGORY_COLORS: Record<string, string> = {
  'Food & Drink': 'bg-orange-100 text-orange-600',
  'Transport': 'bg-blue-100 text-blue-600',
  'Shopping': 'bg-purple-100 text-purple-600',
  'Housing': 'bg-red-100 text-red-600',
  'Utilities': 'bg-yellow-100 text-yellow-600',
};

export const DEFAULT_CATEGORY_COLOR = 'bg-slate-100 text-slate-600';
export const INCOME_COLOR = 'bg-emerald-100 text-emerald-600';

// Budget thresholds
export const BUDGET_THRESHOLD = {
  DANGER: 90,
  WARNING: 70,
  DEFAULT_MULTIPLIER: 1.25,
} as const;

// Financial health score thresholds
export const HEALTH_SCORE = {
  EXCELLENT: 80,
  GOOD: 60,
} as const;

// UI limits
export const RECENT_TRANSACTIONS_LIMIT = 10;
export const DISPLAYED_TRANSACTIONS = 3;
export const TOP_BUDGET_CATEGORIES = 3;
