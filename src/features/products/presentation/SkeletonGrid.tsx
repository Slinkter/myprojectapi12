import React from "react";
import { useLogLifecycle } from "@/shared/hooks";
import SkeletonCard from "@/features/products/presentation/SkeletonCard";

/**
 * Cuadrícula de esqueletos de carga para productos.
 *
 * @remarks
 * Renderiza 8 SkeletonCard en un grid responsive (misma estructura que ProductGrid).
 * Marcado con `aria-hidden="true"` para que los lectores de pantalla lo ignoren.
 *
 * @component
 * @returns Elemento JSX con la cuadrícula de esqueletos animados.
 * @see SkeletonCard - Esqueleto individual de tarjeta.
 * @see ProductGrid - Grid real que este componente reemplaza durante la carga.
 */
const SkeletonGrid: React.FC = () => {
    useLogLifecycle("SkeletonGrid");
    return (
        <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            aria-hidden="true"
        >
            {Array.from({ length: 8 }).map((_, index) => (
                <SkeletonCard key={index} />
            ))}
        </div>
    );
};

export default SkeletonGrid;
