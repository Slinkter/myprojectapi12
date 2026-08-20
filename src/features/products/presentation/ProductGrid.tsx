/**
 * @file ProductGrid.tsx
 * @description Cuadrícula responsiva para renderizar el catálogo de tarjetas de productos con animaciones escalonadas.
 * @architecture Presentation Layer - Product Component
 */

import { memo } from "react";
import { useLogLifecycle } from "@/shared/hooks/useLogLifecycle";
import ProductCard from "@/features/products/presentation/ProductCard";
import { m, useReducedMotion } from "framer-motion";
import type { IProduct } from "@/features/products/application/types";
import { staggerContainer } from "@/shared/lib/animations";

/**
 * @interface IProductGridProps
 * @description Propiedades del componente ProductGrid.
 */
export interface IProductGridProps {
  /** Colección de productos a renderizar en la cuadrícula. */
  products: IProduct[];
}

/**
 * @component ProductGrid
 * Renderiza la lista de productos en una cuadrícula responsiva con animaciones de entrada progresivas.
 *
 * @remarks
 * Aplica animaciones escalonadas con Framer Motion respetando las preferencias de movimiento
 * reducido (`useReducedMotion`).
 *
 * @param {IProductGridProps} props - Propiedades del componente.
 * @returns {JSX.Element} Cuadrícula de productos renderizada.
 */
const ProductGrid = memo(({ products }: IProductGridProps) => {
  useLogLifecycle("ProductGrid");
  const shouldReduceMotion = useReducedMotion();

  return (
    <m.div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 items-stretch"
      variants={shouldReduceMotion ? undefined : staggerContainer}
      initial={shouldReduceMotion ? undefined : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={{ once: true, margin: "-50px" }}
    >
      {products.map((product: IProduct) => (
        <m.div
          key={product.id}
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
          className="h-full [content-visibility:auto] [contain-intrinsic-size:auto_420px]"
        >
          <ProductCard product={product} />
        </m.div>
      ))}
    </m.div>
  );
});

ProductGrid.displayName = "ProductGrid";

export default ProductGrid;

