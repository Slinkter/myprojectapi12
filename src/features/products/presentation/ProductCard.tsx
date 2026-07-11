import React, { useCallback, useState } from 'react'
import { m, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useLogLifecycle } from "@/shared/hooks";
import { useProductModalContext } from '@/features/products/application/useProductModalContext'
import { useCart } from '@/features/cart/application/CartContext'
import { getStockStatus } from '@/shared/lib/stockUtils'
import type { IProduct } from '@/features/products/application/types'
import { LazyImage } from '@/shared/ui/LazyImage';
import { Plus, Eye } from 'lucide-react'

/** Precio formateado con separador de miles */
const formatPrice = (price: number): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

/** Precio original antes del descuento */
const originalPrice = (price: number, discount: number): string =>
  formatPrice(price / (1 - discount / 100));

/** Custom SVG Star Rating */
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
    <div className="flex items-center gap-0.5 leading-none">
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

interface IProductCardProps {
  product: IProduct
}

const ProductCard = React.memo(({ product }: IProductCardProps) => {
  useLogLifecycle("ProductCard");
  const shouldReduceMotion = useReducedMotion();
  const { openProductModal } = useProductModalContext()
  const { addToCart } = useCart()
  const [isHovered, setIsHovered] = useState(false)

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
      role="button"
      tabIndex={isOutOfStock ? -1 : 0}
      aria-label={`Ver detalle de ${product.title}${isOutOfStock ? ' (Sin stock)' : ''}`}
      aria-disabled={isOutOfStock}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={(isOutOfStock || shouldReduceMotion) ? {} : {
        y: -8,
        boxShadow: '0 20px 30px -10px rgba(5, 150, 105, 0.15)',
        borderColor: 'rgba(5, 150, 105, 0.45)',
      }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className={`flex flex-col h-full rounded-xl border border-slate-200 dark:border-slate-800 bg-card text-card-foreground shadow-sm overflow-hidden relative ${
        isOutOfStock ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
      }`}
    >
      {/* ── IMAGE ZONE ── */}
      <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-white/20 to-transparent dark:from-white/5 dark:to-transparent border-b border-slate-200 dark:border-slate-800 relative shrink-0">
        {/* Imagen con zoom suave al hover */}
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

        {/* Overlay oscuro al hover con CTA rápido */}
        <AnimatePresence>
          {isHovered && !isOutOfStock && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center gap-2.5"
            >
              {/* Quick Add to Cart */}
              <m.button
                type="button"
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 12, opacity: 0 }}
                transition={{ duration: 0.25, delay: 0.02, ease: "easeOut" }}
                onClick={handleAddToCart}
                aria-label={`Añadir ${product.title} al carrito`}
                className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full border-none bg-primary text-white text-xs font-bold cursor-pointer hover:bg-primary-hover active:scale-95 transition-all shadow-lg shadow-primary/20 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
              >
                <Plus size={14} />
                Añadir
              </m.button>

              {/* Quick View */}
              <m.button
                type="button"
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 12, opacity: 0 }}
                transition={{ duration: 0.25, delay: 0.06, ease: "easeOut" }}
                onClick={(e) => { e.stopPropagation(); openProductModal(product) }}
                aria-label={`Vista rápida de ${product.title}`}
                className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full border border-slate-700 bg-slate-900/85 hover:bg-slate-900 text-white text-xs font-bold cursor-pointer backdrop-blur active:scale-95 transition-all shadow-lg focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
              >
                <Eye size={14} />
                Ver
              </m.button>
            </m.div>
          )}
        </AnimatePresence>

        {/* Discount Badge */}
        {product.discountPercentage && product.discountPercentage > 0 && (
          <div className="absolute top-2.5 left-2.5 z-10 bg-red-500 text-white px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider shadow-[0_2px_8px_rgba(220,38,38,0.25)]">
            -{Math.round(product.discountPercentage)}%
          </div>
        )}

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-50/70 dark:bg-slate-950/70 flex items-center justify-center">
            <span className="text-xs font-extrabold text-red-600 bg-red-100 dark:bg-red-950/80 px-3.5 py-1.5 rounded-full tracking-wider border border-red-200 dark:border-red-900/50">
              Sin stock
            </span>
          </div>
        )}
      </div>

      {/* ── CONTENT ZONE ── */}
      <div className="flex flex-col gap-2.5 p-4 grow">
        {/* Category chip + Rating */}
        <div className="flex items-center justify-between gap-1">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary/8 text-primary dark:bg-primary/15 text-[9px] font-bold tracking-wider uppercase max-w-[55%] truncate">
            {product.category}
          </span>
          {product.rating && <StarRating rating={product.rating} />}
        </div>

        {/* Title */}
        <p
          title={product.title}
          className="text-sm font-semibold leading-snug text-slate-800 dark:text-slate-200 line-clamp-2 min-h-[2.6rem] hover:text-primary transition-colors"
        >
          {product.title}
        </p>

        {/* Price + Stock */}
        <div className="flex items-center justify-between gap-1 mt-auto pt-3 border-t border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-baseline gap-1.5">
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
            }`}>
              {isOutOfStock
                ? '✕ Sin stock'
                : stockStatus === 'ok'
                  ? `✓ ${product.stock} disponibles`
                  : `⚠ Solo ${product.stock} restantes`}
            </span>
          </div>

          {/* CTA Button */}
          <m.button
            type="button"
            onClick={(e) => { e.stopPropagation(); if (!isOutOfStock) openProductModal(product) }}
            disabled={isOutOfStock}
            aria-label={`Ver detalle de ${product.title}`}
            animate={shouldReduceMotion ? { opacity: 1 } : {
              opacity: isHovered ? 1 : 0.85,
              scale: isHovered ? 1.02 : 1,
            }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }}
            className={`inline-flex items-center justify-center px-4 h-8.5 rounded-full text-xs font-bold border-none transition-colors shrink-0 ${
              isOutOfStock
                ? 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
                : 'bg-primary/8 text-primary hover:bg-primary/18 dark:bg-primary/15 dark:text-emerald-450 dark:hover:bg-primary/25 cursor-pointer'
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
