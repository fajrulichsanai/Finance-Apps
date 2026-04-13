import React from 'react';

export default function AssistantSkeleton() {
  return (
    <div className="font-dm-sans bg-slate-50 min-h-screen flex flex-col">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
      </div>

      {/* Chat Area Skeleton */}
      <div className="flex-1 overflow-y-auto px-4 py-2.5 pb-2 flex flex-col gap-3">
        {/* AI Message Skeleton */}
        <div className="flex flex-col">
          <div className="bg-white rounded-[4px_18px_18px_18px] px-4 py-3.5 shadow-md max-w-[90%]">
            <div className="h-3 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6 mb-2 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6 animate-pulse"></div>
          </div>
        </div>

        {/* User Message Skeleton */}
        <div className="flex flex-col items-end">
          <div className="bg-[#5b5fef] rounded-[18px_4px_18px_18px] px-4 py-3 shadow-sm max-w-[90%]">
            <div className="h-3 bg-white/30 rounded w-40 animate-pulse"></div>
          </div>
        </div>

        {/* AI Response Skeleton */}
        <div className="flex flex-col">
          <div className="bg-white rounded-[4px_18px_18px_18px] px-4 py-3.5 shadow-md max-w-[90%]">
            <div className="h-3 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-4/5 animate-pulse"></div>
          </div>
        </div>

        {/* Spending Card Skeleton */}
        <div className="bg-white rounded-2xl p-4 shadow-md">
          <div className="h-5 bg-gray-200 rounded w-40 mb-3 animate-pulse"></div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-3">
                <div className="h-3 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded w-full animate-pulse"></div>
              </div>
            ))}
          </div>
          <div className="h-3 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-4/5 animate-pulse"></div>
        </div>

        {/* Follow-up Message Skeleton */}
        <div className="flex flex-col">
          <div className="bg-white rounded-[4px_18px_18px_18px] px-4 py-3.5 shadow-md max-w-[90%]">
            <div className="h-3 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Quick Replies Skeleton */}
      <div className="px-3 pb-2">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-9 bg-gray-200 rounded-full px-4 animate-pulse"
              style={{ minWidth: '120px' }}
            ></div>
          ))}
        </div>
      </div>

      {/* Input Bar Skeleton */}
      <div className="bg-white border-t border-gray-100 px-3 py-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-11 bg-gray-100 rounded-full animate-pulse"></div>
          <div className="w-11 h-11 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
