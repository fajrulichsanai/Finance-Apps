import React from 'react';

interface SectionProps {
  label: string;
  children: React.ReactNode;
}

export default function Section({ label, children }: SectionProps) {
  return (
    <div className="mb-4 animate-fade-up">
      <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-2.5">
        {label}
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-[18px] shadow-sm overflow-hidden transition-colors">
        {children}
      </div>
    </div>
  );
}
