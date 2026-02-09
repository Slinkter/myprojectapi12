/**
 * @file SkeletonCard.tsx
 * @description Componente de carga (placeholder) que visualiza una tarjeta de producto mientras los datos reales se descargan.
 * @architecture Presentation Layer - UI Skeleton
 */

import React from "react";
import clsx from 'clsx';

/**
 * @component SkeletonCard
 * @description Renderiza una estructura vacía con una animación de pulso que imita la forma de la tarjeta de Producto real.
 * Ayuda a reducir el 'layout shift' y mejora la sensación de velocidad percibida.
 * 
 * @returns {JSX.Element} Un contenedor animado con placeholders grises.
 */
const SkeletonCard: React.FC = () => {
    return (
        <div className={clsx("skeleton-card w-full h-full flex flex-col animate-pulse")} aria-hidden="true">
            {/* Image Skeleton */}
            <div className={clsx("h-56 bg-gray-200 dark:bg-gray-700 rounded-t-2xl")}></div>

            {/* Body Skeleton */}
            <div className={clsx("p-5 flex-grow flex flex-col")}>
                {/* Title Skeleton */}
                <div className={clsx("h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3 w-3/4")}></div>

                {/* Description Skeleton */}
                <div className={clsx("space-y-2 mb-4")}>
                    <div className={clsx("h-4 bg-gray-200 dark:bg-gray-700 rounded")}></div>
                    <div className={clsx("h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6")}></div>
                    <div className={clsx("h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6")}></div>
                </div>

                {/* Price/Stock Skeleton */}
                <div className={clsx("mt-auto flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-4")}>
                    <div className={clsx("h-6 bg-gray-200 dark:bg-gray-700 rounded w-20")}></div>
                    <div className={clsx("h-4 bg-gray-200 dark:bg-gray-700 rounded w-16")}></div>
                </div>
            </div>

            {/* Button Skeleton */}
            <div className={clsx("p-5 pt-0")}>
                <div className={clsx("h-12 bg-gray-200 dark:bg-gray-700 rounded-xl")}></div>
            </div>
        </div>
    );
};

export default SkeletonCard;