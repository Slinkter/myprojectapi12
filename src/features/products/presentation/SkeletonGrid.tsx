import React from "react";
import { Grid } from "@radix-ui/themes";
import { useLogLifecycle } from "@/shared/hooks";
import SkeletonCard from "@/features/products/presentation/SkeletonCard";

const SkeletonGrid: React.FC = () => {
    useLogLifecycle("SkeletonGrid");
    return (
        <Grid
            columns={{ initial: "1", sm: "2", md: "3", lg: "4" }}
            gap="6"
            aria-hidden="true"
        >
            {Array.from({ length: 8 }).map((_, index) => (
                <SkeletonCard key={index} />
            ))}
        </Grid>
    );
};

export default SkeletonGrid;
