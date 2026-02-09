/**
 * @file SkeletonGrid.tsx
 * @description Componente contenedor para mostrar una cuadrícula de esqueletos de carga de productos.
 * @architecture Presentation Layer - UI Skeleton
 */

import React from "react";
import SkeletonCard from "./SkeletonCard";
import clsx from 'clsx';

/**
 * @component SkeletonGrid
 * @description Crea una cuadrícula responsiva (grid) que contiene 8 SkeletonCards.
 * Se utiliza como reemplazo visual completo de la lista de productos durante la carga inicial.
 * 
 * @returns {JSX.Element} El contenedor de la cuadrícula con esqueletos.
 */
const SkeletonGrid: React.FC = () => {
    return (
        <div className={clsx("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8")} aria-hidden="true">
            {Array.from({ length: 8 }).map((_, index) => (
                <SkeletonCard key={index} />
            ))}
        </div>
    );
};

export default SkeletonGrid;