// src/features/products/presentation/SkeletonGrid.tsx
import React from "react"; // Not strictly needed for this component, but good practice for JSX
import SkeletonCard from "./SkeletonCard"; // SkeletonCard is now typed

const SkeletonGrid: React.FC = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, index) => (
                // SkeletonCard is now typed
                <SkeletonCard key={index} />
            ))}
        </div>
    );
};

export default SkeletonGrid;