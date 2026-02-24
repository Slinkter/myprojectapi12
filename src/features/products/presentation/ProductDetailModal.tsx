/**
 * @file ProductDetailModal.tsx
 * @description Componente de modal para mostrar información detallada de un producto
 * y permitir al usuario elegir la cantidad antes de agregarlo al carrito.
 * @architecture Presentation Layer - Componente de UI / Modal
 */

import { X, ShoppingCart } from "lucide-react";
import { useState, useEffect, MouseEvent } from "react";
import { useCart } from "@/features/cart/application/useCart";
import { motion, AnimatePresence } from "framer-motion";
import { MODAL_SLIDE_UP, BACKDROP_FADE } from "@/constants/animations";
import { IProductDetailModalProps } from "@/features/products/application/types";
import { getStockStatus } from "@/features/products/application/stockUtils";
import QuantityControl from "@/features/products/presentation/components/QuantityControl";
import { cn } from "@/lib/utils";

const ProductDetailModal = (props: IProductDetailModalProps) => {
  const { product, open, onClose } = props;
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (!open) return;
    setQuantity(1);

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  const increment = () => {
    setQuantity((prev) => (product && prev < product.stock ? prev + 1 : prev));
  };

  const decrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleAddToCart = () => {
    if (product) addToCart(product, quantity);
    onClose();
  };
  if (!product) return null;
  const stockStatus = getStockStatus(product.stock);

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
                        stockStatus === "out" ? "bg-red-500" : "bg-green-500",
                      )}
                    />
                    <span className="text-sm font-medium text-slate-500">
                      {stockStatus === "out"
                        ? "Sin stock"
                        : `${product.stock} en stock`}
                    </span>
                  </div>
                </div>

                <div className="mt-auto flex flex-col gap-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Control de Cantidad */}
                    <QuantityControl
                      quantity={quantity}
                      stock={product.stock}
                      onIncrement={increment}
                      onDecrement={decrement}
                    />

                    {/* Botón Añadir */}
                    <button
                      onClick={handleAddToCart}
                      disabled={stockStatus === "out"}
                      className={cn(
                        "flex-1 group py-4 px-8 rounded-full font-bold text-base md:text-lg tracking-wide shadow-xl transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0",
                        stockStatus === "out"
                          ? "bg-slate-300 dark:bg-slate-700 cursor-not-allowed text-slate-500"
                          : "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-amber-500/20",
                      )}
                    >
                      <span className="flex items-center justify-center gap-2">
                        {stockStatus === "out"
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
