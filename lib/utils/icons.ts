/**
 * Icon utilities for category icons
 * Centralized icon mapping for consistency across the app
 */

import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/**
 * Get Lucide icon component from icon name string
 * Falls back to Wallet icon if not found
 * Logs warnings for invalid icons to help with debugging
 */
export const getIconComponent = (iconName: string): LucideIcon => {
  if (!iconName || typeof iconName !== 'string') {
    console.warn('[getIconComponent] Invalid icon name (empty or not string):', iconName);
    return Icons.Wallet;
  }

  const IconComponent = (Icons as any)[iconName];
  if (!IconComponent) {
    console.warn('[getIconComponent] Icon not found:', iconName, '- using Wallet fallback');
    return Icons.Wallet;
  }
  
  return IconComponent;
};

/**
 * Available category icons
 * Expanded list for better category representation
 */
export const CATEGORY_ICONS = [
  'ShoppingCart', 'Coffee', 'Car', 'Home', 'Heart', 'Zap', 
  'Utensils', 'ShoppingBag', 'Smartphone', 'Laptop', 'Plane',
  'Film', 'Music', 'Gamepad2', 'Dumbbell', 'GraduationCap',
  'Briefcase', 'Gift', 'Pizza', 'Bus', 'Bike', 'Train',
  'Shirt', 'Watch', 'Headphones', 'Camera', 'Book',
  'Pill', 'Stethoscope', 'Baby', 'PawPrint', 'Palmtree',
  'Sparkles', 'TrendingUp', 'DollarSign', 'CreditCard', 
  'PiggyBank', 'Wallet', 'Calculator', 'Receipt', 'Banknote'
] as const;

/**
 * Available category colors
 * Curated palette for category identification
 */
export const CATEGORY_COLORS = [
  '#1a237e', // Navy blue (primary)
  '#2e7d32', // Green
  '#c62828', // Red
  '#f9a825', // Yellow/Gold
  '#00b0d8', // Cyan
  '#7b1fa2', // Purple
  '#ef4444', // Bright red
  '#f59e0b', // Orange
  '#10b981', // Emerald
  '#3b82f6', // Blue
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#64748b', // Slate
  '#f97316', // Deep orange
  '#06b6d4', // Turquoise
  '#84cc16', // Lime
  '#a855f7', // Light purple
  '#f43f5e', // Rose
] as const;
