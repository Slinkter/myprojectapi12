/**
 * @file ProductDetailModal.tsx
 * @description Modal de detalle completo de producto accesible y compuesto por subcomponentes especializados.
 * @architecture Presentation Layer - Product Component
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { m, AnimatePresence } from "framer-motion";
import { useLogLifecycle, useIsMobile } from "@/shared/hooks";
import { useCartActions } from "@/features/cart/application/useCart";
import type { IProductDetailModalProps } from "@/features/products/application/types";
import { getStockStatus } from "@/entities/product";
import { modalSlideUp, bottomSheet, backdropFade } from "@/shared/lib/animations";

import ProductImageGallery from "@features/products/presentation/components/ProductImageGallery";
import ProductHeader from "@features/products/presentation/components/ProductHeader";
import ProductPriceSection from "@features/products/presentation/components/ProductPriceSection";
import ProductStockInfo from "@features/products/presentation/components/ProductStockInfo";
import AddToCartActions from "@features/products/presentation/components/AddToCartActions";
import ModalCloseButton from "@features/products/presentation/components/ModalCloseButton";

/**
 * @component ProductDetailModal
 * @description Modal accesible de presentación y detalle de producto.
 *
 * @remarks
 * En móvil se comporta como un **Modal Bottom Sheet** de Material Design 3 (anclado al
 * borde inferior, esquinas superiores redondeadas y handle de arrastre para cerrar);
 * en escritorio conserva el diálogo centrado. Orquesta subcomponentes especializados
 * (`ProductImageGallery`, `ProductHeader`, `ProductPriceSection`, `ProductStockInfo`,
 * `AddToCartActions`, `ModalCloseButton`), asegurando trampa de foco (keyboard trap),
 * cierre por tecla Escape, bloqueo de scroll en body y animaciones suaves con Framer Motion.
 *
 * @param {IProductDetailModalProps} props - Propiedades del modal.
 * @returns {JSX.Element | null} Portal del modal o null si no está abierto o no hay producto.
 */
const ProductDetailModal = (props: IProductDetailModalProps) => {
  useLogLifecycle("ProductDetailModal");
  const isMobile = useIsMobile();
  const { product, isOpen, onClose } = props;
  const { addToCart } = useCartActions();
  const [prevProductId, setPrevProductId] = useState<number | undefined>(product?.id);
  const [prevIsOpen, setPrevIsOpen] = useState<boolean>(isOpen);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<string>(
    product?.images?.[0] || product?.thumbnail || ""
  );
  const modalRef = useRef<HTMLDivElement>(null);

  if (product && product.id !== prevProductId) {
    setPrevProductId(product.id);
    setQuantity(1);
    setSelectedImage(product.images?.[0] || product.thumbnail || "");
  }

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setQuantity(1);
      setSelectedImage(product?.images?.[0] || product?.thumbnail || "");
    }
  }

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

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

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { y: number }; velocity: { y: number } }
  ) => {
    if (info.offset.y > 120 || info.velocity.y > 500) onClose();
  };

  if (!product) return null;

  const stockStatus = getStockStatus(product.stock);

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <m.div
          className={
            isMobile
              ? "fixed inset-0 z-50 flex items-end justify-center overflow-hidden"
              : "fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4"
          }
          variants={backdropFade}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs -z-10"
            onClick={onClose}
            aria-hidden="true"
          />
          <m.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Detalle de ${product.title}`}
            variants={isMobile ? bottomSheet : modalSlideUp}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={
              isMobile
                ? "w-full max-h-[92dvh] overflow-y-auto bg-white dark:bg-slate-950 rounded-t-3xl shadow-2xl border-t border-slate-200/80 dark:border-slate-800"
                : "w-full max-w-[850px] bg-white dark:bg-slate-950 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 relative my-8"
            }
          >
            {/* Handle de arrastre M3 (solo móvil) — drag-to-dismiss */}
            {isMobile && (
              <div
                className="flex justify-center pt-3 pb-1 shrink-0"
                style={{ paddingBottom: "0.25rem" }}
              >
                <m.div
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={{ top: 0, bottom: 0.35 }}
                  dragMomentum={false}
                  onDragEnd={handleDragEnd}
                  className="w-10 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 cursor-grab active:cursor-grabbing touch-none"
                  aria-hidden="true"
                />
              </div>
            )}

            <ModalCloseButton onClose={onClose} />

            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch ${isMobile ? "p-4 pt-0" : ""}`}>
              <ProductImageGallery
                images={product.images}
                thumbnail={product.thumbnail}
                selectedImage={selectedImage}
                onSelect={setSelectedImage}
                title={product.title}
              />

              <div className="flex flex-col justify-between gap-5">
                <ProductHeader product={product} />

                <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800/70">
                  <ProductPriceSection
                    price={product.price}
                    discountPercentage={product.discountPercentage}
                  />
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
            </div>

            {/* Safe area inferior de iOS */}
            {isMobile && (
              <div
                className="shrink-0"
                style={{ height: "env(safe-area-inset-bottom)" }}
                aria-hidden="true"
              />
            )}
          </m.div>
        </m.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ProductDetailModal;

