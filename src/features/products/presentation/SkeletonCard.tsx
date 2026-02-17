/**
 * @file SkeletonCard.tsx
 * @description Componente de carga (placeholder) que visualiza una tarjeta de producto mientras los datos reales se descargan.
 * @architecture Presentation Layer - UI Skeleton
 */

import React from "react";

/**
 * @component SkeletonCard
 * @description Renderiza una estructura vacía con una animación de pulso que imita la forma de la tarjeta de Producto real.
 * Ayuda a reducir el 'layout shift' y mejora la sensación de velocidad percibida.
 *
 * @returns {JSX.Element} Un contenedor animado con placeholders grises.
 */
const SkeletonCard: React.FC = () => {
  return (
    <div
      className="w-full h-full flex flex-col animate-pulse rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
      aria-hidden="true"
    >
      {/* Image Skeleton */}
      <div className="h-56 bg-slate-100 dark:bg-slate-800"></div>

      {/* Body Skeleton */}
      <div className="p-5 flex-grow flex flex-col">
        {/* Title Skeleton */}
        <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded mb-3 w-3/4"></div>

        {/* Description Skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded"></div>
          <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-5/6"></div>
          <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-4/6"></div>
        </div>

        {/* Price/Stock Skeleton */}
        <div className="mt-auto flex items-center justify-between border-t border-slate-50 dark:border-slate-800 pt-4">
          <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded w-20"></div>
          <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-16"></div>
        </div>
      </div>

      {/* Button Skeleton */}
      <div className="p-5 pt-0">
        <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
