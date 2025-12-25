import { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { CartContext } from "@/features/cart/application/CartContext";
import { motion, AnimatePresence } from "framer-motion";

const ProductDetailModal = ({ product, open, onClose }) => {
    const { addToCart } = useContext(CartContext);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (open) {
            setQuantity(1); // Reset quantity when modal opens
        }
    }, [open]);

    const handleAddToCart = () => {
        addToCart(product, quantity);
        onClose();
    };

    const increment = () => {
        if (quantity < product.stock) setQuantity(quantity + 1);
    };

    const decrement = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const backdropVariants = {
        visible: { opacity: 1 },
        hidden: { opacity: 0 },
    };

    const modalVariants = {
        hidden: { y: "-50px", opacity: 0 },
        visible: { y: "0", opacity: 1, transition: { type: "spring", stiffness: 100 } },
        exit: { y: "50px", opacity: 0 },
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50"
                    onClick={onClose}
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                >
                    <motion.div
                        className="neumo-card w-full max-w-lg p-6 m-4"
                        onClick={(e) => e.stopPropagation()}
                        variants={modalVariants}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h5 className="font-bold text-xl">{product?.title}</h5>
                            <button onClick={onClose} className="neumo-button rounded-full p-2 w-8 h-8 flex items-center justify-center">
                                &times;
                            </button>
                        </div>
                        <div className="border-t border-[var(--neumo-shadow-dark)] dark:border-[var(--neumo-shadow-dark-mode-dark)] pt-4">
                            <img
                                src={product?.thumbnail}
                                alt={product?.title}
                                className="product-modal__image"
                            />
                            <p className="product-modal__description my-4">
                                {product?.description}
                            </p>
                            <h6 className="product-modal__price font-semibold">
                                Price: $ {product?.price}
                            </h6>
                            <h6 className="product-modal__stock font-semibold">
                                Stock: {product?.stock}
                            </h6>
                        </div>
                        <div className="flex justify-between items-center mt-6 pt-4 border-t border-[var(--neumo-shadow-dark)] dark:border-[var(--neumo-shadow-dark-mode-dark)]">
                            <div className="flex items-center gap-2">
                                <button onClick={decrement} disabled={quantity === 1} className="neumo-button w-10 h-10 disabled:opacity-50">
                                    -
                                </button>
                                <span className="neumo-input text-center w-12 p-2">{quantity}</span>
                                <button onClick={increment} disabled={quantity >= product.stock} className="neumo-button w-10 h-10 disabled:opacity-50">
                                    +
                                </button>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className="neumo-button px-6 py-2 bg-green-500 text-white disabled:opacity-50"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

ProductDetailModal.propTypes = {
    product: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default ProductDetailModal;
