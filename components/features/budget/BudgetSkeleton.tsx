import React from 'react';

export default function BudgetSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="w-full max-w-[430px] mx-auto">
        {/* Header Skeleton */}
        <div className="px-4 pt-6 pb-4">
          <div className="h-8 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
        </div>

        <div className="px-4">
          {/* Budget Overview Card Skeleton */}
          <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <div className="h-6 bg-gray-200 rounded w-36 mb-4 animate-pulse"></div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="text-center">
                  <div className="h-3 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded w-full animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Budget Utilization Skeleton */}
          <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
            <div className="h-3 bg-gray-200 rounded-full mb-2 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>

          {/* Filter & Sort Header Skeleton */}
          <div className="flex justify-between items-center mb-4">
            <div className="h-5 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div className="h-9 bg-gray-200 rounded-lg w-40 animate-pulse"></div>
          </div>

          {/* Category Cards Skeleton */}
          <div className="space-y-3 mb-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div className="h-5 bg-gray-200 rounded w-28 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full mb-2 animate-pulse"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="h-[80px]" />
        </div>

        {/* Add Button Skeleton */}
        <div className="fixed bottom-20 right-4 max-w-[430px]">
          <div className="w-14 h-14 bg-gray-200 rounded-full animate-pulse shadow-lg"></div>
        </div>

        {/* Bottom Nav Skeleton */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 px-4 py-3">
          <div className="flex justify-around items-center">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
