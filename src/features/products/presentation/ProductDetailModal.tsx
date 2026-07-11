import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLogLifecycle } from "@/shared/hooks";
import { useCart } from "@/features/cart/application/useCart";
import { IProductDetailModalProps } from "@/features/products/application/types";
import { getStockStatus } from "@/shared/lib/stockUtils";
import { X, ShoppingBag } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import QuantityControl from "./components/QuantityControl";

const ProductDetailModal = (props: IProductDetailModalProps) => {
  useLogLifecycle("ProductDetailModal");
  const { product, isOpen, onClose } = props;
  const { addToCart } = useCart();
  const [prevProductId, setPrevProductId] = useState<number | undefined>(product?.id);
  const [prevIsOpen, setPrevIsOpen] = useState<boolean>(isOpen);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<string>(product?.images?.[0] || product?.thumbnail || '');

  if (product && product.id !== prevProductId) {
    setPrevProductId(product.id);
    setQuantity(1);
    setSelectedImage(product.images?.[0] || product.thumbnail || '');
  }

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setQuantity(1);
      setSelectedImage(product?.images?.[0] || product?.thumbnail || '');
    }
  }

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      {/* Backdrop overlay listener */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />
      <div className="w-full max-w-[850px] bg-white dark:bg-slate-950 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 relative my-8">
        {/* Close Button */}
        <div className="absolute top-3 right-3 z-10">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full text-sm font-medium h-10 w-10 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-pointer border-none bg-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30"
            aria-label="Cerrar modal de producto"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image Section */}
          <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
            <div className="w-full max-w-[320px] flex justify-center items-center">
              <img
                src={selectedImage}
                alt={product.title}
                className="w-full h-auto max-h-[300px] object-contain rounded-xl"
              />
            </div>
            
            {displayImages.length > 1 && (
              <div className="flex gap-2 mt-4 flex-wrap justify-center">
                {displayImages.map((img, index) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`w-14 h-14 p-0 overflow-hidden rounded-lg cursor-pointer border-2 transition-all ${
                      selectedImage === img
                        ? "border-emerald-500 opacity-100 ring-2 ring-emerald-500/20"
                        : "border-slate-200 dark:border-slate-700 opacity-60 hover:opacity-80"
                    } bg-transparent`}
                    aria-label={`Ver imagen ${index + 1} de ${displayImages.length}`}
                    aria-pressed={selectedImage === img}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex flex-col gap-4">
            {/* Badges */}
            <div className="flex gap-2">
              {product.brand && (
                <span className="inline-flex items-center rounded-full border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950 px-2.5 py-0.5 text-xs font-semibold text-purple-700 dark:text-purple-300 uppercase">
                  {product.brand}
                </span>
              )}
              {product.discountPercentage && (
                <span className="inline-flex items-center rounded-full border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 px-2.5 py-0.5 text-xs font-semibold text-red-600 dark:text-red-400">
                  -{Math.round(product.discountPercentage)}%
                </span>
              )}
            </div>

            {/* Title */}
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              {product.title}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5" aria-label={`Valoración: ${product.rating?.toFixed(1)} de 5 estrellas`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 fill-current ${i < Math.round(product.rating || 0) ? 'text-amber-500' : 'text-slate-300 dark:text-slate-600'}`}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {product.rating?.toFixed(1)}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {product.description}
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                ${product.price.toFixed(2)}
              </p>
              {product.discountPercentage && (
                <p className="text-base text-slate-400 dark:text-slate-500 line-through">
                  ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                </p>
              )}
            </div>

            {/* Stock */}
            <div>
              <p className={`text-sm font-medium ${
                isOutOfStock ? "text-red-500" :
                stockStatus === "low" ? "text-amber-500" : "text-green-600"
              }`}>
                {isOutOfStock ? 'Agotado' : 
                 stockStatus === 'low' ? `Solo quedan ${product.stock} unidades` : 
                 `${product.stock} unidades disponibles`}
              </p>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col gap-3 mt-auto">
              <div className="flex items-center gap-3">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Cantidad:</p>
                <QuantityControl
                  quantity={quantity}
                  stock={product.stock}
                  onIncrement={increment}
                  onDecrement={decrement}
                />
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                size="lg"
                className="w-full"
              >
                <ShoppingBag className="mr-2" size={18} />
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
      </div>
    </div>,
    document.body
  );
};

export default ProductDetailModal;
