/**
 * @file ProductGrid.tsx
 * @description Componente de presentación que organiza los productos en una cuadrícula glassmorphism con animaciones.
 * @architecture Presentation Layer - Componente de UI
 */

import { memo } from "react";
import { useLogLifecycle } from "@/shared/hooks";
import ProductCard from "@/features/products/presentation/ProductCard";
import { m, useReducedMotion } from "framer-motion";
import type { IProduct } from "@/features/products/application/types";
import { staggerContainer, slideUp } from "@/shared/lib/animations";

interface IProductGridProps {
  products: IProduct[];
}

const ProductGrid = memo(({ products }: IProductGridProps) => {
  useLogLifecycle("ProductGrid");
  const shouldReduceMotion = useReducedMotion();

  return (
    <m.div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch"
      variants={shouldReduceMotion ? undefined : staggerContainer}
      initial={shouldReduceMotion ? undefined : "hidden"}
      animate={shouldReduceMotion ? undefined : "visible"}
    >
      {products.map((product: IProduct) => (
        <m.div 
          key={product.id} 
          variants={shouldReduceMotion ? undefined : slideUp} 
          style={{ height: "100%" }}
        >
          <ProductCard product={product} />
        </m.div>
      ))}
    </m.div>
  );
});

ProductGrid.displayName = "ProductGrid";

export default ProductGrid;
