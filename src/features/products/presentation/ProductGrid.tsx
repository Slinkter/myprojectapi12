/**
 * @file ProductGrid.tsx
 * @description Componente de presentación que organiza los productos en una cuadrícula glassmorphism con animaciones.
 * @architecture Presentation Layer - Componente de UI
 */

import { memo } from "react";
import { useLogLifecycle } from "@/shared/hooks";
import ProductCard from "@/features/products/presentation/ProductCard";
import { m } from "framer-motion";
import { Grid } from "@radix-ui/themes";
import type { IProduct } from "@/features/products/application/types";
import { staggerContainer, slideUp } from "@/shared/lib/animations";

interface IProductGridProps {
  products: IProduct[];
}

const ProductGrid = memo(({ products }: IProductGridProps) => {
  useLogLifecycle("ProductGrid");
  return (
    <Grid
      columns={{ initial: "1", sm: "2", md: "3", lg: "4" }}
      gap="6"
      align="stretch"
      asChild
    >
      <m.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {products.map((product: IProduct) => (
          <m.div 
            key={product.id} 
            variants={slideUp} 
            style={{ height: "100%" }}
          >
            <ProductCard product={product} />
          </m.div>
        ))}
      </m.div>
    </Grid>
  );
});

ProductGrid.displayName = "ProductGrid";

export default ProductGrid;
