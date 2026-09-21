/**
 * @file ProductCard.tsx
 * @description Componente de presentación para renderizar la tarjeta visual interactiva de producto.
 * @architecture Presentation Layer - Product Component
 */

import React, { useCallback, useState, useRef } from 'react'
import { m, useReducedMotion } from 'framer-motion'
import { useLogLifecycle } from "@/shared/hooks";
import { useProductModalContext } from '@/features/products/application/useProductModalContext'
import { useCartActions } from '@/features/cart/application/CartActionsContext'
import { getStockStatus } from '@/entities/product'
import type { IProduct } from '@/features/products/application/types'
import { LazyImage } from '@/shared/ui/LazyImage';
import { Eye, ShoppingBag, Pencil, Trash2 } from 'lucide-react'
import { useAuth } from '@/features/auth/application/AuthContext'

import { formatPrice } from '@/shared/lib'

/**
 * Props para el componente ProductCard.
 * @interface ProductCardProps
 */
export interface ProductCardProps {
  /** Objeto de producto con datos dominiales. */
  product: IProduct;
}

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
        y: -4,
        boxShadow: '0 12px 28px -6px rgba(0, 0, 0, 0.08), 0 8px 12px -4px rgba(0, 0, 0, 0.04)',
        borderColor: 'rgba(5, 150, 105, 0.4)',
      }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.25, ease: [0.2, 0, 0.2, 1] }}
      className={`group flex flex-col h-full rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 text-card-foreground shadow-sm relative transition-colors ${
        isOutOfStock ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
      }`}
    >
      {/* Botones de Admin */}
      {isAdmin && (
        <div className="absolute top-3 right-3 z-20 flex gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onEdit) onEdit(product);
            }}
            aria-label={`Editar ${product.title}`}
            className="p-1.5 rounded-full bg-white/90 hover:bg-white dark:bg-slate-800/90 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-primary transition-colors shadow-sm active:scale-95 flex items-center justify-center cursor-pointer backdrop-blur-sm"
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
            className="p-1.5 rounded-full bg-white/90 hover:bg-white dark:bg-slate-800/90 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-red-600 transition-colors shadow-sm active:scale-95 flex items-center justify-center cursor-pointer backdrop-blur-sm"
          >
            <Trash2 size={12} />
          </button>
        </div>
      )}

      {/* Zona de imagen con fondo neutro limpio y sin corte */}
      <div className="aspect-[4/3] w-full overflow-hidden rounded-t-2xl bg-slate-50/70 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800/80 relative shrink-0 p-4 flex items-center justify-center">
        <m.div
          className="w-full h-full flex items-center justify-center"
          animate={{ scale: isHovered && !isOutOfStock && !shouldReduceMotion ? 1.04 : 1 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3, ease: [0.2, 0, 0.2, 1] }}
        >
          <LazyImage
            src={product.thumbnail}
            alt={product.title}
            aspectRatio="aspect-auto"
            className="w-full h-full flex items-center justify-center bg-transparent"
            imgStyle={{ objectFit: 'contain', maxHeight: '100%', maxWidth: '100%' }}
          />
        </m.div>

        {/* Acciones de acceso rápido flotantes — discretas, sin overlay negro invasivo */}
        {!isOutOfStock && (
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <button
              type="button"
              onClick={handleAddToCart}
              aria-label={`Añadir ${product.title} al carrito`}
              title="Añadir al carrito"
              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary hover:bg-primary-hover text-white transition-colors shadow-md active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <ShoppingBag size={14} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openProductModal(product);
              }}
              aria-label={`Vista rápida de ${product.title}`}
              title="Vista rápida"
              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/95 dark:bg-slate-800/95 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors shadow-md active:scale-95 cursor-pointer backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Eye size={14} />
            </button>
          </div>
        )}

        {/* Badge de descuento minimalista */}
        {product.discountPercentage && product.discountPercentage > 0 && (
          <div className="absolute top-3 left-3 z-10 bg-rose-500/90 text-white font-medium px-2 py-0.5 rounded-md text-[10px] tracking-wide shadow-sm tabular-nums backdrop-blur-xs">
            -{Math.round(product.discountPercentage)}%
          </div>
        )}

        {/* Overlay cuando no hay stock */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-[1px] flex items-center justify-center rounded-t-2xl">
            <span className="text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-3 py-1 rounded-full border border-rose-200 dark:border-rose-900/40">
              Agotado
            </span>
          </div>
        )}
      </div>

      {/* Zona de contenido */}
      <div className="flex flex-col gap-2 p-4 grow">
        <div className="flex items-center justify-between gap-1">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium tracking-wide uppercase text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 max-w-[55%] truncate">
            {product.category}
          </span>
          {product.rating && <StarRating rating={product.rating} />}
        </div>

        <h3
          title={product.title}
          className="text-sm font-medium leading-snug text-slate-900 dark:text-slate-100 line-clamp-2 min-h-[2.6rem] group-hover:text-primary transition-colors"
        >
          {product.title}
        </h3>

        <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <div>
            <div className="flex items-baseline gap-1.5 tabular-nums">
              <span className="text-base font-bold text-slate-900 dark:text-slate-50 tracking-tight">
                {formatPrice(product.price)}
              </span>
              {product.discountPercentage && product.discountPercentage > 0 && (
                <span className="text-[11px] text-slate-400 dark:text-slate-500 line-through">
                  {originalPrice(product.price, product.discountPercentage)}
                </span>
              )}
            </div>
            <span className={`text-[10px] font-medium mt-0.5 block ${
              isOutOfStock
                ? 'text-rose-500'
                : stockStatus === 'ok'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-amber-600 dark:text-amber-400'
            }`} aria-live="polite">
              {isOutOfStock
                ? 'Sin stock'
                : stockStatus === 'ok'
                  ? `${product.stock} disponibles`
                  : `Solo ${product.stock} restantes`}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); if (!isOutOfStock) openProductModal(product) }}
            disabled={isOutOfStock}
            aria-label={`Ver detalle de ${product.title}`}
            className={`inline-flex items-center justify-center px-3.5 h-8 rounded-lg text-xs font-medium transition-colors shrink-0 ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
                : 'bg-slate-100 hover:bg-primary hover:text-white text-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-primary dark:hover:text-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40'
            }`}
          >
            {isOutOfStock ? 'Agotado' : 'Detalles'}
          </button>
        </div>
      </div>
    </m.article>
  )
})

ProductCard.displayName = 'ProductCard'

export default ProductCard

