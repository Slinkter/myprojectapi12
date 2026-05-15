/**
 * @file ProductDetailModal.tsx
 * @description Modal de detalles de producto con diseño limpio y profesional.
 * @architecture Presentation Layer - Componente de UI / Modal
 */

import { useState, useEffect, MouseEvent } from "react";
import { useLogLifecycle } from "@/shared/hooks";
import { useCart } from "@/features/cart/application/useCart";
import { m, AnimatePresence } from "framer-motion";
import { MODAL_SLIDE_UP, BACKDROP_FADE } from "@/constants/animations";
import { IProductDetailModalProps } from "@/features/products/application/types";
import { getStockStatus } from "@/shared/lib/stockUtils";
import { HiOutlineXMark, HiOutlineShoppingBag, HiOutlinePlus, HiOutlineMinus } from "react-icons/hi2";
import { Button } from "@/shared/ui/Button";

const ProductDetailModal = (props: IProductDetailModalProps) => {
  useLogLifecycle("ProductDetailModal");
  const { product, isOpen, onClose } = props;
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<string>('');

  useEffect(() => {
    if (!isOpen) return;
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
  }, [isOpen, onClose, product?.images, product?.thumbnail]);

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
  const displayImages = product.images && product.images.length > 0 ? product.images : [product.thumbnail];
  const isOutOfStock = stockStatus === 'out';

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4"
          onClick={onClose}
          variants={BACKDROP_FADE}
          initial="hidden"
          animate="visible"
          exit="hidden"
          role="presentation"
        >
          <m.div
            className="relative w-full max-w-4xl bg-background rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e: MouseEvent) => e.stopPropagation()}
            variants={MODAL_SLIDE_UP}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Cerrar modal"
            >
              <HiOutlineXMark className="w-5 h-5" />
            </button>

            <div className="flex flex-col md:flex-row overflow-hidden">
              {/* Image Section */}
              <div className="w-full md:w-1/2 bg-muted/30 p-6 flex flex-col items-center justify-center">
                <div className="w-full max-w-xs">
                  <img
                    src={selectedImage}
                    alt={product.title}
                    className="w-full h-auto rounded-lg"
                  />
                </div>
                
                {displayImages.length > 1 && (
                  <div className="flex gap-2 mt-4">
                    {displayImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(img)}
                        className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary ${
                          selectedImage === img 
                            ? "border-primary" 
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                        aria-label={`Ver imagen ${index + 1}`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="w-full md:w-1/2 p-6 overflow-y-auto">
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {product.brand && (
                    <span className="text-xs font-medium uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                      {product.brand}
                    </span>
                  )}
                  {product.discountPercentage && (
                    <span className="text-xs font-bold text-white bg-destructive px-2.5 py-1 rounded-full">
                      -{Math.round(product.discountPercentage)}%
                    </span>
                  )}
                </div>

                {/* Title */}
                <h2 
                  id="modal-title"
                  className="text-2xl font-bold text-foreground mb-2"
                >
                  {product.title}
                </h2>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span 
                        key={i} 
                        className={`text-sm ${i < Math.round(product.rating || 0) ? 'text-amber-400' : 'text-muted'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating?.toFixed(1)}
                  </span>
                </div>

                {/* Description */}
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  {product.description}
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-2xl font-bold text-foreground">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.discountPercentage && (
                    <span className="text-base text-muted-foreground line-through">
                      ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Stock */}
                <div className="mb-4">
                  <span className={`text-sm font-medium ${
                    isOutOfStock ? 'text-destructive' : 
                    stockStatus === 'low' ? 'text-warning' : 'text-success'
                  }`}>
                    {isOutOfStock ? 'Agotado' : 
                     stockStatus === 'low' ? `Solo quedan ${product.stock} unidades` : 
                     `${product.stock} unidades disponibles`}
                  </span>
                </div>

                {/* Quantity & Add to Cart */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">Cantidad:</span>
                    <div className="flex items-center border border-border rounded-lg">
                      <button
                        onClick={decrement}
                        disabled={quantity <= 1}
                        className="px-3 py-2 hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus-visible:ring-2 focus-visible:ring-primary"
                        aria-label="Disminuir cantidad"
                      >
                        <HiOutlineMinus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 font-medium min-w-[3rem] text-center border-x border-border">
                        {quantity}
                      </span>
                      <button
                        onClick={increment}
                        disabled={quantity >= product.stock}
                        className="px-3 py-2 hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus-visible:ring-2 focus-visible:ring-primary"
                        aria-label="Aumentar cantidad"
                      >
                        <HiOutlinePlus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    size="lg"
                    className="w-full h-11"
                  >
                    <HiOutlineShoppingBag className="w-5 h-5 mr-2" />
                    {isOutOfStock ? 'Sin Stock' : 'Añadir al Carrito'}
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={onClose}
                    className="w-full"
                  >
                    Continuar Comprando
                  </Button>
                </div>
              </div>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailModal;
