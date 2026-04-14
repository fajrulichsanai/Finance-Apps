import React from 'react';

interface ProfileBadgeProps {
  variant: 'elite' | 'sync';
  children: React.ReactNode;
}

export default function ProfileBadge({ variant, children }: ProfileBadgeProps) {
  const variantStyles = {
    elite: 'border-green-500 text-green-500',
    sync: 'border-gray-400 text-gray-400',
  };

  return (
    <span className={`px-3 py-1 rounded-full border-[1.5px] text-[10px] font-extrabold tracking-wide uppercase ${variantStyles[variant]}`}>
      {children}
    </span>
  );
}
