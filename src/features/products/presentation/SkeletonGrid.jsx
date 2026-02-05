/**
 * @file SkeletonGrid
 * @architecture Capa de presentación - cuadrícula de 8 tarjetas esqueleto para el estado de carga
 * @side-effects Ninguno - componente de UI puro
 * @perf Generación de array estático (sin re-renders)
 */
import SkeletonCard from "./SkeletonCard";

const SkeletonGrid = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, index) => (
                <SkeletonCard key={index} />
            ))}
        </div>
    );
};

export default SkeletonGrid;
