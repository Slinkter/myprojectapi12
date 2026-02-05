/**
 * @file SkeletonCard
 * @architecture Capa de presentación - marcador de posición de carga para tarjetas de producto
 * @side-effects Ninguno - componente de UI puro
 * @perf Animación CSS (pulso) a través de Tailwind
 */
const SkeletonCard = () => {
    return (
        <div className="skeleton-card w-full h-full flex flex-col animate-pulse">
            {/* Image Skeleton */}
            <div className="h-56 bg-gray-200 dark:bg-gray-700 rounded-t-2xl"></div>

            {/* Body Skeleton */}
            <div className="p-5 flex-grow flex flex-col">
                {/* Title Skeleton */}
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3 w-3/4"></div>

                {/* Description Skeleton */}
                <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
                </div>

                {/* Price/Stock Skeleton */}
                <div className="mt-auto flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-4">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                </div>
            </div>

            {/* Button Skeleton */}
            <div className="p-5 pt-0">
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            </div>
        </div>
    );
};

export default SkeletonCard;
