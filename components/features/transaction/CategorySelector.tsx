// =====================================================
// FINANCE APP - Category Selector
// =====================================================

'use client';

import type { Category } from '@/lib/services/categories';
import { Coffee, Car, Zap, ShoppingBag, Film, MoreHorizontal } from 'lucide-react';

interface CategorySelectorProps {
  categories: Category[];
  selectedId: string | null;
  onSelect: (categoryId: string) => void;
  loading?: boolean;
}

// Icon mapping - can be extended
const iconMap: Record<string, any> = {
  Coffee,
  Car,
  Zap,
  ShoppingBag,
  Film,
  MoreHorizontal,
};

export default function CategorySelector({
  categories,
  selectedId,
  onSelect,
  loading = false,
}: CategorySelectorProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl mx-5 mb-4 p-4 shadow-md animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-24 mb-4"></div>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 bg-slate-200 rounded-xl"></div>
              <div className="h-3 bg-slate-200 rounded w-12"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl mx-5 mb-4 p-4 shadow-md">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4">
        Select Category
      </p>
      <div className="grid grid-cols-3 gap-3">
        {categories.map(category => {
          const Icon = iconMap[category.icon || 'MoreHorizontal'] || MoreHorizontal;
          const isSelected = selectedId === category.id;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelect(category.id)}
              className="flex flex-col items-center gap-1.5 group"
            >
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-emerald-100 border-2 border-emerald-500 text-emerald-600'
                    : 'bg-slate-100 border-2 border-transparent text-slate-400 group-hover:bg-slate-200'
                }`}
              >
                <Icon className="w-6 h-6" strokeWidth={2} />
              </div>
              <span
                className={`text-xs font-semibold text-center ${
                  isSelected ? 'text-emerald-600' : 'text-slate-600'
                }`}
              >
                {category.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
