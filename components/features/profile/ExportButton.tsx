import React from 'react';

interface ExportButtonProps {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

export default function ExportButton({ label, icon, onClick }: ExportButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="flex-1 flex items-center justify-center gap-2 bg-gray-50 border-[1.5px] border-gray-200 rounded-xl px-3 py-3 text-[13px] font-bold text-gray-900 hover:bg-gray-100 transition-colors"
    >
      {icon}
      {label}
    </button>
  );
}
