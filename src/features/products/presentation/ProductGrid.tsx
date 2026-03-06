/**
 * @file ProductGrid.tsx
 * @description Componente de presentación que organiza los productos en una cuadrícula con animaciones.
 * @architecture Presentation Layer - Componente de UI
 */

import { memo } from "react";
import ProductCard from "@/features/products/presentation/ProductCard";
import { m } from "framer-motion";
import { IProduct } from "@/features/products/application/types";
import { PRODUCT_GRID_ANIMATIONS } from "@/constants/animations";

/**
 * Propiedades para el componente ProductGrid.
 */
interface IProductGridProps {
  /** Array de objetos de producto a mostrar en la cuadrícula. */
  products: IProduct[];
}

/**
 * Componente de cuadrícula responsiva que organiza las tarjetas de productos con animaciones.
 */
const ProductGrid = memo(({ products }: IProductGridProps) => {
  return (
    <m.div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
      variants={PRODUCT_GRID_ANIMATIONS.container}
      initial="hidden"
      animate="visible"
    >
      {products.map((product: IProduct) => (
        <m.div key={product.id} variants={PRODUCT_GRID_ANIMATIONS.item}>
          <ProductCard product={product} />
        </m.div>
      ))}
    </m.div>
  );
});

ProductGrid.displayName = "ProductGrid";

export default ProductGrid;
