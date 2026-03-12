/**
 * @file ProductGrid.tsx
 * @description Componente de presentación que organiza los productos en una cuadrícula con animaciones.
 * @architecture Presentation Layer - Componente de UI
 */

import { memo } from "react";
import ProductCard from "@/features/products/presentation/ProductCard";
import { motion as m } from "framer-motion";
import type { Product } from "@/entities/product/types/product.types";
import { staggerContainer, slideUp } from "@/shared/lib/animations";

interface IProductGridProps {
  products: Product[];
}

const ProductGrid = memo(({ products }: IProductGridProps) => {
  return (
    <m.div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {products.map((product: Product) => (
        <m.div key={product.id} variants={slideUp}>
          <ProductCard product={product} />
        </m.div>
      ))}
    </m.div>
  );
});

ProductGrid.displayName = "ProductGrid";

export default ProductGrid;
