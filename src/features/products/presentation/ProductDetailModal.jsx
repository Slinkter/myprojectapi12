/**
 * @file ProductDetailModal
 * @architecture Capa de presentación - modal para detalles del producto y selección de cantidad
 * @side-effects Añade al carrito a través del contexto, reinicia la cantidad al abrir el modal
 * @perf useEffect con dependencia [open] asegura que la cantidad se reinicia solo cuando el modal se abre
 */
import { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { CartContext } from "@/features/cart/application/CartContext";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Componente ProductDetailModal.
 * Muestra información detallada sobre un producto en un modal.
 * Permite al usuario seleccionar la cantidad y añadir el producto al carrito.
 *
 * @param {Object} props - Las props del componente.
 * @param {Object} props.product - El objeto de producto a mostrar.
 * @param {boolean} props.open - Si el modal está abierto.
 * @param {Function} props.onClose - La función a llamar cuando el modal se cierra.
 * @returns {JSX.Element} El componente ProductDetailModal renderizado.
 */
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
    visible: {
      y: "0",
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
    exit: { y: "50px", opacity: 0 },
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50 p-4"
          onClick={onClose}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className="product-detail-modal-card w-full max-w-lg p-4 sm:p-6 m-2 sm:m-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            variants={modalVariants}
          >
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h5 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-gray-100 pr-2">{product?.title}</h5>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center text-2xl leading-none text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 flex-shrink-0"
                aria-label="Close modal"
              >
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
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700 gap-3 sm:gap-0">
              <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3">
                <button
                  onClick={decrement}
                  disabled={quantity === 1}
                  className="w-10 h-10 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-amber-500 dark:hover:border-amber-500 flex items-center justify-center text-xl font-bold text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-300 dark:disabled:hover:border-gray-600"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="min-w-[3rem] text-center px-3 sm:px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 font-semibold text-gray-900 dark:text-gray-100">
                  {quantity}
                </span>
                <button
                  onClick={increment}
                  disabled={quantity >= product.stock}
                  className="w-10 h-10 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-amber-500 dark:hover:border-amber-500 flex items-center justify-center text-xl font-bold text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-300 dark:disabled:hover:border-gray-600"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="product-detail-add-to-cart-button px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base w-full sm:w-auto"
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
