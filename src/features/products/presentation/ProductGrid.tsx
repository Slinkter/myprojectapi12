// src/features/products/presentation/ProductGrid.tsx
import Product from "./Product"; // Product is now typed
import { motion, Variants } from "framer-motion"; // Import Variants type
import { Product as ProductInterface } from "../application/types"; // Import Product interface

interface ProductGridProps {
  products: ProductInterface[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <motion.div
      className="product-grid"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {products.map((product: ProductInterface) => (
        <motion.div key={product.id} variants={itemVariants}>
          {/* Product component is now typed */}
          <Product product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProductGrid;