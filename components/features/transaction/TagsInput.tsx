// =====================================================
// FINANCE APP - Tags Input Component
// =====================================================

'use client';

import { X, Plus } from 'lucide-react';
import { useState } from 'react';

interface TagsInputProps {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

export default function TagsInput({ tags, onAddTag, onRemoveTag }: TagsInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAddTag(inputValue);
      setInputValue('');
      setIsAdding(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="px-5 pb-4">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
        Tags
      </p>
      <div className="flex flex-wrap gap-2 items-center">
        {tags.map(tag => (
          <div
            key={tag}
            className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-full px-3 py-1.5 text-xs font-semibold text-slate-700"
          >
            {tag}
            <button
              type="button"
              onClick={() => onRemoveTag(tag)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
              aria-label={`Remove ${tag}`}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {isAdding ? (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            onBlur={handleAdd}
            placeholder="Masukkan tag..."
            autoFocus
            className="bg-white border border-indigo-300 rounded-full px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500 min-w-[100px]"
          />
        ) : (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 border border-dashed border-slate-300 rounded-full px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-indigo-900 hover:border-indigo-900 transition-colors"
          >
            <Plus className="w-3 h-3" />
            Add Tag
          </button>
        )}
      </div>
    </div>
  );
}
