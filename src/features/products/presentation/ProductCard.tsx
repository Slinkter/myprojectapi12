/**
 * @file ProductCard.tsx
 * @description Componente de presentación para renderizar la tarjeta visual interactiva de producto.
 * @architecture Presentation Layer - Product Component
 */

import React, { useCallback, useState, useRef } from 'react'
import { m, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useLogLifecycle } from "@/shared/hooks";
import { useProductModalContext } from '@/features/products/application/useProductModalContext'
import { useCartActions } from '@/features/cart/application/CartActionsContext'
import { getStockStatus } from '@/entities/product'
import type { IProduct } from '@/features/products/application/types'
import { LazyImage } from '@/shared/ui/LazyImage';
import { Eye, ShoppingBag, Pencil, Trash2 } from 'lucide-react'
import { useAuth } from '@/features/auth/application/AuthContext'

/**
 * Props para el componente ProductCard.
 * @interface ProductCardProps
 */
export interface ProductCardProps {
  /** Objeto de producto con datos dominiales. */
  product: IProduct;
}

const priceFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const formatPrice = (price: number): string => priceFormatter.format(price);

const originalPrice = (price: number, discount: number): string =>
  formatPrice(price / (1 - discount / 100));

const StarIcon = ({ fillType }: { fillType: 'full' | 'half' | 'empty' }) => {
  if (fillType === 'full') {
    return (
      <svg className="w-3 h-3 text-amber-500 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    );
  }
  if (fillType === 'half') {
    return (
      <svg className="w-3 h-3 text-amber-500 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03zM12 15.4V6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28z" />
      </svg>
    );
  }
  return (
    <svg className="w-3 h-3 text-slate-300 dark:text-slate-700 fill-current" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28z" />
    </svg>
  );
};

const StarRating = ({ rating }: { rating: number }) => {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-0.5 leading-none" aria-label={`Valoración: ${rating?.toFixed(1)} de 5 estrellas`}>
      {Array.from({ length: 5 }, (_, i) => {
        const fillType = i < full ? 'full' : (i === full && half) ? 'half' : 'empty';
        return <StarIcon key={i} fillType={fillType} />;
      })}
      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 ml-1">
        {rating?.toFixed(1)}
      </span>
    </div>
  );
};

export interface IProductCardProps {
  product: IProduct;
  onEdit?: (product: IProduct) => void;
  onDelete?: (id: number) => void;
}

/**
 * @component ProductCard
 * Renderiza una tarjeta visual interactiva con la información esencial del producto.
 *
 * @remarks
 * Incluye elevaciones táctiles en hover, badges elegantes de categoría y descuento,
 * formato numérico `tabular-nums` para precios, y llamadas a la acción (CTAs) de alto contraste.
 *
 * @param {IProductCardProps} props - Props del componente.
 * @returns {JSX.Element | null} Elemento JSX renderizado o null si el producto es inválido.
 */
