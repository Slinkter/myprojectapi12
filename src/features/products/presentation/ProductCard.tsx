/**
 * @file ProductCard.tsx
 * @description Tarjeta de producto individual con diseño limpio.
 * @architecture Presentation Layer - Componente de Feature
 */

import React, { useCallback } from 'react'
import { useLogLifecycle } from "@/shared/hooks";
import { cn } from '@/shared/lib/cn'
import { useProductModalContext } from '@/features/products/application/useProductModalContext'
import { getStockStatus } from '@/shared/lib/stockUtils'
import type { IProduct } from '@/features/products/application/types'
import { Button } from '@/shared/ui/Button'
import { LazyImage } from '@/shared/ui/LazyImage';

interface IProductCardProps {
  product: IProduct
}

const ProductCard = React.memo(({ product }: IProductCardProps) => {
  useLogLifecycle("ProductCard");
  const { openProductModal } = useProductModalContext()

  const handleClick = useCallback(() => {
    openProductModal(product)
  }, [openProductModal, product])

  if (!product || !product.id) {
    console.error('ProductCard received invalid product:', product)
    return null
  }

  const stockStatus = getStockStatus(product.stock)
  const isOutOfStock = stockStatus === 'out'

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-background hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      aria-label={`Producto: ${product.title}`}
      onClick={handleClick}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      role="button"
      tabIndex={0}
    >
      {product.discountPercentage && (
        <div className="absolute top-3 left-3 z-10 bg-destructive text-white px-2.5 py-1 rounded-full text-xs font-bold" aria-label={`Descuento: ${Math.round(product.discountPercentage)}%`}>
          -{Math.round(product.discountPercentage)}%
        </div>
      )}

      <div className="relative overflow-hidden bg-muted/30">
        <LazyImage
          src={product.thumbnail}
          alt={product.title}
          className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex justify-between items-center">
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
            {product.category}
          </span>
          <span className="text-xs font-medium text-amber-500 flex items-center gap-1">
            ★ {product.rating?.toFixed(1)}
          </span>
        </div>

        <h3 className="text-base font-semibold text-foreground line-clamp-1">
          {product.title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>

        <div className="mt-auto pt-3 flex items-end justify-between gap-2">
          <div>
            <span className="text-xl font-bold text-foreground">
              ${product.price.toFixed(2)}
            </span>
            <p className={cn(
              'text-xs font-medium mt-0.5',
              stockStatus === 'ok' ? 'text-success' : 'text-warning'
            )}>
              {isOutOfStock ? 'Agotado' : `${product.stock} disponibles`}
            </p>
          </div>

          <Button
            onClick={(e) => {
              e.stopPropagation()
              openProductModal(product)
            }}
            disabled={isOutOfStock}
            size="sm"
            className="rounded-lg"
          >
            {isOutOfStock ? 'Sin stock' : 'Ver más'}
          </Button>
        </div>
      </div>
    </article>
  )
})

ProductCard.displayName = 'ProductCard'

export default ProductCard

