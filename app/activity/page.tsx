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
  const [dateRange, setDateRange] = useState<{ start: string | null; end: string | null }>({ start: null, end: null });
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { transactions, loading, error, refresh, deleteTransaction } = useTransactions();

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

  // Handle transaction deletion
  const handleDeleteTransaction = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteTransaction(id);
      await refresh();
    } catch (err) {
      console.error('Failed to delete transaction:', err);
      alert('Gagal menghapus transaksi. Silakan coba lagi.');
    } finally {
      setDeletingId(null);
    }
  };

  // Apply date range filter
  const filteredByDateRange = useMemo(() => {
    if (!dateRange.start && !dateRange.end) {
      return transactions;
    }
    
    return transactions.filter(txn => {
      const txnDate = new Date(txn.transaction_date);
      const txnDateStr = getLocalDateString(txnDate);
      
      if (dateRange.start && txnDateStr < dateRange.start) return false;
      if (dateRange.end && txnDateStr > dateRange.end) return false;
      
      return true;
    });
  }, [transactions, dateRange]);

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

    filteredByDateRange.forEach(txn => {
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
  }, [filteredByDateRange]);

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
      <div className="min-h-screen bg-[#f2f2f4] dark:bg-gray-900 relative pb-24 transition-colors">
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
      <div className="min-h-screen bg-[#f2f2f4] dark:bg-gray-900 relative pb-24 transition-colors">
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
    <div className="min-h-screen bg-[#f2f2f4] dark:bg-gray-900 relative pb-24 transition-colors">
      <div className="w-full max-w-[430px] mx-auto">
        <AppHeader />
        
        <div className="px-[18px] mb-4">
          <ActivitySearchBar 
            value={searchQuery} 
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
          />
          
          {/* Date Range Filter */}
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => setShowDateFilter(!showDateFilter)}
              className="px-4 py-2 bg-white rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors border border-gray-200"
            >
              {dateRange.start || dateRange.end ? '🗓️ Filter Aktif' : '🗓️ Filter Tanggal'}
            </button>
            {(dateRange.start || dateRange.end) && (
              <button
                onClick={() => setDateRange({ start: null, end: null })}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors"
              >
                Reset
              </button>
            )}
          </div>
          
          {/* Date Range Picker */}
          {showDateFilter && (
            <div className="mt-3 bg-white rounded-2xl p-4 shadow-sm space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Dari Tanggal</label>
                <input
                  type="date"
                  value={dateRange.start || ''}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value || null }))}
                  max={dateRange.end || undefined}
                  className="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Sampai Tanggal</label>
                <input
                  type="date"
                  value={dateRange.end || ''}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value || null }))}
                  min={dateRange.start || undefined}
                  className="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <button
                onClick={() => setShowDateFilter(false)}
                className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
              >
                Terapkan Filter
              </button>
            </div>
          )}
        </div>

        <div className="px-[18px]">
          {filteredSections.length > 0 ? (
            filteredSections.map((section, index) => (
              <TransactionSection
                key={`${section.label}-${section.date}-${section.transactions[0]?.id}`}
                section={section}
                isLast={index === filteredSections.length - 1}
                onDeleteTransaction={handleDeleteTransaction}
                deletingId={deletingId}
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