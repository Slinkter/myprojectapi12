/**
 * @file SkeletonGrid
 * @architecture Presentation layer - grid of 8 skeleton cards for loading state
 * @side-effects None - pure UI component
 * @perf Static array generation (no re-renders)
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
