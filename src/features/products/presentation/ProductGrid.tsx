import { memo } from "react";
import Product from "./Product";
import { motion } from "framer-motion";
import { Product as ProductInterface } from "../application/types";
import { PRODUCT_GRID_ANIMATIONS } from "@/constants/animations";

interface ProductGridProps {
  products: ProductInterface[];
}

const ProductGrid = memo(({ products }: ProductGridProps) => {
  return (
    <motion.div
      className="product-grid"
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