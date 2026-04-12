'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface CategoryData {
  name: string;
  amount: number;
  color: string;
  percentage: number;
}

interface Recommendation {
  id: number;
  text: string;
  highlight: string;
}

export default function InsightPage() {
  const [activeTab, setActiveTab] = useState<'spending' | 'income'>('spending');

  const categories: CategoryData[] = [
    { name: 'Housing', amount: 1700, color: '#1a1a6e', percentage: 40 },
    { name: 'Food & Dining', amount: 1082, color: '#f0c040', percentage: 25.5 },
    { name: 'Entertainment', amount: 850, color: '#e07040', percentage: 20 },
    { name: 'Miscellaneous', amount: 638, color: '#d0d0e0', percentage: 14.5 }
  ];

  const recommendations: Recommendation[] = [
    {
      id: 1,
      text: 'Cancel unused Disney+ subscription to save',
      highlight: '$12.00/mo'
    },
    {
      id: 2,
      text: "Your utility costs rose by 15%. Switching to public transit 2 days/week could reduce expenses by",
      highlight: '$55.00/mo'
    },
    {
      id: 3,
      text: 'Refer a friend to unlock a',
      highlight: '$5.00 loyalty discount'
    }
  ];

  const barData = [
    { height: 45 },
    { height: 38 },
    { height: 52 },
    { height: 42 },
    { height: 60 },
    { height: 55, active: true }
  ];

  const totalCategoryAmount = categories.reduce((sum, cat) => sum + cat.amount, 0);

  return (
    <div className="min-h-screen bg-[#e4e4e8] flex justify-center py-5">
      <div className="w-[390px] bg-[#f2f2f5] rounded-[36px] overflow-hidden relative pb-[90px]">
        
        {/* Top Nav */}
        <div className="flex items-center justify-between px-5 pt-6 pb-3 bg-[#f2f2f5]">
          <div className="flex items-center gap-2">
            <div className="w-[34px] h-[34px] rounded-full bg-[#2a2a5e] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" fill="white"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-[15px] font-extrabold text-[#1a1a6e]">The Financial Architect</span>
          </div>
          <Link href="/notification">
            <button className="bg-transparent border-none cursor-pointer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="#1a1a6e" strokeWidth="2" strokeLinecap="round"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="#1a1a6e" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </Link>
        </div>

        {/* Scroll Body */}
        <div className="px-4">
          
          {/* Hero */}
          <div className="py-1 px-0.5 pb-4">
            <div className="text-[9px] font-bold text-gray-400 tracking-wide uppercase mb-1">Financial Analytics</div>
            <h1 className="text-[34px] font-black text-[#0d0d2b] leading-tight tracking-tight mb-2">
              Monthly<br />Insights
            </h1>
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] text-gray-500">October 2023</span>
              <div className="w-[22px] h-[22px] rounded-md bg-[#f0f0f5] flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="17" rx="2" stroke="#888" strokeWidth="2"/>
                  <line x1="3" y1="9" x2="21" y2="9" stroke="#888" strokeWidth="2"/>
                  <line x1="8" y1="2" x2="8" y2="6" stroke="#888" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="16" y1="2" x2="16" y2="6" stroke="#888" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Health Score */}
          <div className="bg-white rounded-[20px] p-[18px] mb-3.5">
            <div className="text-[13px] font-bold text-[#0d0d2b] mb-3.5">Health Score</div>
            <div className="relative w-[130px] h-[130px] mx-auto my-1 mb-3">
              <svg width="130" height="130" viewBox="0 0 130 130" className="-rotate-90">
                <circle cx="65" cy="65" r="54" fill="none" stroke="#e8f5ee" strokeWidth="10"/>
                <circle cx="65" cy="65" r="54" fill="none" stroke="#1a9e6e" strokeWidth="10"
                  strokeDasharray="339.3" strokeDashoffset="61" strokeLinecap="round"/>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-[30px] font-black text-[#0d0d2b] leading-none">82</div>
                <div className="text-[10px] font-bold text-[#1a9e6e] tracking-wide">EXCELLENT</div>
              </div>
            </div>
            <div className="text-xs text-gray-500 text-center leading-relaxed mt-1.5">
              Your score increased by 3 points this month due to improved savings rate.
            </div>
          </div>

          {/* Month-over-Month */}
          <div className="bg-white rounded-[20px] p-[18px] mb-3.5">
            <div className="text-[13px] font-bold text-[#0d0d2b] mb-3.5">Month-over-Month</div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-400">Total Spending</span>
              <span className="inline-flex items-center bg-[#ffe8e8] rounded-[20px] px-2 py-0.5 text-[11px] font-bold text-[#e74c3c]">
                -4.2%↑
              </span>
            </div>
            {/* Bar Chart */}
            <div className="flex gap-[5px] items-end h-[70px] mb-3">
              {barData.map((bar, idx) => (
                <div 
                  key={idx}
                  className={`flex-1 rounded-t-md ${bar.active ? 'bg-[#1a1a6e]' : 'bg-[#e8e8f0]'}`}
                  style={{ height: `${bar.height}px` }}
                />
              ))}
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <div className="text-[10px] text-gray-400 mb-0.5">SAVINGS GAP</div>
                <div className="text-base font-extrabold text-[#1a9e6e]">+$420.00</div>
              </div>
              <div className="w-px bg-[#f0f0f5]" />
              <div className="flex-1">
                <div className="text-[10px] text-gray-400 mb-0.5">DAILY AVG</div>
                <div className="text-base font-extrabold text-[#0d0d2b]">$137.09</div>
              </div>
            </div>
          </div>

          {/* Category Allocation */}
          <div className="bg-white rounded-[20px] p-[18px] mb-3.5">
            <div className="flex justify-between items-center mb-3.5">
              <div className="text-[13px] font-bold text-[#0d0d2b]">Category Allocation</div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#bbb" strokeWidth="2"/>
                <line x1="12" y1="8" x2="12" y2="12" stroke="#bbb" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="16" r="1" fill="#bbb"/>
              </svg>
            </div>

            {/* Donut Chart */}
            <div className="relative w-[150px] h-[150px] mx-auto mb-4">
              <svg width="150" height="150" viewBox="0 0 150 150">
                <circle cx="75" cy="75" r="55" fill="none" stroke="#1a1a6e" strokeWidth="22"
                  strokeDasharray="345.4" strokeDashoffset="0" transform="rotate(-90 75 75)"/>
                <circle cx="75" cy="75" r="55" fill="none" stroke="#f0c040" strokeWidth="22"
                  strokeDasharray="345.4" strokeDashoffset="-138.2" transform="rotate(-90 75 75)"/>
                <circle cx="75" cy="75" r="55" fill="none" stroke="#e07040" strokeWidth="22"
                  strokeDasharray="345.4" strokeDashoffset="-226.3" transform="rotate(-90 75 75)"/>
                <circle cx="75" cy="75" r="55" fill="none" stroke="#d0d0e0" strokeWidth="22"
                  strokeDasharray="345.4" strokeDashoffset="-295.4" transform="rotate(-90 75 75)"/>
                <circle cx="75" cy="75" r="44" fill="white"/>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-[9px] text-gray-400 font-semibold uppercase tracking-wide">TOTAL</div>
                <div className="text-lg font-black text-[#0d0d2b]">${totalCategoryAmount.toLocaleString()}</div>
              </div>
            </div>

            {/* Legend */}
            {categories.map((cat, idx) => (
              <div key={idx} className={`flex justify-between items-center py-2 ${idx < categories.length - 1 ? 'border-b border-[#f0f0f5]' : ''}`}>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                  <span className="text-[13px] text-gray-600 font-medium">{cat.name}</span>
                </div>
                <span className="text-[13px] font-bold text-[#0d0d2b]">${cat.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>

          {/* Smart Recommendations */}
          <div className="bg-[#1a1a6e] rounded-[20px] p-[18px] mb-3.5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-[34px] h-[34px] rounded-[10px] bg-white bg-opacity-15 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2a7 7 0 0 1 7 7c0 3-1.5 5-4 6.5V18H9v-2.5C6.5 14 5 12 5 9a7 7 0 0 1 7-7z" stroke="white" strokeWidth="2"/>
                  <line x1="9" y1="21" x2="15" y2="21" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-base font-extrabold text-white">Smart Recommendations</span>
            </div>
            {recommendations.map((rec) => (
              <div key={rec.id} className="flex gap-2 items-start mb-2.5">
                <div className="w-[18px] h-[18px] rounded-full border-[1.5px] border-white border-opacity-40 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg width="10" height="10" viewBox="0 0 12 12">
                    <path d="M2 6l3 3 5-5" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="text-xs text-white text-opacity-75 leading-relaxed">
                  {rec.text} <strong className="text-white">{rec.highlight}</strong> {rec.id === 1 ? 'immediately.' : ''}
                </p>
              </div>
            ))}
            <button className="w-full mt-3.5 py-3 px-4 rounded-[50px] bg-transparent border-[1.5px] border-white border-opacity-40 text-white text-[13px] font-bold cursor-pointer flex items-center justify-center gap-1.5 hover:bg-white hover:bg-opacity-10 transition-colors">
              Implement All Suggestions ✦
            </button>
          </div>

          {/* Monthly Spending Trend */}
          <div className="bg-white rounded-[20px] p-[18px] mb-3.5">
            <div className="text-[13px] font-bold text-[#0d0d2b] mb-3.5">Monthly Spending Trend</div>
            <p className="text-[11px] text-gray-400 mb-2.5">Historical data for the last 6 months</p>
            <div className="flex gap-2 mb-4">
              <button 
                onClick={() => setActiveTab('spending')}
                className={`px-4 py-1 rounded-[20px] text-xs font-bold cursor-pointer border-none transition-colors ${
                  activeTab === 'spending' ? 'bg-[#1a1a6e] text-white' : 'bg-[#f0f0f5] text-gray-400'
                }`}
              >
                Spending
              </button>
              <button 
                onClick={() => setActiveTab('income')}
                className={`px-4 py-1 rounded-[20px] text-xs font-bold cursor-pointer border-none transition-colors ${
                  activeTab === 'income' ? 'bg-[#1a1a6e] text-white' : 'bg-[#f0f0f5] text-gray-400'
                }`}
              >
                Income
              </button>
            </div>
            {/* SVG Chart */}
            <svg className="w-full h-[110px] mb-2.5" viewBox="0 0 320 110" preserveAspectRatio="none">
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1a1a6e" stopOpacity="0.15"/>
                  <stop offset="100%" stopColor="#1a1a6e" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <path d="M0,70 C30,65 50,40 80,50 C110,60 130,30 160,45 C190,60 210,25 240,35 C270,45 295,55 320,40"
                fill="none" stroke="#1a1a6e" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M0,70 C30,65 50,40 80,50 C110,60 130,30 160,45 C190,60 210,25 240,35 C270,45 295,55 320,40 L320,110 L0,110 Z"
                fill="url(#grad)"/>
            </svg>
            <div className="flex justify-between text-[10px] text-[#bbb] font-semibold tracking-wide px-0.5">
              <span>MAY</span><span>JUN</span><span>JUL</span><span>AUG</span><span>SEP</span><span>OCT</span>
            </div>
          </div>

          {/* Total Savings */}
          <div className="bg-[#e8f8f0] rounded-[20px] p-4 px-[18px] mb-3.5">
            <div className="text-[9px] font-bold text-[#1a9e6e] tracking-wide uppercase mb-1">● Total Savings</div>
            <div className="text-[28px] font-black text-[#0d0d2b] tracking-tight mb-1">$12,450.00</div>
            <div className="text-xs text-[#1a9e6e] font-semibold flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" stroke="#1a9e6e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              +12.5% vs last month
            </div>
          </div>

          {/* Expense Target */}
          <div className="bg-[#fff0f0] rounded-[20px] p-4 px-[18px] mb-3.5">
            <div className="text-[9px] font-bold text-[#e74c3c] tracking-wide uppercase mb-1">● Expense Target</div>
            <div className="text-[28px] font-black text-[#0d0d2b] tracking-tight mb-1">$3,200.00</div>
            <div className="h-1.5 bg-[#f0f0f5] rounded-sm my-2 mb-1 overflow-hidden">
              <div className="h-full rounded-sm bg-[#e74c3c]" style={{ width: '85%' }} />
            </div>
            <div className="text-[11px] text-gray-400">85% of monthly limit used</div>
          </div>

          {/* Projected Net */}
          <div className="bg-[#f2f2f5] rounded-[20px] p-4 px-[18px] mb-3.5">
            <div className="text-[9px] font-bold text-gray-400 tracking-wide uppercase mb-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="inline align-middle mr-1">
                <polyline points="3,18 8,12 13,15 18,8 21,11" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Projected Net
            </div>
            <div className="text-[28px] font-black text-[#1a9e6e] tracking-tight mb-1">+$2,104.50</div>
            <div className="text-xs text-gray-500 leading-relaxed">
              Based on your recurring income and current spending velocity.
            </div>
          </div>

          <div className="h-2" />
        </div>

        {/* Bottom Nav */}
        <div className="absolute bottom-0 left-0 right-0 bg-white py-2.5 pb-[22px] flex justify-around items-center border-t border-gray-200 rounded-b-[36px]">
          <Link href="/dashboard" className="flex flex-col items-center gap-0.5 cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 12L12 3l9 9" stroke="#bbb" strokeWidth="2" strokeLinecap="round"/>
              <rect x="6" y="12" width="12" height="10" rx="1" stroke="#bbb" strokeWidth="2"/>
            </svg>
            <span className="text-[9px] font-semibold tracking-wide text-[#bbb] uppercase">Home</span>
          </Link>
          <Link href="/activity" className="flex flex-col items-center gap-0.5 cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="#bbb" strokeWidth="2"/>
              <path d="M3 9h18M9 21V9" stroke="#bbb" strokeWidth="2"/>
            </svg>
            <span className="text-[9px] font-semibold tracking-wide text-[#bbb] uppercase">Ledger</span>
          </Link>
          <Link href="/assistant" className="flex flex-col items-center gap-0.5 cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="8" stroke="#bbb" strokeWidth="2"/>
              <path d="M9 12l2 2 4-4" stroke="#bbb" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="text-[9px] font-semibold tracking-wide text-[#bbb] uppercase">Assistant</span>
          </Link>
          <div className="flex flex-col items-center gap-0.5 cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <polyline points="3,18 8,12 13,15 18,8 21,11" stroke="#1a1a6e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-[9px] font-semibold tracking-wide text-[#1a1a6e] uppercase">Charts</span>
          </div>
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
