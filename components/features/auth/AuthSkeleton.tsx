import React from 'react';

export default function AuthSkeleton() {
  return (
    <div className="min-h-screen bg-[#f0f0f0] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo Skeleton */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gray-200 rounded-2xl mx-auto mb-4 animate-pulse"></div>
          <div className="h-7 bg-gray-200 rounded w-48 mx-auto animate-pulse"></div>
        </div>

        {/* Hero Text Skeleton */}
        <div className="text-center mb-8">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-3 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto animate-pulse"></div>
        </div>

        {/* Form Card Skeleton */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          {/* Input Fields Skeleton */}
          <div className="space-y-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                <div className="h-12 bg-gray-100 rounded-xl animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Button Skeleton */}
          <div className="h-12 bg-gray-200 rounded-xl mb-4 animate-pulse"></div>

          {/* Divider Skeleton */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gray-200 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-8 animate-pulse"></div>
            <div className="flex-1 h-px bg-gray-200 animate-pulse"></div>
          </div>

          {/* Social Button Skeleton */}
          <div className="h-12 bg-gray-100 rounded-xl mb-4 animate-pulse"></div>

          {/* Footer Link Skeleton */}
          <div className="text-center">
            <div className="h-4 bg-gray-200 rounded w-48 mx-auto animate-pulse"></div>
          </div>
        </div>

        {/* Security Footer Skeleton */}
        <div className="mt-8 text-center">
          <div className="h-3 bg-gray-200 rounded w-64 mx-auto animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
