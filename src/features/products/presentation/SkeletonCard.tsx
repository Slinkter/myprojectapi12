import React from "react";

const SkeletonCard: React.FC = () => {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-card text-card-foreground shadow-sm h-full flex flex-col">
      {/* Image Skeleton */}
      <div className="animate-pulse rounded-t-xl bg-slate-200 dark:bg-slate-800 h-56 w-full" />

      <div className="flex flex-col gap-2 p-4 grow">
        {/* Category Skeleton */}
        <div className="animate-pulse rounded-md bg-slate-200 dark:bg-slate-800 h-3 w-20" />

        {/* Title Skeleton */}
        <div className="animate-pulse rounded-md bg-slate-200 dark:bg-slate-800 h-5 w-3/4" />

        {/* Description Skeletons */}
        <div className="flex flex-col gap-1 grow">
          <div className="animate-pulse rounded-md bg-slate-200 dark:bg-slate-800 h-4 w-full" />
          <div className="animate-pulse rounded-md bg-slate-200 dark:bg-slate-800 h-4 w-[85%]" />
        </div>

        {/* Footer Skeleton */}
        <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="animate-pulse rounded-md bg-slate-200 dark:bg-slate-800 h-6 w-24" />
          <div className="animate-pulse rounded-md bg-slate-200 dark:bg-slate-800 h-9 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
