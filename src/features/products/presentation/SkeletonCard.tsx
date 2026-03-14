/**
 * @file SkeletonCard.tsx
 * @description Componente de carga (placeholder) que visualiza una tarjeta de producto mientras los datos reales se descargan.
 * @architecture Presentation Layer - UI Skeleton
 */

import React from "react";

/**
 * @component SkeletonCard
 * @description Renderiza una estructura vacía con una animación shimmer que imita la forma de la tarjeta de Producto real.
 * Ayuda a reducir el 'layout shift' y mejora la sensación de velocidad percibida.
 *
 * @returns {JSX.Element} Un contenedor animado con placeholders grises.
 */
const SkeletonCard: React.FC = () => {
  return (
    <div
      className="w-full h-full flex flex-col rounded-2xl border border-border bg-card overflow-hidden"
      aria-hidden="true"
    >
      {/* Image Skeleton */}
      <div className="relative h-56 bg-muted overflow-hidden">
        <div className="absolute inset-0 skeleton-shimmer" />
      </div>

      {/* Body Skeleton */}
      <div className="p-5 flex-grow flex flex-col">
        {/* Category Skeleton */}
        <div className="h-3 bg-muted rounded w-20 mb-3 relative overflow-hidden">
          <div className="absolute inset-0 skeleton-shimmer" />
        </div>

        {/* Title Skeleton */}
        <div className="h-7 bg-muted rounded mb-2 w-3/4 relative overflow-hidden">
          <div className="absolute inset-0 skeleton-shimmer" />
        </div>

        {/* Description Skeleton */}
        <div className="space-y-2 mb-4 flex-grow">
          <div className="h-4 bg-muted rounded w-full relative overflow-hidden">
            <div className="absolute inset-0 skeleton-shimmer" />
          </div>
          <div className="h-4 bg-muted rounded w-5/6 relative overflow-hidden">
            <div className="absolute inset-0 skeleton-shimmer" />
          </div>
        </div>

        {/* Price/Stock Skeleton */}
        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
          <div className="h-8 bg-muted rounded w-24 relative overflow-hidden">
            <div className="absolute inset-0 skeleton-shimmer" />
          </div>
          <div className="h-10 bg-muted rounded-full w-28 relative overflow-hidden">
            <div className="absolute inset-0 skeleton-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
