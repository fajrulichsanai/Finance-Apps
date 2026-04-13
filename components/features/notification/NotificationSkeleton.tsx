import React from 'react';

export default function NotificationSkeleton() {
  return (
    <div className="min-h-screen bg-[#f4f4f0] flex flex-col pb-20">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="h-7 bg-gray-200 rounded w-40 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-28 animate-pulse"></div>
        </div>
      </div>

      {/* Notification Sections Skeleton */}
      <div className="flex-1 overflow-y-auto px-3.5 pb-3.5">
        {[1, 2].map((sectionIndex) => (
          <div key={sectionIndex} className="mt-4">
            {/* Section Label */}
            <div className="h-3 bg-gray-200 rounded w-20 mb-3 animate-pulse"></div>

            {/* Notification Cards */}
            <div className="space-y-2">
              {[1, 2, 3].map((cardIndex) => (
                <div
                  key={cardIndex}
                  className="bg-white rounded-xl p-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
                      </div>
                      <div className="h-3 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* View Archive Button Skeleton */}
        <div className="text-center py-2.5 mt-4">
          <div className="h-3 bg-gray-200 rounded w-32 mx-auto animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
