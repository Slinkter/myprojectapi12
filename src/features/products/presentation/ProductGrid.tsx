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
 * Propiedades para el componente ProductGrid.
 */
interface ProductGridProps {
  /** Array de objetos de producto a mostrar en la cuadrícula. */
  products: ProductInterface[];
}

/**
 * Componente de cuadrícula responsiva que organiza las tarjetas de productos con animaciones.
 *
 * @remarks
 * Este componente utiliza `framer-motion` para implementar animaciones de entrada escalonadas.
 * Está optimizado para el rendimiento mediante el uso de `React.memo` para evitar
 * re-renderizados innecesarios cuando la lista de productos no ha cambiado.
 *
 * @param props - Propiedades del componente.
 * @returns Un contenedor de cuadrícula animada.
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