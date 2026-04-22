// =====================================================
// FINANCE APP - Activity Page (Refactored)
// =====================================================

'use client';

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Search, X, Filter } from 'lucide-react';
import AppHeader from '@/components/shared/AppHeader';
import BottomNav from '@/components/shared/BottomNav';
import DateRangePicker from '@/components/features/activity/DateRangePicker';
import { useTransactions } from '@/lib/hooks/useTransactions';
import { getIconComponent } from '@/lib/utils/icons';
import { formatIDR } from '@/lib/utils/currency';
import type { Transaction } from '@/lib/services/transactions';

type TransactionType = 'all' | 'income' | 'expense';

interface GroupedTransaction {
  date: string;
  label: string;
  transactions: Transaction[];
}

export default function ActivityPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TransactionType>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState<{ start: string | null; end: string | null }>({ 
    start: null, 
    end: null 
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [displayCount, setDisplayCount] = useState(10); // Show last 10 days initially
  
  const { transactions, loading, error, refresh, deleteTransaction } = useTransactions();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Debounce search query (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Format date label
  const formatDateLabel = (dateStr: string): string => {
    const date = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const txDate = new Date(date);
    txDate.setHours(0, 0, 0, 0);
    
    if (txDate.getTime() === today.getTime()) {
      return 'Hari Ini';
    }
    
    // Format: "02 Agus 2026"
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agus', 'Sep', 'Okt', 'Nov', 'Des'];
    const day = String(date.getDate()).padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
  };

  // Apply all filters
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(tx => tx.type === typeFilter);
    }

    // Date range filter
    if (dateRange.start || dateRange.end) {
      filtered = filtered.filter(tx => {
        const txDate = tx.transaction_date;
        if (dateRange.start && txDate < dateRange.start) return false;
        if (dateRange.end && txDate > dateRange.end) return false;
        return true;
      });
    }

    // Search filter
    if (debouncedQuery.trim()) {
      const query = debouncedQuery.toLowerCase();
      filtered = filtered.filter(tx =>
        tx.description?.toLowerCase().includes(query) ||
        tx.category_name?.toLowerCase().includes(query) ||
        tx.note?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [transactions, typeFilter, dateRange, debouncedQuery]);

  // Group by date
  const groupedTransactions = useMemo((): GroupedTransaction[] => {
    const grouped = new Map<string, Transaction[]>();

    filteredTransactions.forEach(tx => {
      const date = tx.transaction_date;
      if (!grouped.has(date)) {
        grouped.set(date, []);
      }
      grouped.get(date)!.push(tx);
    });

    // Sort dates descending
    const sorted = Array.from(grouped.entries())
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, txs]) => ({
        date,
        label: formatDateLabel(date),
        transactions: txs.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      }));

    return sorted;
  }, [filteredTransactions]);

  // Limit display to displayCount days (for infinite scroll)
  const visibleGroups = useMemo(() => {
    return groupedTransactions.slice(0, displayCount);
  }, [groupedTransactions, displayCount]);

  // Infinite scroll - load more days
  const loadMore = useCallback(() => {
    if (displayCount < groupedTransactions.length) {
      setDisplayCount(prev => prev + 10);
    }
  }, [displayCount, groupedTransactions.length]);

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [loadMore, loading]);

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Hapus transaksi ini?')) return;
    try {
      setDeletingId(id);
      await deleteTransaction(id);
      await refresh();
    } catch (err) {
      console.error('Failed to delete:', err);
      alert('Gagal menghapus transaksi');
    } finally {
      setDeletingId(null);
    }
  };

  // Reset date range
  const resetDateRange = () => {
    setDateRange({ start: null, end: null });
    setShowDatePicker(false);
  };

  if (error && !loading) {
    return (
      <div className="min-h-screen bg-[#f2f2f4] pb-24">
        <div className="w-full max-w-[430px] mx-auto">
          <AppHeader />
          <div className="px-5 py-12 text-center">
            <p className="text-red-500 font-semibold mb-4">⚠️ Gagal memuat transaksi</p>
            <button 
              onClick={refresh}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold"
            >
              Coba Lagi
            </button>
          </div>
          <BottomNav />
        </div>
      </div>
    );
  }

  if (loading && transactions.length === 0) {
    return (
      <div className="min-h-screen bg-[#f2f2f4] pb-24">
        <div className="w-full max-w-[430px] mx-auto">
          <AppHeader />
          <div className="px-5 py-6 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="h-5 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
          <BottomNav />
        </div>
      </div>
    );
  }

  const hasActiveFilters = typeFilter !== 'all' || dateRange.start || dateRange.end;

  return (
    <div className="min-h-screen bg-[#f2f2f4] pb-24">
      <div className="w-full max-w-[430px] mx-auto">
        <AppHeader />

        {/* Search & Filter Bar */}
        <div className="px-5 py-4">
          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="flex-1 bg-white rounded-full px-4 py-3 flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input 
                type="text" 
                placeholder="Cari transaksi..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-none outline-none text-sm text-gray-700 placeholder:text-gray-400 bg-transparent"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-gray-400">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${ 
                hasActiveFilters 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-600'
              }`}
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-3 bg-white rounded-2xl p-4 shadow-sm space-y-4">
              {/* Type Filter */}
              <div>
                <p className="text-xs font-bold text-gray-500 mb-2">Tipe Transaksi</p>
                <div className="flex gap-2">
                  {(['all', 'income', 'expense'] as TransactionType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setTypeFilter(type)}
                      className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                        typeFilter === type
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-50 text-gray-600'
                      }`}
                    >
                      {type === 'all' ? 'Semua' : type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Range Button */}
              <div>
                <button
                  onClick={() => setShowDatePicker(true)}
                  className="w-full flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {dateRange.start || dateRange.end 
                    ? `${dateRange.start || '—'} hingga ${dateRange.end || '—'}` 
                    : 'Pilih Rentang Tanggal'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Transactions List */}
        <div className="px-5 space-y-4">
          {visibleGroups.length > 0 ? (
            <>
              {visibleGroups.map((group) => (
                <div key={group.date} className="space-y-2">
                  <p className="text-xs font-bold text-gray-500 px-1">{group.label}</p>
                  {group.transactions.map((tx) => {
                    const Icon = getIconComponent(tx.category_icon || 'Wallet');
                    const isDeleting = deletingId === tx.id;
                    
                    return (
                      <div
                        key={tx.id}
                        className={`bg-white rounded-2xl p-4 shadow-sm transition-opacity ${
                          isDeleting ? 'opacity-50' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ 
                              backgroundColor: tx.category_color ? `${tx.category_color}20` : '#f3f4f6' 
                            }}
                          >
                            <Icon
                              className="w-6 h-6"
                              style={{ color: tx.category_color || '#6b7280' }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">{tx.description}</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {tx.type === 'income' ? 'Pemasukan' : tx.category_name || 'Tanpa Kategori'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`text-base font-bold ${
                              tx.type === 'income' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {tx.type === 'income' ? '+' : '-'}{formatIDR(tx.amount)}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {new Date(tx.created_at).toLocaleTimeString('id-ID', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                        </div>
                        {tx.note && (
                          <p className="text-xs text-gray-500 mt-2 pl-15">{tx.note}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* Load More Trigger */}
              {displayCount < groupedTransactions.length && (
                <div ref={loadMoreRef} className="py-4 text-center">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-indigo-600"></div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-sm">
                {searchQuery || hasActiveFilters ? 'Tidak ada transaksi ditemukan' : 'Belum ada transaksi'}
              </p>
            </div>
          )}
        </div>

        {/* Date Range Picker Modal */}
        {showDatePicker && (
          <DateRangePicker
            startDate={dateRange.start}
            endDate={dateRange.end}
            onApply={(start, end) => {
              setDateRange({ start, end });
              setShowDatePicker(false);
            }}
            onClose={() => setShowDatePicker(false)}
          />
        )}

        <BottomNav />
      </div>
    </div>
  );
}
