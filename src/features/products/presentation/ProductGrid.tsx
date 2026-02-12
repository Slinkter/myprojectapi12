/**
 * @file ProductGrid.tsx
 * @description Componente de presentación que organiza los productos en una cuadrícula con animaciones.
 * @architecture Presentation Layer - Componente de UI
 */

import { memo } from "react";
import Product from "./Product";
import { motion } from "framer-motion";
import { Product as ProductInterface } from "../application/types";
import { PRODUCT_GRID_ANIMATIONS } from "@/constants/animations";
import clsx from 'clsx';

/**
 * Properties for the ProductGrid component.
 */
interface ProductGridProps {
  /** Array of product objects to be displayed in the grid. */
  products: ProductInterface[];
}

/**
 * Responsive grid component that organizes product cards with animations.
 *
 * @remarks
 * This component uses `framer-motion` to implement staggered entry animations.
 * It is optimized for performance using `React.memo` to prevent unnecessary
 * re-renders when the product list hasn't changed.
 *
 * @param props - Component properties.
 * @returns An animated grid container.
 *
 * @example
 * ```tsx
 * <ProductGrid products={products} />
 * ```
 */
const ProductGrid = memo(({ products }: ProductGridProps) => {
  return (
    <motion.div
      className={clsx("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8")}
      variants={PRODUCT_GRID_ANIMATIONS.container}
      initial="hidden"
      animate="visible"
    >
      {products.map((product: ProductInterface) => (
        <motion.div
          key={product.id}
          variants={PRODUCT_GRID_ANIMATIONS.item}
        >
          <Product product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
});

ProductGrid.displayName = "ProductGrid";

export default ProductGrid;