import React from "react";

export function ProfileSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
      {/* Left Column */}
      <div className="space-y-12">
        <div className="rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-6 sm:p-8 animate-pulse">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Avatar */}
            <div className="h-24 w-24 rounded-full bg-white/10 shrink-0" />
            
            <div className="flex-1 w-full space-y-4">
              {/* Username */}
              <div className="h-8 w-1/3 bg-white/10 rounded-lg" />
              <div className="h-4 w-1/4 bg-white/10 rounded-lg" />
              
              {/* Bio */}
              <div className="space-y-2 mt-4">
                <div className="h-4 w-full bg-white/10 rounded" />
                <div className="h-4 w-5/6 bg-white/10 rounded" />
                <div className="h-4 w-4/6 bg-white/10 rounded" />
              </div>
            </div>
          </div>
          
          {/* Stats inline */}
          <div className="mt-8 flex flex-wrap gap-4">
            <div className="h-10 w-24 bg-white/10 rounded-xl" />
            <div className="h-10 w-32 bg-white/10 rounded-xl" />
            <div className="h-10 w-28 bg-white/10 rounded-xl" />
          </div>
        </div>

        {/* Transactions / Activity Feed Skeleton */}
        <div className="rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-6 sm:p-8 animate-pulse mt-8">
          <div className="h-5 w-40 bg-white/10 rounded mb-6" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-white/10 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 bg-white/10 rounded" />
                  <div className="h-3 w-1/4 bg-white/10 rounded" />
                </div>
                <div className="h-6 w-16 bg-white/10 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column */}
      <aside className="space-y-6">
        {/* Support Panel Skeleton */}
        <div className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-6 animate-pulse">
          <div className="h-6 w-32 bg-white/10 rounded mb-6" />
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="h-12 bg-white/10 rounded-xl" />
            <div className="h-12 bg-white/10 rounded-xl" />
            <div className="h-12 bg-white/10 rounded-xl" />
          </div>
          <div className="h-14 bg-white/10 rounded-full" />
        </div>
        
        {/* Supporters Skeleton */}
        <div className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-6 animate-pulse">
          <div className="h-4 w-32 bg-white/10 rounded mb-6" />
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="h-4 w-20 bg-white/10 rounded" />
                <div className="h-4 w-24 bg-white/10 rounded" />
                <div className="h-4 w-16 bg-white/10 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Campaign Stats Skeleton */}
        <div className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-6 animate-pulse">
          <div className="h-4 w-32 bg-white/10 rounded mb-6" />
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-4 w-24 bg-white/10 rounded" />
              <div className="h-4 w-16 bg-white/10 rounded" />
            </div>
            <div className="flex justify-between items-center">
              <div className="h-4 w-20 bg-white/10 rounded" />
              <div className="h-4 w-8 bg-white/10 rounded" />
            </div>
            <div className="w-full bg-white/5 h-1.5 rounded-full mt-2" />
          </div>
        </div>
      </aside>
    </div>
  );
}
