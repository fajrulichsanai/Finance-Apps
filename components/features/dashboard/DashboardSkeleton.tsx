import React from 'react';

export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#f5f5f7] relative pb-20">
      <div className="w-full max-w-[430px] mx-auto">
        {/* Header Skeleton */}
        <div className="px-4 pt-6 pb-4">
          <div className="h-8 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
        </div>

        <div className="px-4 overflow-y-auto max-h-[calc(100vh-180px)]">
          {/* Health Score Card Skeleton */}
          <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="h-8 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Net Worth Card Skeleton */}
          <div className="bg-gradient-to-br from-[#1a1a6e] to-[#2d2d8e] rounded-2xl p-5 mb-4 shadow-lg">
            <div className="h-4 bg-white/20 rounded w-40 mb-2 animate-pulse"></div>
            <div className="h-10 bg-white/20 rounded w-48 mb-1 animate-pulse"></div>
            <div className="h-3 bg-white/20 rounded w-32 animate-pulse"></div>
          </div>

          {/* Budget Overview Card Skeleton */}
          <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <div className="h-6 bg-gray-200 rounded w-36 mb-4 animate-pulse"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Accounts Grid Skeleton */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="h-4 bg-gray-200 rounded w-16 mb-3 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* AI Insight Card Skeleton */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-5 mb-4">
            <div className="h-5 bg-gray-200 rounded w-32 mb-3 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          </div>

          {/* Monthly Stats Cards Skeleton */}
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
                  <div className="h-7 bg-gray-200 rounded w-32 animate-pulse"></div>
                </div>
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            </div>
          ))}

          {/* Recent Activity Skeleton */}
          <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <div className="h-6 bg-gray-200 rounded w-36 mb-4 animate-pulse"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 py-2">
                  <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                  </div>
                  <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-[60px]" />
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
