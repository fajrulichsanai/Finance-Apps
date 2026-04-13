// =====================================================
// FINANCE APP - Transaction Icon Component
// =====================================================

import React from 'react';
import { TransactionIconType } from '@/types';

interface TransactionIconProps {
  iconType: TransactionIconType;
  className?: string;
}

export default function TransactionIcon({ iconType, className = "w-[22px] h-[22px]" }: TransactionIconProps) {
  const icons: Record<TransactionIconType, React.JSX.Element> = {
    food: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" stroke="#1a1a6e" strokeWidth="2" strokeLinecap="round"/>
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" stroke="#1a1a6e" strokeWidth="2"/>
        <line x1="6" y1="1" x2="6" y2="4" stroke="#1a1a6e" strokeWidth="2" strokeLinecap="round"/>
        <line x1="10" y1="1" x2="10" y2="4" stroke="#1a1a6e" strokeWidth="2" strokeLinecap="round"/>
        <line x1="14" y1="1" x2="14" y2="4" stroke="#1a1a6e" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    money: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={className}>
        <rect x="2" y="5" width="20" height="14" rx="3" stroke="#1a9e6e" strokeWidth="2"/>
        <path d="M2 10h20" stroke="#1a9e6e" strokeWidth="2"/>
        <circle cx="12" cy="15" r="2" fill="#1a9e6e"/>
      </svg>
    ),
    transport: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={className}>
        <rect x="2" y="10" width="20" height="8" rx="2" stroke="#1a1a6e" strokeWidth="2"/>
        <path d="M5 10V7a7 7 0 0 1 14 0v3" stroke="#1a1a6e" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="7" cy="18" r="2" fill="#1a1a6e"/>
        <circle cx="17" cy="18" r="2" fill="#1a1a6e"/>
      </svg>
    ),
    shopping: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" stroke="#1a1a6e" strokeWidth="2" strokeLinejoin="round"/>
        <line x1="3" y1="6" x2="21" y2="6" stroke="#1a1a6e" strokeWidth="2"/>
        <path d="M16 10a4 4 0 0 1-8 0" stroke="#1a1a6e" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    bills: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={className}>
        <rect x="3" y="4" width="18" height="16" rx="2" stroke="#1a1a6e" strokeWidth="2"/>
        <line x1="3" y1="9" x2="21" y2="9" stroke="#1a1a6e" strokeWidth="2"/>
        <line x1="8" y1="4" x2="8" y2="9" stroke="#1a1a6e" strokeWidth="2"/>
        <line x1="16" y1="4" x2="16" y2="9" stroke="#1a1a6e" strokeWidth="2"/>
        <rect x="7" y="13" width="4" height="3" rx="1" fill="#1a1a6e"/>
      </svg>
    ),
    health: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M6.5 6.5L17.5 17.5M17.5 6.5L6.5 17.5" stroke="#1a1a6e" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="4" cy="12" r="2" stroke="#1a1a6e" strokeWidth="2"/>
        <circle cx="20" cy="12" r="2" stroke="#1a1a6e" strokeWidth="2"/>
        <circle cx="8" cy="6.5" r="1.5" stroke="#1a1a6e" strokeWidth="1.8"/>
        <circle cx="16" cy="17.5" r="1.5" stroke="#1a1a6e" strokeWidth="1.8"/>
      </svg>
    )
  };

  return icons[iconType] || null;
}