const ProductCard = React.memo(({ product, onEdit, onDelete }: IProductCardProps) => {
  useLogLifecycle("ProductCard");
  const shouldReduceMotion = useReducedMotion();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const { openProductModal } = useProductModalContext()
  const { addToCart } = useCartActions()
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const stockStatus = getStockStatus(product?.stock)
  const isOutOfStock = stockStatus === 'out'

  const handleCardClick = useCallback(() => {
    if (!isOutOfStock) openProductModal(product)
  }, [isOutOfStock, openProductModal, product])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (!isOutOfStock) openProductModal(product)
    }
  }, [isOutOfStock, openProductModal, product])

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isOutOfStock) {
      addToCart(product, 1)
    }
  }, [isOutOfStock, addToCart, product])

  if (!product || !product.id) return null

  return (
    <m.article
      ref={cardRef}
      tabIndex={isOutOfStock ? -1 : 0}
      aria-label={`Ver detalle de ${product.title}${isOutOfStock ? ' (Sin stock)' : ''}`}
      aria-disabled={isOutOfStock}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={(isOutOfStock || shouldReduceMotion) ? {} : {
        y: -6,
        boxShadow: '0 20px 30px -10px rgba(5, 150, 105, 0.16), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        borderColor: 'rgba(5, 150, 105, 0.45)',
      }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className={`flex flex-col h-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-card text-card-foreground shadow-sm overflow-hidden relative transition-colors ${
        isOutOfStock ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
      }`}
    >
      {/* Botones de Admin — z-20 para estar sobre el área de clic del artículo */}
      {isAdmin && (
        <div className="absolute top-2.5 right-2.5 z-20 flex gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onEdit) onEdit(product);
            }}
            aria-label={`Editar ${product.title}`}
            className="p-1.5 rounded-full bg-white/95 hover:bg-white dark:bg-slate-900/95 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-primary transition-colors shadow-md active:scale-95 flex items-center justify-center cursor-pointer"
          >
            <Pencil size={12} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onDelete) onDelete(product.id);
            }}
            aria-label={`Eliminar ${product.title}`}
            className="p-1.5 rounded-full bg-white/95 hover:bg-white dark:bg-slate-900/95 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-red-600 transition-colors shadow-md active:scale-95 flex items-center justify-center cursor-pointer"
          >
            <Trash2 size={12} />
          </button>
        </div>
      )}

      {/* Zona de imagen */}
      <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800 relative shrink-0">
        <m.div
          className="w-full h-full"
          animate={{ scale: isHovered && !isOutOfStock && !shouldReduceMotion ? 1.05 : 1 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        >
          <LazyImage
            src={product.thumbnail}
            alt={product.title}
            aspectRatio="aspect-auto"
            className="w-full h-full"
            imgStyle={{ objectFit: 'contain', padding: '12px' }}
          />
        </m.div>

        {/* Overlay hover con CTAs de alto contraste */}
        <AnimatePresence>
          {isHovered && !isOutOfStock && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/35 to-slate-950/10 flex items-center justify-center gap-2.5 backdrop-blur-[2px]"
            >
              <m.button
                type="button"
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 14, opacity: 0 }}
                transition={{ duration: 0.22, delay: 0.02, ease: [0.4, 0, 0.2, 1] }}
                onClick={handleAddToCart}
                aria-label={`Añadir ${product.title} al carrito`}
                className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full border-none bg-primary text-white text-xs font-bold cursor-pointer hover:bg-primary-hover active:scale-95 transition-colors shadow-lg shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                <ShoppingBag size={13} />
                Añadir
              </m.button>

              <m.button
                type="button"
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 14, opacity: 0 }}
                transition={{ duration: 0.22, delay: 0.05, ease: [0.4, 0, 0.2, 1] }}
                onClick={(e) => { e.stopPropagation(); openProductModal(product) }}
                aria-label={`Vista rápida de ${product.title}`}
                className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full border border-slate-700/60 bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-bold cursor-pointer backdrop-blur-md active:scale-95 transition-colors shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                <Eye size={13} />
                Ver
              </m.button>
            </m.div>
          )}
        </AnimatePresence>

        {/* Badge de descuento */}
        {product.discountPercentage && product.discountPercentage > 0 && (
          <div className="absolute top-2.5 left-2.5 z-10 bg-gradient-to-r from-red-500 to-rose-600 text-white px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider shadow-md shadow-red-500/20 tabular-nums">
            -{Math.round(product.discountPercentage)}%
          </div>
        )}

        {/* Overlay cuando no hay stock */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-50/75 dark:bg-slate-950/75 flex items-center justify-center">
            <span className="text-xs font-extrabold text-red-600 bg-red-100 dark:bg-red-950/80 px-3.5 py-1.5 rounded-full tracking-wider border border-red-200 dark:border-red-900/50">
              Sin stock
            </span>
          </div>
        )}
      </div>

      {/* Zona de contenido */}
      <div className="flex flex-col gap-2.5 p-4 grow">
        <div className="flex items-center justify-between gap-1">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary/10 text-primary dark:bg-primary/20 text-[9px] font-bold tracking-wider uppercase max-w-[55%] truncate">
            {product.category}
          </span>
          {product.rating && <StarRating rating={product.rating} />}
        </div>

        <p
          title={product.title}
          className="text-sm font-semibold leading-snug text-slate-800 dark:text-slate-200 line-clamp-2 min-h-[2.6rem] hover:text-primary transition-colors"
        >
          {product.title}
        </p>

        <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-baseline gap-1.5 tabular-nums">
              <span className="text-base font-extrabold text-primary tracking-tight">
                {formatPrice(product.price)}
              </span>
              {product.discountPercentage && product.discountPercentage > 0 && (
                <span className="text-[10px] text-slate-400 dark:text-slate-500 line-through font-medium">
                  {originalPrice(product.price, product.discountPercentage)}
                </span>
              )}
            </div>
            <span className={`text-[9px] font-bold mt-0.5 block ${
              isOutOfStock
                ? 'text-red-500'
                : stockStatus === 'ok'
                  ? 'text-emerald-600 dark:text-emerald-500'
                  : 'text-amber-600 dark:text-amber-500'
            }`} aria-live="polite">
              {isOutOfStock
                ? 'Sin stock'
                : stockStatus === 'ok'
                  ? `${product.stock} disponibles`
                  : `Solo ${product.stock} restantes`}
            </span>
          </div>

          <m.button
            type="button"
            onClick={(e) => { e.stopPropagation(); if (!isOutOfStock) openProductModal(product) }}
            disabled={isOutOfStock}
            aria-label={`Ver detalle de ${product.title}`}
            animate={shouldReduceMotion ? { opacity: 1 } : {
              opacity: isHovered ? 1 : 0.9,
              scale: isHovered ? 1.02 : 1,
            }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }}
            className={`inline-flex items-center justify-center px-3.5 h-8 sm:h-9 rounded-full text-xs font-bold border-none transition-all shrink-0 ${
              isOutOfStock
                ? 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
                : 'bg-primary/10 text-primary hover:bg-primary hover:text-white dark:bg-primary/20 dark:text-emerald-400 dark:hover:bg-primary dark:hover:text-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40'
            }`}
          >
            {isOutOfStock ? 'Agotado' : 'Detalles'}
          </m.button>
        </div>
      </div>
    </m.article>
  )
})

ProductCard.displayName = 'ProductCard'

export default ProductCard

