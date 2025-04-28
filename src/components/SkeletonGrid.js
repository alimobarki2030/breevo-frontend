import React from "react";

export default function SkeletonGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white p-4 rounded-xl shadow animate-pulse space-y-4 border"
        >
          <div className="h-20 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="h-3 bg-gray-100 rounded w-full" />
          <div className="flex justify-end">
            <div className="h-6 w-20 bg-gray-300 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}