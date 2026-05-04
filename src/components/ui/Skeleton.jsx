import React from "react";

export function ProductSkeleton() {
  return (
    <div className="bg-obsidian-800/50 rounded-2xl overflow-hidden border border-white/5">
      <div className="skeleton aspect-square" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-3 rounded w-full" />
        <div className="skeleton h-3 rounded w-3/4" />
        <div className="flex justify-between items-center mt-4">
          <div className="skeleton h-5 rounded w-16" />
          <div className="skeleton h-7 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="skeleton rounded-2xl aspect-square" />
      <div className="space-y-4 pt-4">
        <div className="skeleton h-4 rounded w-24" />
        <div className="skeleton h-8 rounded w-full" />
        <div className="skeleton h-8 rounded w-3/4" />
        <div className="skeleton h-6 rounded w-20 mt-6" />
        <div className="space-y-2 mt-6">
          <div className="skeleton h-4 rounded w-full" />
          <div className="skeleton h-4 rounded w-full" />
          <div className="skeleton h-4 rounded w-2/3" />
        </div>
        <div className="flex gap-3 mt-8">
          <div className="skeleton h-12 rounded-xl flex-1" />
          <div className="skeleton h-12 rounded-xl w-12" />
        </div>
      </div>
    </div>
  );
}
