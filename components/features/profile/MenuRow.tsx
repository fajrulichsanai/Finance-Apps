import React from 'react';
import { ChevronRight } from 'lucide-react';

interface MenuRowProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  badge?: string;
  onClick: () => void;
  hasBorder?: boolean;
}

export default function MenuRow({ 
  icon, 
  title, 
  subtitle, 
  badge, 
  onClick, 
  hasBorder 
}: MenuRowProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors ${
        hasBorder ? 'border-t border-gray-100' : ''
      }`}
    >
      <div className="w-[42px] h-[42px] rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
        <div className="text-blue-900">{icon}</div>
      </div>
      
      <div className="flex-1 text-left">
        <div className="text-sm font-bold text-gray-900 mb-0.5">
          {title}
        </div>
        <div className="text-[11.5px] text-gray-400 font-medium leading-tight">
          {subtitle}
        </div>
      </div>
      
      <div className="flex items-center gap-1.5">
        {badge && (
          <span className="text-[10px] font-extrabold tracking-wide text-green-500 uppercase">
            {badge}
          </span>
        )}
        <ChevronRight className="w-4 h-4 text-gray-400" strokeWidth={2.5} />
      </div>
    </button>
  );
}
