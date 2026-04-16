// =====================================================
// FINANCE APP - Activity Page
// =====================================================

'use client';

import React, { useState, useMemo } from 'react';
import AppHeader from '@/components/shared/AppHeader';
import BottomNav from '@/components/shared/BottomNav';
import ActivitySearchBar from '@/components/features/activity/ActivitySearchBar';
import TransactionSection from '@/components/features/activity/TransactionSection';
import { useTransactions } from '@/lib/hooks/useTransactions';
import { ActivitySection, ActivityTransaction } from '@/types';

export default function ActivityPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { transactions, loading } = useTransactions();

  // Group transactions by date sections
  const groupedSections = useMemo((): ActivitySection[] => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const todayStr = today.toISOString().split('T')[0];
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const todayTxns: ActivityTransaction[] = [];
    const yesterdayTxns: ActivityTransaction[] = [];
    const thisWeekTxns: ActivityTransaction[] = [];
    const olderTxns: ActivityTransaction[] = [];

    transactions.forEach(txn => {
      const txnDate = txn.transaction_date.split('T')[0];
      const txnTime = new Date(txn.transaction_date).toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });

      const activityTxn: ActivityTransaction = {
        id: txn.id,
        name: txn.description || 'Tidak ada deskripsi',
        category: txn.type === 'income' ? 'Pemasukan' : (txn.category_name || 'Tanpa Kategori'),
        description: txn.note || '',
        amount: txn.amount,
        time: txnTime,
        type: txn.type,
        icon: 'money' // Default icon, can be enhanced later
      };

      if (txnDate === todayStr) {
        todayTxns.push(activityTxn);
      } else if (txnDate === yesterdayStr) {
        yesterdayTxns.push(activityTxn);
      } else if (new Date(txnDate) >= sevenDaysAgo) {
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

  // Filter transactions based on search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) {
      return groupedSections;
    }

    const query = searchQuery.toLowerCase();
    
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
  }, [searchQuery, groupedSections]);

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
        />

        <div className="px-[18px]">
          {filteredSections.length > 0 ? (
            filteredSections.map((section, index) => (
              <TransactionSection
                key={`${section.label}-${index}`}
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