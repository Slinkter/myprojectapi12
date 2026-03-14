/**
 * @file ProductDetailModal.tsx
 * @description Componente de modal para mostrar información detallada de un producto
 * y permitir al usuario elegir la cantidad antes de agregarlo al carrito.
 * @architecture Presentation Layer - Componente de UI / Modal
 */

import { useState, useEffect, MouseEvent } from "react";
import { useCart } from "@/features/cart/application/useCart";
import { m, AnimatePresence } from "framer-motion";
import { MODAL_SLIDE_UP, BACKDROP_FADE } from "@/constants/animations";
import { IProductDetailModalProps } from "@/features/products/application/types";
import { getStockStatus } from "@/shared/lib/stockUtils";
import ProductHeader from "./components/ProductHeader";
import ProductPriceSection from "./components/ProductPriceSection";
import ProductStockInfo from "./components/ProductStockInfo";
import ProductImageGallery from "./components/ProductImageGallery";
import AddToCartActions from "./components/AddToCartActions";
import ModalCloseButton from "./components/ModalCloseButton";

const ProductDetailModal = (props: IProductDetailModalProps) => {
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

  return (
    <AnimatePresence>
      {isOpen && (
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
            <ModalCloseButton onClose={onClose} />

            <div className="flex flex-col md:flex-row h-full overflow-y-auto md:overflow-hidden">
              <div className="flex-1 p-8 md:p-12 flex flex-col order-2 md:order-1 overflow-y-auto bg-card">
                <ProductHeader product={product} />

                <div className="flex items-center gap-6 mb-10 pb-8 border-b border-border/50">
                  <ProductPriceSection 
                    price={product.price} 
                    discountPercentage={product.discountPercentage} 
                  />
                  <div className="h-10 w-[1px] bg-border" />
                  <ProductStockInfo 
                    stock={product.stock} 
                    status={stockStatus} 
                  />
                </div>

                <AddToCartActions
                  quantity={quantity}
                  stock={product.stock}
                  stockStatus={stockStatus}
                  onIncrement={increment}
                  onDecrement={decrement}
                  onAddToCart={handleAddToCart}
                  onContinue={onClose}
                />
              </div>

              <ProductImageGallery
                images={product.images}
                thumbnail={product.thumbnail}
                selectedImage={selectedImage}
                onSelect={setSelectedImage}
                title={product.title}
              />
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailModal;
