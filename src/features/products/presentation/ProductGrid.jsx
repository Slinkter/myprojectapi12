/**
 * @file ProductGrid
 * @architecture Presentation layer - animated grid of products
 * @side-effects None - pure presentation with Framer Motion animations
 * @perf Staggered animations (0.1s delay) for smooth entrance
 */
import Product from "./Product";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const ProductGrid = ({ products }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
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
            {products.map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                    <Product product={product} />
                </motion.div>
            ))}
        </motion.div>
    );
};

ProductGrid.propTypes = {
    products: PropTypes.array.isRequired,
};

export default ProductGrid;
