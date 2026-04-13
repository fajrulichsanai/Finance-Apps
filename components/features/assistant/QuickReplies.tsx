import React from 'react';

interface QuickRepliesProps {
  suggestions: readonly string[];
  onSelect: (suggestion: string) => void;
}

export default function QuickReplies({ suggestions, onSelect }: QuickRepliesProps) {
  return (
    <div className="flex gap-2 px-4 py-1.5 pb-2.5 overflow-x-auto scrollbar-hide">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion}
          onClick={() => onSelect(suggestion)}
          className="whitespace-nowrap bg-white border-[1.5px] border-slate-200 rounded-full px-4 py-2 text-[12.5px] font-semibold text-slate-900 hover:bg-[#12205e] hover:text-white hover:border-[#12205e] transition-all"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}
