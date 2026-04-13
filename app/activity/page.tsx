// =====================================================
// FINANCE APP - Activity Page
// =====================================================

'use client';

import React, { useState, useMemo } from 'react';
import AppHeader from '@/components/shared/AppHeader';
import BottomNav from '@/components/shared/BottomNav';
import ActivitySearchBar from '@/components/features/activity/ActivitySearchBar';
import TransactionSection from '@/components/features/activity/TransactionSection';
import { MOCK_ACTIVITY_DATA } from '@/lib/constants/activity';
import { ActivitySection } from '@/types';

export default function ActivityPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter transactions based on search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) {
      return MOCK_ACTIVITY_DATA;
    }

    const query = searchQuery.toLowerCase();
    
    return MOCK_ACTIVITY_DATA
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
  }, [searchQuery]);

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
              <p className="text-gray-400 text-sm">No transactions found</p>
            </div>
          )}
        </div>

        <BottomNav />
      </div>
    </div>
  );
}