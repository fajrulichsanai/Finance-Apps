// =====================================================
// FINANCE APP - Activity Page
// =====================================================

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import AppHeader from '@/components/shared/AppHeader';
import BottomNav from '@/components/shared/BottomNav';
import ActivitySearchBar from '@/components/features/activity/ActivitySearchBar';
import TransactionSection from '@/components/features/activity/TransactionSection';
import { useTransactions } from '@/lib/hooks/useTransactions';
import { ActivitySection, ActivityTransaction, TransactionIconType } from '@/types';

export default function ActivityPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const { transactions, loading, error, refresh } = useTransactions();

  // Debounce search query (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Utility function to get local date string (YYYY-MM-DD)
  const getLocalDateString = (date: Date): string => {
    return date.toLocaleDateString('en-CA');
  };

  // Group transactions by date sections
  const groupedSections = useMemo((): ActivitySection[] => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // FIX: Use local date instead of UTC to prevent timezone issues
    const todayStr = getLocalDateString(today);
    const yesterdayStr = getLocalDateString(yesterday);
    const sevenDaysAgoStr = getLocalDateString(sevenDaysAgo);

    const todayTxns: ActivityTransaction[] = [];
    const yesterdayTxns: ActivityTransaction[] = [];
    const thisWeekTxns: ActivityTransaction[] = [];
    const olderTxns: ActivityTransaction[] = [];

    // FIX: Map category icons for better UX
    const iconMap: Record<string, TransactionIconType> = {
      'food': 'food',
      'transport': 'transport',
      'shopping': 'shopping',
      'bills': 'bills',
      'health': 'health'
    };

    transactions.forEach(txn => {
      // FIX: Use local date string for consistency
      const txnDateObj = new Date(txn.transaction_date);
      const txnDate = getLocalDateString(txnDateObj);
      const txnTime = txnDateObj.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });

      // FIX: Assign proper icon based on category, fallback to money for income
      const iconType: TransactionIconType = txn.type === 'income' 
        ? 'money' 
        : (txn.category_icon ? iconMap[txn.category_icon] : 'money') || 'money';

      const activityTxn: ActivityTransaction = {
        id: txn.id,
        name: txn.description || 'Tidak ada deskripsi',
        category: txn.type === 'income' ? 'Pemasukan' : (txn.category_name || 'Tanpa Kategori'),
        description: txn.note || '',
        amount: txn.amount,
        time: txnTime,
        type: txn.type,
        icon: iconType
      };

      if (txnDate === todayStr) {
        todayTxns.push(activityTxn);
      } else if (txnDate === yesterdayStr) {
        yesterdayTxns.push(activityTxn);
      } else if (txnDateObj >= sevenDaysAgo) {
        thisWeekTxns.push(activityTxn);
      } else {
        olderTxns.push(activityTxn);
      }
    });

    const sections: ActivitySection[] = [];
    
    if (todayTxns.length > 0) {
      sections.push({ label: 'Hari Ini', date: todayStr, transactions: todayTxns });
    }
    if (yesterdayTxns.length > 0) {
      sections.push({ label: 'Kemarin', date: yesterdayStr, transactions: yesterdayTxns });
    }
    if (thisWeekTxns.length > 0) {
      sections.push({ label: 'Minggu Ini', date: '', transactions: thisWeekTxns });
    }
    if (olderTxns.length > 0) {
      sections.push({ label: 'Lebih Lama', date: '', transactions: olderTxns });
    }

    return sections;
  }, [transactions]);

  // Filter transactions based on debounced search query
  const filteredSections = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return groupedSections;
    }

    const query = debouncedQuery.toLowerCase();
    
    return groupedSections
      .map((section) => ({
        ...section,
        transactions: section.transactions.filter(
          (txn) =>
            txn.name.toLowerCase().includes(query) ||
            txn.category.toLowerCase().includes(query) ||
            txn.description.toLowerCase().includes(query)
        ),
      }))
      .filter((section) => section.transactions.length > 0);
  }, [debouncedQuery, groupedSections]);

  // FIX: Display error state
  if (error && !loading) {
    return (
      <div className="min-h-screen bg-[#f2f2f4] relative pb-24">
        <div className="w-full max-w-[430px] mx-auto">
          <AppHeader />
          <div className="px-[18px] py-8">
            <div className="text-center space-y-4">
              <div className="text-red-500 font-semibold text-lg">⚠️ Gagal memuat transaksi</div>
              <p className="text-gray-600 text-sm">{error.message}</p>
              <button 
                onClick={refresh}
                className="mt-4 px-6 py-2.5 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          </div>
          <BottomNav />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f2f2f4] relative pb-24">
        <div className="w-full max-w-[430px] mx-auto">
          <AppHeader />
          <div className="px-[18px] py-8">
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-white rounded-lg p-4 shadow-sm animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </div>
                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <BottomNav />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2f2f4] relative pb-24">
      <div className="w-full max-w-[430px] mx-auto">
        <AppHeader />
        
        <ActivitySearchBar 
          value={searchQuery} 
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />

        <div className="px-[18px]">
          {filteredSections.length > 0 ? (
            filteredSections.map((section, index) => (
              <TransactionSection
                key={`${section.label}-${section.date}-${section.transactions[0]?.id}`}
                section={section}
                isLast={index === filteredSections.length - 1}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-sm">Tidak ada transaksi ditemukan</p>
            </div>
          )}
        </div>

        <BottomNav />
      </div>
    </div>
  );
}