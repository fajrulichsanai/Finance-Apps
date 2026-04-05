'use client';

import React, { useState, useEffect } from 'react';
import { 
  Moon, Sun, Bell, ArrowUpRight, ArrowDownRight, 
  Wallet, Coffee, Car, Home, ShoppingBag, Zap,
  ChevronRight, MoreHorizontal, PieChart as PieChartIcon
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
  PieChart, Pie, Sector
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

// --- Mock Data ---
const balanceData = [
  { name: 'Mon', value: 12400 },
  { name: 'Tue', value: 12200 },
  { name: 'Wed', value: 13500 },
  { name: 'Thu', value: 13100 },
  { name: 'Fri', value: 14200 },
  { name: 'Sat', value: 14000 },
  { name: 'Sun', value: 14850 },
];

const monthlyData = [
  { name: 'Jan', income: 4000, expense: 2400 },
  { name: 'Feb', income: 3000, expense: 1398 },
  { name: 'Mar', income: 2000, expense: 9800 },
  { name: 'Apr', income: 2780, expense: 3908 },
  { name: 'May', income: 1890, expense: 4800 },
  { name: 'Jun', income: 2390, expense: 3800 },
];

const categoryData = [
  { name: 'Housing', value: 1200, color: '#3b82f6', icon: Home },
  { name: 'Food', value: 450, color: '#60a5fa', icon: Coffee },
  { name: 'Transport', value: 300, color: '#93c5fd', icon: Car },
  { name: 'Shopping', value: 250, color: '#bfdbfe', icon: ShoppingBag },
  { name: 'Utilities', value: 150, color: '#dbeafe', icon: Zap },
];

const transactions = [
  { id: 1, name: 'Starbucks', category: 'Food & Drink', amount: -5.40, date: 'Today, 09:41 AM', icon: Coffee, color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' },
  { id: 2, name: 'Uber', category: 'Transport', amount: -12.50, date: 'Today, 08:15 AM', icon: Car, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
  { id: 3, name: 'Salary', category: 'Income', amount: 4250.00, date: 'Yesterday', icon: Wallet, color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' },
  { id: 4, name: 'Apple Store', category: 'Shopping', amount: -99.00, date: 'Yesterday', icon: ShoppingBag, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
  { id: 5, name: 'Electric Bill', category: 'Utilities', amount: -145.20, date: 'Oct 24', icon: Zap, color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' },
];

export default function HomePage() {
  const [isDark, setIsDark] = useState(false);
  const [activeTab, setActiveTab] = useState<'trend' | 'monthly' | 'categories'>('trend');

  // Toggle dark mode class on html element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-4 sm:p-8 transition-colors duration-300">
      
      {/* Mobile Device Container */}
      <div className="w-full max-w-[400px] h-[850px] max-h-[95vh] bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden relative flex flex-col border-[8px] border-white dark:border-slate-800 transition-colors duration-300">
        
        {/* Top Gradient Background */}
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-blue-600/10 to-transparent dark:from-blue-500/10 pointer-events-none" />

        {/* Header */}
        <header className="px-6 pt-10 pb-4 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 p-[2px]">
              <img 
                src="https://picsum.photos/seed/avatar/100/100" 
                alt="Profile" 
                className="w-full h-full rounded-full border-2 border-white dark:border-slate-900 object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Good Morning,</p>
              <h1 className="text-sm font-bold text-slate-900 dark:text-white">Alex Morgan</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsDark(!isDark)}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-slate-800 shadow-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-slate-800 shadow-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800" />
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-24 relative z-10">
          
          {/* Total Balance */}
          <section className="px-6 py-4">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Total Balance</p>
            <div className="flex items-end gap-2">
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">$14,850.00</h2>
              <span className="text-sm font-medium text-emerald-500 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-1 rounded-lg mb-1 flex items-center">
                <ArrowUpRight size={14} className="mr-0.5" /> 2.4%
              </span>
            </div>
          </section>

          {/* Income / Expense Cards */}
          <section className="px-6 py-2 flex gap-4">
            <div className="flex-1 bg-white dark:bg-slate-800/80 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <ArrowDownRight size={16} />
                </div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Income</span>
              </div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">$4,250.00</p>
            </div>
            <div className="flex-1 bg-white dark:bg-slate-800/80 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center text-red-600 dark:text-red-400">
                  <ArrowUpRight size={16} />
                </div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Expense</span>
              </div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">$2,140.50</p>
            </div>
          </section>

          {/* Analytics Section */}
          <section className="mt-6">
            <div className="px-6 flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Analytics</h3>
              <div className="bg-slate-200/50 dark:bg-slate-800 p-1 rounded-xl flex text-xs font-medium">
                <button 
                  onClick={() => setActiveTab('trend')}
                  className={cn("px-3 py-1.5 rounded-lg transition-all", activeTab === 'trend' ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400")}
                >
                  Trend
                </button>
                <button 
                  onClick={() => setActiveTab('monthly')}
                  className={cn("px-3 py-1.5 rounded-lg transition-all", activeTab === 'monthly' ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400")}
                >
                  Monthly
                </button>
                <button 
                  onClick={() => setActiveTab('categories')}
                  className={cn("px-3 py-1.5 rounded-lg transition-all", activeTab === 'categories' ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400")}
                >
                  Categories
                </button>
              </div>
            </div>

            {/* Chart Container */}
            <div className="h-[220px] w-full px-2">
              <AnimatePresence mode="wait">
                {activeTab === 'trend' && (
                  <motion.div 
                    key="trend"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="w-full h-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={balanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1e293b' : '#e2e8f0'} />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 12, fill: isDark ? '#94a3b8' : '#64748b' }} 
                          dy={10}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 12, fill: isDark ? '#94a3b8' : '#64748b' }}
                          tickFormatter={(value) => `$${value/1000}k`}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: isDark ? '#0f172a' : '#ffffff',
                            borderRadius: '12px',
                            border: 'none',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                            color: isDark ? '#f8fafc' : '#0f172a'
                          }}
                          itemStyle={{ color: '#2563eb', fontWeight: 'bold' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#2563eb" 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#colorBalance)" 
                          activeDot={{ r: 6, fill: '#2563eb', stroke: '#ffffff', strokeWidth: 2 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </motion.div>
                )}

                {activeTab === 'monthly' && (
                  <motion.div 
                    key="monthly"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="w-full h-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1e293b' : '#e2e8f0'} />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 12, fill: isDark ? '#94a3b8' : '#64748b' }} 
                          dy={10}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 12, fill: isDark ? '#94a3b8' : '#64748b' }}
                          tickFormatter={(value) => `$${value/1000}k`}
                        />
                        <Tooltip 
                          cursor={{ fill: isDark ? '#1e293b' : '#f1f5f9' }}
                          contentStyle={{ 
                            backgroundColor: isDark ? '#0f172a' : '#ffffff',
                            borderRadius: '12px',
                            border: 'none',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                          }}
                        />
                        <Bar dataKey="income" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={12} />
                        <Bar dataKey="expense" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={12} />
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                )}

                {activeTab === 'categories' && (
                  <motion.div 
                    key="categories"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="w-full h-full flex items-center justify-center"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: isDark ? '#0f172a' : '#ffffff',
                            borderRadius: '12px',
                            border: 'none',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                          }}
                          itemStyle={{ color: isDark ? '#f8fafc' : '#0f172a', fontWeight: '500' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>

          {/* Categories Breakdown (Only show if categories tab is active, or maybe always show a mini version?) */}
          {activeTab === 'categories' && (
            <motion.section 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="px-6 mt-4"
            >
              <div className="grid grid-cols-2 gap-3">
                {categoryData.slice(0,4).map((cat, i) => (
                  <div key={i} className="bg-white dark:bg-slate-800/80 rounded-2xl p-3 flex items-center gap-3 shadow-sm border border-slate-100 dark:border-slate-700/50">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${cat.color}20`, color: cat.color }}>
                      <cat.icon size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{cat.name}</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">${cat.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Recent Transactions */}
          <section className="px-6 mt-8 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
              <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors">
                See All
              </button>
            </div>
            
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105", tx.color)}>
                      <tx.icon size={20} />
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-slate-900 dark:text-white">{tx.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn("text-base font-bold", tx.amount > 0 ? "text-emerald-500" : "text-slate-900 dark:text-white")}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{tx.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Bottom Navigation Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 flex items-center justify-around px-6 z-20">
          <button className="flex flex-col items-center gap-1 text-blue-600 dark:text-blue-500">
            <Home size={24} />
            <span className="text-[10px] font-medium">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            <PieChartIcon size={24} />
            <span className="text-[10px] font-medium">Stats</span>
          </button>
          
          {/* Floating Action Button */}
          <div className="relative -top-6">
            <button className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 flex items-center justify-center transition-transform hover:scale-105">
              <div className="w-6 h-6 relative">
                <div className="absolute inset-0 bg-white rounded-sm w-0.5 h-full left-1/2 -translate-x-1/2" />
                <div className="absolute inset-0 bg-white rounded-sm h-0.5 w-full top-1/2 -translate-y-1/2" />
              </div>
            </button>
          </div>

          <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            <Wallet size={24} />
            <span className="text-[10px] font-medium">Cards</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            <MoreHorizontal size={24} />
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>

      </div>
    </div>
  );
}
