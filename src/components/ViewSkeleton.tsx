import React from 'react';

interface ViewSkeletonProps {
  type?: 'home' | 'search' | 'categories' | 'saved' | 'profile';
}

export const ViewSkeleton: React.FC<ViewSkeletonProps> = ({ type = 'search' }) => {
  return (
    <div className="w-full space-y-6 animate-pulse opacity-85" aria-hidden="true">
      {/* Top Header Placeholder */}
      <div className="h-28 sm:h-36 rounded-3xl bg-slate-200/70 dark:bg-[#161616] border border-slate-200/60 dark:border-[#242424] p-6 flex flex-col justify-center space-y-3">
        <div className="h-5 bg-slate-300/80 dark:bg-[#252525] rounded-full w-1/3 max-w-xs" />
        <div className="h-4 bg-slate-200 dark:bg-[#1e1e1e] rounded-full w-2/3 max-w-md" />
      </div>

      {/* Filter / Search Row Placeholder */}
      <div className="flex gap-3 items-center">
        <div className="h-12 bg-slate-200/80 dark:bg-[#161616] rounded-full flex-1 border border-slate-200/50 dark:border-[#242424]" />
        <div className="h-12 w-28 bg-slate-200/80 dark:bg-[#161616] rounded-full border border-slate-200/50 dark:border-[#242424]" />
      </div>

      {/* Grid of Law Cards Placeholders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map(idx => (
          <div
            key={idx}
            className="h-48 rounded-2xl bg-slate-100 dark:bg-[#141414] border border-slate-200/60 dark:border-[#222222] p-5 flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-6 w-20 rounded-lg bg-slate-200 dark:bg-[#222222]" />
              <div className="h-6 w-6 rounded-full bg-slate-200 dark:bg-[#222222]" />
            </div>
            <div className="space-y-2">
              <div className="h-5 bg-slate-200 dark:bg-[#202020] rounded w-3/4" />
              <div className="h-3.5 bg-slate-200/70 dark:bg-[#1b1b1b] rounded w-full" />
              <div className="h-3.5 bg-slate-200/70 dark:bg-[#1b1b1b] rounded w-4/5" />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 dark:border-[#1f1f1f]">
              <div className="h-4 w-24 rounded bg-slate-200/60 dark:bg-[#1f1f1f]" />
              <div className="h-4 w-16 rounded bg-slate-200/60 dark:bg-[#1f1f1f]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
