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
import { X, ShoppingCart } from "lucide-react";

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
const ProductDetailModal = ({
  product,
  open,
  onClose,
}: ProductDetailModalProps) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (open) {
      setQuantity(1);
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [open, onClose]);

  const handleAddToCart = () => {
    if (product) addToCart(product, quantity);
    onClose();
  };

  const increment = () => {
    setQuantity((prev) => (product && prev < product.stock ? prev + 1 : prev));
  };

  const decrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  };

  if (!product) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          onClick={onClose}
          variants={BACKDROP_FADE}
          initial="hidden"
          animate="visible"
          exit="hidden"
          role="presentation"
        >
          <motion.div
            className="relative w-full max-w-5xl overflow-hidden max-h-[90vh] flex flex-col shadow-2xl rounded-3xl bg-card border border-slate-200 dark:border-slate-800"
            onClick={(e: MouseEvent) => e.stopPropagation()}
            variants={MODAL_SLIDE_UP}
            role="dialog"
            aria-modal="true"
          >
            {/* Botón de Cierre */}
            <div className="absolute top-6 right-6 z-20">
              <button
                onClick={onClose}
                className="group p-2.5 rounded-full bg-card/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:scale-110 active:scale-95 hover:shadow-md"
                aria-label="Cerrar modal"
              >
                <X
                  className="w-5 h-5 text-slate-500 group-hover:text-amber-600 transition-colors"
                  strokeWidth={2}
                />
              </button>
            </div>

            <div className="flex flex-col md:flex-row h-full overflow-y-auto md:overflow-hidden">
              {/* Columna Izquierda: Información */}
              <div className="flex-1 p-8 md:p-12 flex flex-col order-2 md:order-1 overflow-y-auto bg-card">
                <div className="mb-4 flex items-center gap-2">
                  {product.brand && (
                    <span className="text-xs font-bold tracking-widest uppercase text-amber-600">
                      {product.brand}
                    </span>
                  )}
                  {product.category && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {product.category}
                      </span>
                    </>
                  )}
                </div>

                <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-6 leading-tight tracking-tight">
                  {product.title}
                </h2>

                <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8 max-w-prose">
                  {product.description}
                </p>

                <div className="flex items-end gap-4 mb-10 border-b border-slate-100 dark:border-slate-800 pb-8">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-500 mb-1">
                      Precio
                    </span>
                    <span className="text-4xl font-bold text-foreground tracking-tight">
                      ${product.price}
                    </span>
                  </div>
                  {product.discountPercentage && (
                    <span className="mb-2 text-red-600 text-xs font-bold">
                      -{product.discountPercentage}%
                    </span>
                  )}
                  <div className="ml-auto mb-2 flex items-center gap-2">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        product.stock > 0 ? "bg-green-500" : "bg-red-500",
                      )}
                    />
                    <span className="text-sm font-medium text-slate-500">
                      {product.stock > 0
                        ? `${product.stock} en stock`
                        : "Sin stock"}
                    </span>
                  </div>
                </div>

                <div className="mt-auto flex flex-col gap-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Control de Cantidad */}
                    <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 rounded-full px-1.5 py-1.5 w-full sm:w-auto min-w-[160px]">
                      <button
                        onClick={decrement}
                        disabled={quantity === 1}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-700 shadow-sm text-foreground transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                      >
                        <span className="text-xl font-medium mb-0.5">−</span>
                      </button>
                      <span className="flex-1 text-center font-bold text-lg text-foreground font-mono">
                        {quantity}
                      </span>
                      <button
                        onClick={increment}
                        disabled={quantity >= product.stock}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-700 shadow-sm text-foreground transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                      >
                        <span className="text-xl font-medium mb-0.5">+</span>
                      </button>
                    </div>

                    {/* Botón Añadir */}
                    <button
                      onClick={handleAddToCart}
                      disabled={product.stock === 0}
                      className={cn(
                        "flex-1 group py-4 px-8 rounded-full font-bold text-base md:text-lg tracking-wide shadow-xl transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0",
                        product.stock === 0
                          ? "bg-slate-300 dark:bg-slate-700 cursor-not-allowed text-slate-500"
                          : "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-amber-500/20",
                      )}
                    >
                      <span className="flex items-center justify-center gap-2">
                        {product.stock === 0
                          ? "Sin Stock"
                          : "Agregar al Carrito"}
                        <ShoppingCart className="w-5 h-5" strokeWidth={2.5} />
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Columna Derecha: Imagen */}
              <div className="w-full md:w-1/2 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center p-8 md:p-12 order-1 md:order-2">
                <div className="relative w-full h-64 md:h-full max-h-[500px] flex items-center justify-center">
                  <div className="absolute inset-0 bg-amber-500/10 rounded-full blur-3xl transform scale-75" />
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="relative z-10 w-full h-full object-contain drop-shadow-2xl transition-transform duration-700 hover:scale-105"
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
