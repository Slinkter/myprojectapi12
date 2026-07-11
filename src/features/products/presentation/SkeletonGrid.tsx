import React from "react";
import { useLogLifecycle } from "@/shared/hooks";
import SkeletonCard from "@/features/products/presentation/SkeletonCard";

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
