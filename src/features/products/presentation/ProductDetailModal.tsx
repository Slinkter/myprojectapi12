/**
 * @file ProductDetailModal.tsx
 * @description Componente de modal para mostrar información detallada de un producto
 * y permitir al usuario elegir la cantidad antes de agregarlo al carrito.
 * @architecture Presentation Layer - Componente de UI / Modal
 */

import { useState, useEffect, MouseEvent } from "react";
import { useCart } from "@/features/cart/application/useCart";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/features/products/application/types";
import { MODAL_SLIDE_UP, BACKDROP_FADE } from "@/constants/animations";
import { cn } from "@/lib/utils";

/**
 * @interface ProductDetailModalProps
 * @description Propiedades para el modal de detalles del producto.
 */
interface ProductDetailModalProps {
  /** El objeto del producto a mostrar, o null si está cerrado */
  product: Product | null;
  /** Booleano que controla si el modal es visible */
  open: boolean;
  /** Función callback para solicitar el cierre del modal */
  onClose: () => void;
}

/**
 * @component ProductDetailModal
 * @description Modal animado con Framer Motion que presenta los detalles del producto seleccionado.
 * Permite seleccionar la cantidad respetando el stock disponible e integra con el CartContext
 * para agregar el item al carrito.
 * 
 * @param {ProductDetailModalProps} props - Propiedades del componente.
 * @returns {JSX.Element} El modal renderizado condicionalmente y con animaciones.
 */
const ProductDetailModal = ({ product, open, onClose }: ProductDetailModalProps) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState<number>(1);

  // Efecto para manejar accesibilidad y reseteo de estado local
  useEffect(() => {
    if (open) {
      setQuantity(1); // Reiniciar cantidad al abrir

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
    return () => { };
  }, [open, onClose]);

  /**
   * Manejador para agregar el producto al carrito global y cerrar el modal.
   */
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
    onClose();
  };

  /**
   * Incrementa la cantidad a agregar, validando contra el stock disponible.
   */
  const increment = () => {
    setQuantity((prev) => {
      if (product && prev < product.stock) return prev + 1;
      return prev;
    });
  };

  /**
   * Decrementa la cantidad a agregar, deteniéndose en 1.
   */
  const decrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  };

  // No renderizar nada si no hay producto (seguridad adicional)
  if (!product) {
    return null;
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={cn("fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50 p-4")}
          onClick={onClose}
          variants={BACKDROP_FADE}
          initial="hidden"
          animate="visible"
          exit="hidden"
          role="presentation"
          aria-hidden="true"
        >
          <motion.div
            className={cn("product-detail-modal-card w-full max-w-4xl p-0 m-4 overflow-hidden max-h-[90vh] flex flex-col")}
            onClick={(e: MouseEvent) => e.stopPropagation()}
            variants={MODAL_SLIDE_UP}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            {/* Header (Mobile Only / Absolute close button) */}
            <div className={cn("absolute top-4 right-4 z-10")}>
              <button
                onClick={onClose}
                className={cn("p-2 rounded-full bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black/70 backdrop-blur-sm transition-all shadow-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white")}
                aria-label={`Close ${product.title} details`}
              >
                &times;
              </button>
            </div>

            <div className={cn("flex flex-col sm:flex-row h-full overflow-y-auto sm:overflow-hidden")}>
              {/* Columna Izquierda: Información (Título, Descripción, Controles) */}
              <div className={cn("flex-1 p-6 sm:p-8 flex flex-col order-2 sm:order-1 overflow-y-auto")}>
                <div className={cn("mb-auto")}>
                  <h5
                    id="modal-title"
                    className={cn("text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 leading-tight")}
                  >
                    {product.title}
                  </h5>
                  
                  <div className={cn("flex items-center gap-4 mb-6")}>
                    <span className={cn("product-modal__price text-xl font-bold text-amber-600 dark:text-amber-500")}>
                      $ {product.price}
                    </span>
                    <span className={cn("text-sm px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium")}>
                      Stock: {product.stock}
                    </span>
                  </div>

                  <p id="modal-description" className={cn("product-modal__description text-gray-600 dark:text-gray-300 leading-relaxed text-base sm:text-lg mb-8")}>
                    {product.description}
                  </p>
                </div>

                {/* Footer / Controles de Acción */}
                <div className={cn("mt-6 pt-6 border-t border-gray-100 dark:border-gray-800")}>
                  <div className={cn("flex flex-col sm:flex-row gap-4 items-center")}>
                    <div
                      className={cn("flex items-center bg-gray-50 dark:bg-gray-800/50 rounded-xl p-1")}
                      role="group"
                      aria-label="Quantity selector"
                    >
                      <button
                        onClick={decrement}
                        disabled={quantity === 1}
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold transition-colors",
                          quantity === 1
                            ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                            : "text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 shadow-sm"
                        )}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span
                        className={cn("w-12 text-center font-semibold text-gray-900 dark:text-white")}
                        aria-live="polite"
                      >
                        {quantity}
                      </span>
                      <button
                        onClick={increment}
                        disabled={quantity >= product.stock}
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold transition-colors",
                          quantity >= product.stock
                            ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                            : "text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 shadow-sm"
                        )}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      disabled={product.stock === 0}
                      className={cn(
                        "product-detail-add-to-cart-button flex-1 py-3.5 rounded-xl font-bold text-base shadow-lg hover:shadow-amber-500/25 active:scale-[0.98] transition-all",
                        product.stock === 0
                          ? "opacity-50 cursor-not-allowed bg-gray-300 text-gray-500"
                          : "bg-gradient-to-r from-amber-500 to-orange-600 text-white"
                      )}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>

              {/* Columna Derecha: Imagen */}
              <div className={cn("w-full sm:w-2/5 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center p-8 order-1 sm:order-2 border-b sm:border-b-0 sm:border-l border-gray-100 dark:border-gray-800")}>
                <img
                  src={product.thumbnail}
                  alt={`${product.title} product image`}
                  className={cn("w-full h-48 sm:h-full object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-500 hover:scale-110 drop-shadow-xl")}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailModal;
