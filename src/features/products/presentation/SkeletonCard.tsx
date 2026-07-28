import React from "react";

/**
 * Esqueleto de carga para una tarjeta de producto.
 *
 * @remarks
 * Muestra una versión placeholder animada (pulse) que imita la estructura
 * de ProductCard: imagen, categoría, título, descripción y pie con precio/botón.
 * Útil durante la carga inicial de datos para mejorar la experiencia percibida.
 *
 * @component
 * @returns Elemento JSX con el esqueleto de tarjeta animado.
 * @see ProductCard - Componente real que este esqueleto representa.
 */
const SkeletonCard: React.FC = () => {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-card text-card-foreground shadow-sm h-full flex flex-col">
      {/* Image Skeleton */}
      <div className="skeleton-line rounded-none rounded-t-xl h-56 w-full" />

      <div className="flex flex-col gap-2 p-4 grow">
        {/* Category Skeleton */}
        <div className="skeleton-line h-3 w-20" />

        {/* Title Skeleton */}
        <div className="skeleton-line h-5 w-3/4" />

        {/* Description Skeletons */}
        <div className="flex flex-col gap-1 grow">
          <div className="skeleton-line h-4 w-full" />
          <div className="skeleton-line h-4 w-[85%]" />
        </div>

        {/* Footer Skeleton */}
        <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="skeleton-line h-6 w-24" />
          <div className="skeleton-line rounded-xl h-9 w-24" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
