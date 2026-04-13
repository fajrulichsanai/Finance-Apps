import React from 'react';

export default function InsightSkeleton() {
  return (
    <div className="min-h-screen bg-[#f2f2f5] relative pb-[90px]">
      <div className="w-full max-w-[430px] mx-auto">
        {/* Header Skeleton */}
        <div className="px-4 pt-6 pb-4">
          <div className="h-8 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
        </div>

        <div className="px-4">
          {/* Hero Card Skeleton */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 mb-4 shadow-lg">
            <div className="h-4 bg-white/20 rounded w-32 mb-2 animate-pulse"></div>
            <div className="h-10 bg-white/20 rounded w-40 mb-4 animate-pulse"></div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i}>
                  <div className="h-3 bg-white/20 rounded w-20 mb-2 animate-pulse"></div>
                  <div className="h-6 bg-white/20 rounded w-24 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Health Score Skeleton */}
          <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <div className="h-6 bg-gray-200 rounded w-36 mb-4 animate-pulse"></div>
            <div className="flex items-center justify-between">
              <div className="w-24 h-24 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1 ml-6 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Month Over Month Skeleton */}
          <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <div className="h-6 bg-gray-200 rounded w-40 mb-4 animate-pulse"></div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  <div className="h-7 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Allocation Skeleton */}
          <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <div className="h-6 bg-gray-200 rounded w-44 mb-4 animate-pulse"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                    <div className="h-2 bg-gray-200 rounded-full animate-pulse"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Smart Recommendations Skeleton */}
          <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <div className="h-6 bg-gray-200 rounded w-44 mb-4 animate-pulse"></div>
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="bg-blue-50 rounded-xl p-4">
                  <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Spending Trend Skeleton */}
          <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
            <div className="h-48 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>

          {/* Stat Cards Skeleton */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
              <div className="h-4 bg-gray-200 rounded w-28 mb-2 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-36 mb-2 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-48 animate-pulse"></div>
            </div>
          ))}

          <div className="h-2" />
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
