import React from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder?: string;
}

export default function ChatInput({ 
  value, 
  onChange, 
  onSend,
  placeholder = 'Ask Stitch anything…'
}: ChatInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="bg-white border-t border-slate-200 px-4 py-2.5 flex items-center gap-2.5">
      <input 
        type="text" 
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        className="flex-1 bg-slate-50 border-0 outline-none rounded-full px-4 py-2.5 text-[13px] text-slate-900 placeholder:text-gray-400"
      />
      
      <button 
        onClick={onSend}
        disabled={!value.trim()}
        className="w-10 h-10 bg-[#12205e] rounded-full flex items-center justify-center hover:opacity-85 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Send size={18} className="text-white" />
      </button>
    </div>
  );
}
