import React from 'react';

export default function ActivitySkeleton() {
  return (
    <div className="min-h-screen bg-[#f2f2f4] relative pb-24">
      <div className="w-full max-w-[430px] mx-auto">
        {/* Header Skeleton */}
        <div className="px-4 pt-6 pb-4">
          <div className="h-8 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
        </div>

        {/* Search Bar Skeleton */}
        <div className="px-[18px] mb-4">
          <div className="h-11 bg-white rounded-xl shadow-sm animate-pulse"></div>
        </div>

        {/* Transaction Sections Skeleton */}
        <div className="px-[18px]">
          {[1, 2, 3].map((sectionIndex) => (
            <div key={sectionIndex} className="mb-5">
              {/* Section Header */}
              <div className="flex justify-between items-center mb-3">
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              </div>

              {/* Transaction Cards */}
              <div className="space-y-3">
                {[1, 2, 3].map((cardIndex) => (
                  <div
                    key={cardIndex}
                    className="bg-white rounded-2xl p-4 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className="w-11 h-11 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                            <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                          </div>
                          <div className="h-5 bg-gray-200 rounded w-20 ml-3 animate-pulse"></div>
                        </div>
                        <div className="h-3 bg-gray-200 rounded w-40 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
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
