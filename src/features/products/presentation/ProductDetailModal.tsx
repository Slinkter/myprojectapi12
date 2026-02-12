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
            className={cn(
              "product-detail-modal-card relative w-full max-w-5xl p-0 m-4 overflow-hidden max-h-[90vh] flex flex-col shadow-2xl rounded-3xl bg-(--bg-card) ring-1 ring-slate-900/5",
            )}
            onClick={(e: MouseEvent) => e.stopPropagation()}
            variants={MODAL_SLIDE_UP}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            {/* Close Button - Floated & Minimalist */}
            <div className={cn("absolute top-6 right-6 z-20")}>
              <button
                onClick={onClose}
                className={cn(
                  "group p-2.5 rounded-full bg-(--bg-card)/90 backdrop-blur-md border border-(--border-light) shadow-sm transition-all hover:scale-110 active:scale-95 hover:shadow-md",
                )}
                aria-label="Close modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={cn("text-(--text-secondary) group-hover:text-(--text-primary) transition-colors")}
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            <div className={cn("flex flex-col md:flex-row h-full overflow-y-auto md:overflow-hidden")}>
              {/* Left Column: Content & Actions */}
              <div className={cn("flex-1 p-8 md:p-12 flex flex-col order-2 md:order-1 overflow-y-auto relative bg-(--bg-card)")}>
                
                {/* Brand/Category Tag */}
                <div className={cn("mb-4 flex items-center gap-2")}>
                  {product.brand && (
                    <span className={cn("text-xs font-bold tracking-widest uppercase text-amber-600 dark:text-amber-400")}>
                      {product.brand}
                    </span>
                  )}
                  {product.category && (
                    <>
                      <span className={cn("text-(--border-light)")}>•</span>
                      <span className={cn("text-xs font-semibold uppercase tracking-wider text-(--text-secondary)")}>
                        {product.category}
                      </span>
                    </>
                  )}
                </div>

                <h2
                  id="modal-title"
                  className={cn(
                    "text-3xl md:text-4xl font-extrabold text-(--text-primary) mb-6 leading-tight tracking-tight",
                  )}
                >
                  {product.title}
                </h2>

                <p
                  id="modal-description"
                  className={cn(
                    "text-base md:text-lg text-(--text-secondary) leading-relaxed font-normal mb-8 max-w-prose",
                  )}
                >
                  {product.description}
                </p>

                {/* Price & Stock Row */}
                <div className={cn("flex items-end gap-4 mb-10 border-b border-(--border-light) pb-8")}>
                  <div className={cn("flex flex-col")}>
                    <span className={cn("text-sm font-medium text-(--text-secondary) mb-1")}>Price</span>
                    <span className={cn("text-4xl font-bold text-(--text-primary) tracking-tight")}>
                      ${product.price}
                    </span>
                  </div>
                  {product.discountPercentage && (
                    <span className={cn("mb-2 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-md")}>
                      -{product.discountPercentage}%
                    </span>
                  )}
                  <div className={cn("ml-auto mb-2 flex items-center gap-2")}>
                    <div className={cn("w-2 h-2 rounded-full", product.stock > 0 ? "bg-green-500" : "bg-red-500")} />
                    <span className={cn("text-sm font-medium text-(--text-secondary)")}>
                      {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                    </span>
                  </div>
                </div>

                {/* Controls Area (Sticky bottom on mobile if needed, or just flow) */}
                <div className={cn("mt-auto flex flex-col gap-6")}>
                  
                  {/* Quantity & Add Row */}
                  <div className={cn("flex flex-col sm:flex-row gap-4")}>
                    {/* Sleek Quantity Capsule */}
                    <div className={cn("flex items-center justify-between sm:justify-start bg-(--bg-input) rounded-full px-1.5 py-1.5 w-full sm:w-auto min-w-[160px]")}>
                      <button
                        onClick={decrement}
                        disabled={quantity === 1}
                        className={cn(
                          "w-10 h-10 flex items-center justify-center rounded-full bg-(--bg-card) shadow-sm text-(--text-primary) transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        )}
                        aria-label="Decrease quantity"
                      >
                        <span className="text-xl font-medium leading-none mb-0.5">−</span>
                      </button>
                      
                      <span className={cn("flex-1 text-center font-bold text-lg text-(--text-primary) font-mono")}>
                        {quantity}
                      </span>
                      
                      <button
                        onClick={increment}
                        disabled={quantity >= product.stock}
                        className={cn(
                          "w-10 h-10 flex items-center justify-center rounded-full bg-(--bg-card) shadow-sm text-(--text-primary) transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        )}
                        aria-label="Increase quantity"
                      >
                        <span className="text-xl font-medium leading-none mb-0.5">+</span>
                      </button>
                    </div>

                    {/* Primary Action Button */}
                    <button
                      onClick={handleAddToCart}
                      disabled={product.stock === 0}
                      className={cn(
                        "flex-1 relative overflow-hidden group py-4 px-8 rounded-full font-bold text-base md:text-lg tracking-wide shadow-xl transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0",
                        product.stock === 0
                          ? "bg-slate-300 dark:bg-slate-700 cursor-not-allowed shadow-none hover:translate-y-0 text-slate-500"
                          : "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-orange-500/20 hover:shadow-orange-500/40"
                      )}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {product.stock === 0 ? "Out of Stock" : (
                          <>
                            Add to Cart
                            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Image */}
              <div className={cn("w-full md:w-1/2 bg-(--bg-input) flex items-center justify-center p-8 md:p-12 order-1 md:order-2")}>
                <div className={cn("relative w-full h-64 md:h-full max-h-[500px] flex items-center justify-center")}>
                  {/* Decorative blobs/background elements could go here */}
                  <div className={cn("absolute inset-0 bg-gradient-to-tr from-white to-transparent dark:from-slate-900/20 opacity-50 rounded-full blur-3xl transform scale-75")} />
                  
                  <img
                    src={product.thumbnail}
                    alt={`${product.title} product image`}
                    className={cn(
                      "relative z-10 w-full h-full object-contain drop-shadow-2xl transition-transform duration-700 ease-out hover:scale-105 filter saturate-[1.05]"
                    )}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailModal;
