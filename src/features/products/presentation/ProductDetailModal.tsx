/**
 * @file ProductDetailModal.tsx
 * @description Componente de modal para mostrar información detallada de un producto
 * y permitir al usuario elegir la cantidad antes de agregarlo al carrito.
 * @architecture Presentation Layer - Componente de UI / Modal
 */

import { HiOutlineXMark, HiOutlineShoppingBag } from "react-icons/hi2";
import { useState, useEffect, MouseEvent } from "react";
import { useCart } from "@/features/cart/application/useCart";
import { m, AnimatePresence } from "framer-motion";
import { MODAL_SLIDE_UP, BACKDROP_FADE } from "@/constants/animations";
import { IProductDetailModalProps } from "@/features/products/application/types";
import { getStockStatus } from "@/shared/lib/stockUtils";
import QuantityControl from "@/features/products/presentation/components/QuantityControl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ImageZoom } from "@/components/common/ImageZoom";

const ProductDetailModal = (props: IProductDetailModalProps) => {
  const { product, open, onClose } = props;
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<string>('');

  useEffect(() => {
    if (!open) return;
    setQuantity(1);
    if (product?.images && product.images.length > 0) {
      setSelectedImage(product.images[0]);
    } else if (product?.thumbnail) {
      setSelectedImage(product.thumbnail);
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose, product?.images, product?.thumbnail]);

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
        <m.div
          className="fixed inset-0 bg-neutral-950/60 backdrop-blur-md flex justify-center items-center z-50 p-4"
          onClick={onClose}
          variants={BACKDROP_FADE}
          initial="hidden"
          animate="visible"
          exit="hidden"
          role="presentation"
        >
          <m.div
            className="relative w-full max-w-5xl overflow-hidden max-h-[90vh] flex flex-col shadow-2xl rounded-3xl bg-card border border-border"
            onClick={(e: MouseEvent) => e.stopPropagation()}
            variants={MODAL_SLIDE_UP}
            role="dialog"
            aria-modal="true"
          >
            {/* Botón de Cierre */}
            <div className="absolute top-6 right-6 z-20">
              <Button
                variant="outline"
                size="icon"
                onClick={onClose}
                className="rounded-full bg-card/80 backdrop-blur-md border-border shadow-soft group hover:border-primary/30"
                aria-label="Cerrar modal"
              >
                <HiOutlineXMark
                  className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors"
                />
              </Button>
            </div>

            <div className="flex flex-col md:flex-row h-full overflow-y-auto md:overflow-hidden">
              {/* Columna Izquierda: Información */}
              <div className="flex-1 p-8 md:p-12 flex flex-col order-2 md:order-1 overflow-y-auto bg-card">
                <div className="mb-6 flex items-center gap-3">
                  {product.brand && (
                    <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary bg-primary/10 px-2 py-1 rounded-full">
                      {product.brand}
                    </span>
                  )}
                  {product.category && (
                    <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-accent-foreground bg-accent/20 px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                  )}
                </div>

                <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-black mb-4 text-foreground leading-tight">
                  {product.title}
                </h2>
                
                <p className="text-lg text-muted-foreground mb-8 font-sans leading-relaxed">
                  {product.description}
                </p>

                <div className="flex items-center gap-6 mb-10 pb-8 border-b border-border/50">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Precio</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-foreground">${product.price}</span>
                      {product.discountPercentage && (
                        <span className="text-destructive font-bold">-{Math.round(product.discountPercentage)}%</span>
                      )}
                    </div>
                  </div>
                  <div className="h-10 w-[1px] bg-border" />
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Disponibilidad</span>
                    <span className={cn(
                      "text-sm font-bold",
                      stockStatus === "ok" ? "text-success" : "text-accent"
                    )}>
                      {stockStatus === "out" ? "Agotado" : `${product.stock} en stock`}
                    </span>
                  </div>
                </div>

                <div className="mt-auto flex flex-col gap-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <QuantityControl
                      quantity={quantity}
                      onIncrement={increment}
                      onDecrement={decrement}
                      stock={product.stock}
                    />

                    <Button
                      onClick={handleAddToCart}
                      disabled={stockStatus === "out"}
                      size="lg"
                      className="flex-1 h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/25 hover:scale-[1.02] transition-transform flex items-center justify-center gap-3 group"
                    >
                      <HiOutlineShoppingBag className="w-6 h-6 group-hover:animate-bounce" />
                      Añadir al Carrito
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    onClick={onClose}
                    className="w-full h-12 rounded-xl text-muted-foreground hover:text-foreground"
                  >
                    Continuar Comprando
                  </Button>
                </div>
              </div>

              {/* Columna Derecha: Imagen */}
              <div className="w-full md:w-1/2 order-1 md:order-2 bg-muted/20 relative flex flex-col items-center justify-center p-8 md:p-12">
                <div className="relative w-full h-64 md:h-full max-h-[500px] flex items-center justify-center mb-8">
                  <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl transform scale-75 animate-pulse" />
                  <ImageZoom
                    src={selectedImage}
                    alt={product.title}
                    className="relative z-10 w-full h-full object-contain"
                  />
                </div>
                
                {product.images && product.images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2 max-w-full">
                    {product.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(img)}
                        className={cn(
                          'flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 bg-background/50',
                          selectedImage === img ? "border-primary shadow-lg shadow-primary/20 scale-110" : "border-transparent opacity-60 hover:opacity-100"
                        )}
                      >
                        <img src={img} alt={`${product.title} - ${index}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailModal;
