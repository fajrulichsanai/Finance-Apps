'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Transaction {
  id: string;
  name: string;
  category: string;
  description: string;
  amount: number;
  time: string;
  type: 'expense' | 'income';
  icon: 'food' | 'money' | 'transport' | 'shopping' | 'bills' | 'health';
}

interface TransactionSection {
  label: string;
  date: string;
  transactions: Transaction[];
}

export default function ActivityPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const transactionSections: TransactionSection[] = [
    {
      label: 'Today',
      date: 'Oct 24, 2023',
      transactions: [
        {
          id: '1',
          name: 'Blueberry Hill Bistro',
          category: 'Food & Dining',
          description: 'Breakfast with client',
          amount: -42.50,
          time: '10:24 AM',
          type: 'expense',
          icon: 'food'
        },
        {
          id: '2',
          name: 'Stripe Dividend',
          category: 'Income',
          description: 'Investment yield',
          amount: 1240.00,
          time: '09:15 AM',
          type: 'income',
          icon: 'money'
        }
      ]
    },
    {
      label: 'Yesterday',
      date: 'Oct 23, 2023',
      transactions: [
        {
          id: '3',
          name: 'Uber Technologies',
          category: 'Transport',
          description: 'Commute to office',
          amount: -18.20,
          time: '06:45 PM',
          type: 'expense',
          icon: 'transport'
        },
        {
          id: '4',
          name: 'Apple Store Soho',
          category: 'Electronics',
          description: 'MagSafe Charger',
          amount: -53.00,
          time: '02:30 PM',
          type: 'expense',
          icon: 'shopping'
        },
        {
          id: '5',
          name: 'ConEd Utility',
          category: 'Bills',
          description: 'Monthly Electricity',
          amount: -115.40,
          time: '11:00 AM',
          type: 'expense',
          icon: 'bills'
        }
      ]
    },
    {
      label: 'October 22',
      date: 'Sun',
      transactions: [
        {
          id: '6',
          name: 'Equinox Gym',
          category: 'Health',
          description: 'Membership',
          amount: -220.00,
          time: '08:00 AM',
          type: 'expense',
          icon: 'health'
        }
      ]
    }
  ];

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'food':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M18 8h1a4 4 0 0 1 0 8h-1" stroke="#1a1a6e" strokeWidth="2" strokeLinecap="round"/>
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" stroke="#1a1a6e" strokeWidth="2"/>
            <line x1="6" y1="1" x2="6" y2="4" stroke="#1a1a6e" strokeWidth="2" strokeLinecap="round"/>
            <line x1="10" y1="1" x2="10" y2="4" stroke="#1a1a6e" strokeWidth="2" strokeLinecap="round"/>
            <line x1="14" y1="1" x2="14" y2="4" stroke="#1a1a6e" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      case 'money':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="5" width="20" height="14" rx="3" stroke="#1a9e6e" strokeWidth="2"/>
            <path d="M2 10h20" stroke="#1a9e6e" strokeWidth="2"/>
            <circle cx="12" cy="15" r="2" fill="#1a9e6e"/>
          </svg>
        );
      case 'transport':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="10" width="20" height="8" rx="2" stroke="#1a1a6e" strokeWidth="2"/>
            <path d="M5 10V7a7 7 0 0 1 14 0v3" stroke="#1a1a6e" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="7" cy="18" r="2" fill="#1a1a6e"/>
            <circle cx="17" cy="18" r="2" fill="#1a1a6e"/>
          </svg>
        );
      case 'shopping':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" stroke="#1a1a6e" strokeWidth="2" strokeLinejoin="round"/>
            <line x1="3" y1="6" x2="21" y2="6" stroke="#1a1a6e" strokeWidth="2"/>
            <path d="M16 10a4 4 0 0 1-8 0" stroke="#1a1a6e" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      case 'bills':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="18" height="16" rx="2" stroke="#1a1a6e" strokeWidth="2"/>
            <line x1="3" y1="9" x2="21" y2="9" stroke="#1a1a6e" strokeWidth="2"/>
            <line x1="8" y1="4" x2="8" y2="9" stroke="#1a1a6e" strokeWidth="2"/>
            <line x1="16" y1="4" x2="16" y2="9" stroke="#1a1a6e" strokeWidth="2"/>
            <rect x="7" y="13" width="4" height="3" rx="1" fill="#1a1a6e"/>
          </svg>
        );
      case 'health':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M6.5 6.5L17.5 17.5M17.5 6.5L6.5 17.5" stroke="#1a1a6e" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="4" cy="12" r="2" stroke="#1a1a6e" strokeWidth="2"/>
            <circle cx="20" cy="12" r="2" stroke="#1a1a6e" strokeWidth="2"/>
            <circle cx="8" cy="6.5" r="1.5" stroke="#1a1a6e" strokeWidth="1.8"/>
            <circle cx="16" cy="17.5" r="1.5" stroke="#1a1a6e" strokeWidth="1.8"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f2f4] relative pb-[90px]">
      <div className="w-full max-w-[430px] mx-auto">
        
        {/* Top Nav */}
        <div className="flex items-center justify-between px-[22px] pt-6 pb-4 bg-[#f2f2f4]">
          <div className="flex items-center gap-2.5">
            <div className="w-[38px] h-[38px] rounded-full bg-[#2a2a5e] flex items-center justify-center overflow-hidden">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" fill="white"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-[17px] font-extrabold text-[#1a1a6e]">The Financial Architect</span>
          </div>
          <Link href="/notification">
            <button className="w-9 h-9 rounded-full bg-transparent border-none cursor-pointer flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="#1a1a6e" strokeWidth="2" strokeLinecap="round"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="#1a1a6e" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="px-[18px] py-1 pb-5">
          <div className="bg-white rounded-[50px] px-4 py-3 flex items-center gap-2.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="#bbb" strokeWidth="2"/>
              <path d="M16.5 16.5L21 21" stroke="#bbb" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input 
              type="text" 
              placeholder="Search transactions..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-none outline-none text-sm text-gray-400 bg-transparent"
            />
            <div className="flex gap-1.5 items-center">
              <button className="w-8 h-8 rounded-full bg-[#f2f2f5] flex items-center justify-center cursor-pointer border-none">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M4 6h16M7 12h10M10 18h4" stroke="#666" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              <button className="w-8 h-8 rounded-full bg-[#f2f2f5] flex items-center justify-center cursor-pointer border-none">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3v18M3 8l9-5 9 5" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Body */}
        <div className="px-[18px]">
          {transactionSections.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              {/* Section Header */}
              <div className="flex justify-between items-baseline mb-3">
                <span className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">{section.label}</span>
                <span className="text-xs font-semibold text-gray-400">{section.date}</span>
              </div>

              {/* Transaction Cards */}
              {section.transactions.map((txn) => (
                <div key={txn.id} className="bg-white rounded-[18px] p-3.5 px-4 mb-2.5 flex items-start gap-3">
                  <div className={`w-[46px] h-[46px] rounded-[14px] flex items-center justify-center flex-shrink-0 ${
                    txn.type === 'income' ? 'bg-[#e6f9f0]' : 'bg-[#f0f0f5]'
                  }`}>
                    {getIcon(txn.icon)}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-[#0d0d2b] mb-0.5">{txn.name}</div>
                    <div className="text-xs text-gray-400 leading-relaxed">
                      {txn.category} • {txn.description}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`text-[15px] font-bold mb-1 ${
                      txn.type === 'income' ? 'text-[#1a9e6e]' : 'text-[#0d0d2b]'
                    }`}>
                      {txn.type === 'income' ? '+' : '-'}${Math.abs(txn.amount).toFixed(2)}
                    </div>
                    <div className="text-[11px] text-[#bbb]">{txn.time}</div>
                  </div>
                </div>
              ))}

              {sectionIdx < transactionSections.length - 1 && <div className="h-[18px]" />}
            </div>
          ))}
          <div className="h-2" />
        </div>

        {/* Bottom Nav */}
        <div className="absolute bottom-0 left-0 right-0 bg-white py-2.5 pb-[22px] flex justify-around items-center border-t border-gray-200">
          <Link href="/dashboard" className="flex flex-col items-center gap-0.5 cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 12L12 3l9 9" stroke="#bbb" strokeWidth="2" strokeLinecap="round"/>
              <rect x="6" y="12" width="12" height="10" rx="1" stroke="#bbb" strokeWidth="2"/>
            </svg>
            <span className="text-[9px] font-semibold tracking-wide text-[#bbb] uppercase">Home</span>
          </Link>

          <div className="w-[52px] h-[52px] rounded-full bg-[#1a1a6e] flex items-center justify-center -mt-5 shadow-[0_4px_16px_rgba(26,26,110,0.3)]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="white" strokeWidth="2"/>
              <path d="M3 9h18M9 21V9" stroke="white" strokeWidth="2"/>
            </svg>
          </div>

          <Link href="/statistics" className="flex flex-col items-center gap-0.5 cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <polyline points="3,18 8,12 13,15 18,8 21,11" stroke="#bbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-[9px] font-semibold tracking-wide text-[#bbb] uppercase">Insights</span>
          </Link>

          <Link href="/profile" className="flex flex-col items-center gap-0.5 cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="#bbb" strokeWidth="2"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#bbb" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="text-[9px] font-semibold tracking-wide text-[#bbb] uppercase">Profile</span>
          </Link>
        </div>

      </div>
    </div>
  );
}