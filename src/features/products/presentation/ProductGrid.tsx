import { memo } from "react";
import { useLogLifecycle } from "@/shared/hooks";
import ProductCard from "@/features/products/presentation/ProductCard";
import { m, useReducedMotion } from "framer-motion";
import type { IProduct } from "@/features/products/application/types";
import { staggerContainer } from "@/shared/lib/animations";

interface IProductGridProps {
  products: IProduct[];
}

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
