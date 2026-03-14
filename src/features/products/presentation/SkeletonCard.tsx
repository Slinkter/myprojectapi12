/**
 * @file SkeletonCard.tsx
 * @description Componente de carga (placeholder) para productos.
 * @architecture Presentation Layer - UI Skeleton
 */

import React from "react";

const SkeletonCard: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col rounded-2xl border border-border bg-background overflow-hidden">
      <div className="relative h-56 bg-muted overflow-hidden">
        <div className="absolute inset-0 skeleton-shimmer" />
      </div>

      <div className="p-4 flex flex-col gap-2">
        <div className="h-3 bg-muted rounded w-20">
          <div className="absolute inset-0 skeleton-shimmer" />
        </div>

        <div className="h-5 bg-muted rounded w-3/4">
          <div className="absolute inset-0 skeleton-shimmer" />
        </div>

        <div className="space-y-2 flex-grow">
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-5/6" />
        </div>

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-border">
          <div className="h-6 bg-muted rounded w-24" />
          <div className="h-9 bg-muted rounded-full w-24" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
