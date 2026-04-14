// =====================================================
// FINANCE APP - Category Selector
// =====================================================
// Dynamic category selector with database icons & colors
// =====================================================

'use client';

import type { Category } from '@/lib/services/categories';
import { getIconComponent } from '@/lib/utils/icons';

interface CategorySelectorProps {
  categories: Category[];
  selectedId: string | null;
  onSelect: (categoryId: string) => void;
  loading?: boolean;
}

export default function CategorySelector({
  categories,
  selectedId,
  onSelect,
  loading = false,
}: CategorySelectorProps) {
  // Handle many categories (>9) with scrollable grid
  const hasManyCats = categories.length > 9;
  
  if (loading) {
    return (
      <div className="bg-white rounded-2xl mx-5 mb-4 p-4 shadow-sm animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-24 mb-4"></div>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-slate-200 rounded-xl"></div>
              <div className="h-3 bg-slate-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-2xl mx-5 mb-4 p-6 shadow-sm text-center">
        <p className="text-sm text-slate-500">No categories available</p>
        <p className="text-xs text-slate-400 mt-1">Please create categories in Budget page first</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl mx-5 mb-4 p-4 shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4">
        Pilih Kategori {hasManyCats && <span className="text-slate-300">({categories.length})</span>}
      </p>
      <div className={`grid grid-cols-3 gap-3 ${
        hasManyCats ? 'max-h-[280px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100' : ''
      }`}>
        {categories.map(category => {
          const Icon = getIconComponent(category.icon);
          const isSelected = selectedId === category.id;
          
          // Dynamic background color with opacity
          const bgColor = isSelected 
            ? `${category.color}20` 
            : '#f1f5f9'; // slate-100
          
          const borderColor = isSelected 
            ? category.color 
            : 'transparent';
          
          const iconColor = isSelected 
            ? category.color 
            : '#94a3b8'; // slate-400

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelect(category.id)}
              className="flex flex-col items-center gap-2 group active:scale-95 transition-transform"
            >
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center transition-all border-2"
                style={{ 
                  backgroundColor: bgColor,
                  borderColor: borderColor
                }}
              >
                <Icon 
                  className="w-7 h-7" 
                  strokeWidth={2}
                  style={{ color: iconColor }}
                />
              </div>
              <span
                className={`text-xs font-semibold text-center line-clamp-2 ${
                  isSelected ? 'text-slate-900' : 'text-slate-600'
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
