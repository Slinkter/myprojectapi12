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
 * @interface ProductGridProps
 * @description Propiedades para el componente ProductGrid.
 * @property {ProductInterface[]} products - Lista de productos a mostrar en la cuadrícula.
 */
interface ProductGridProps {
  products: ProductInterface[];
}

/**
 * @component ProductGrid
 * @description Renderiza una cuadrícula responsiva de tarjetas de producto.
 * Implementa animaciones de entrada 'staggered' para una mejor experiencia de usuario.
 * Utiliza React.memo para evitar re-renderizados innecesarios si la lista de productos no cambia.
 * 
 * @param {ProductGridProps} props - Propiedades del componente.
 * @returns {JSX.Element} El contenedor animado de la cuadrícula.
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