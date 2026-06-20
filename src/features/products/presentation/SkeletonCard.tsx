import React from "react";
import { Card, Flex, Skeleton } from "@radix-ui/themes";

const SkeletonCard: React.FC = () => {
  return (
    <Card size="2" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Image Skeleton */}
      <Skeleton style={{ height: "224px", width: "100%", borderRadius: "var(--radius-3)" }} />

      <Flex direction="column" gap="2" p="4" style={{ flexGrow: 1 }}>
        {/* Category Skeleton */}
        <Skeleton style={{ height: "12px", width: "80px" }} />

        {/* Title Skeleton */}
        <Skeleton style={{ height: "20px", width: "75%" }} />

        {/* Description Skeletons */}
        <Flex direction="column" gap="1" style={{ flexGrow: 1 }}>
          <Skeleton style={{ height: "16px", width: "100%" }} />
          <Skeleton style={{ height: "16px", width: "85%" }} />
        </Flex>

        {/* Footer Skeleton */}
        <Flex justify="between" align="center" pt="3" style={{ borderTop: "1px solid var(--gray-5)" }}>
          <Skeleton style={{ height: "24px", width: "96px" }} />
          <Skeleton style={{ height: "36px", width: "96px", borderRadius: "var(--radius-3)" }} />
        </Flex>
      </Flex>
    </Card>
  );
};

export default SkeletonCard;
