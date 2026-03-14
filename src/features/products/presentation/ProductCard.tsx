/**
 * @file ProductCard.tsx
 * @description Tarjeta de producto individual con optimizaciones UX/UI.
 * - LazyImage con blur-up effect
 * - Micro-interactions en hover
 * - Optimizado para performance
 * @architecture Presentation Layer - Componente de Feature
 */

import React, { useCallback } from 'react'
import { cn } from '@/lib/utils'
import { useProductModalContext } from '@/features/products/application/useProductModalContext'
import { getStockStatus } from '@/shared/lib/stockUtils'
import type { IProduct } from '@/features/products/application/types'
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { LazyImage } from '@/components/common/LazyImage'

interface IProductCardProps {
  product: IProduct
}

const ProductCard = React.memo(({ product }: IProductCardProps) => {
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
    <Card
      className="group relative h-full flex flex-col overflow-hidden border-border bg-card transition-all duration-500 hover:shadow-premium hover:-translate-y-1 rounded-2xl cursor-pointer"
      role="article"
      aria-label={`Producto: ${product.title}`}
      onClick={handleClick}
    >
      {/* Badge de Descuento */}
      {product.discountPercentage && (
        <div className="absolute top-3 left-3 z-10 bg-destructive/90 text-white px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-lg animate-in fade-in zoom-in duration-300">
          -{Math.round(product.discountPercentage)}%
        </div>
      )}

      {/* Imagen con blur-up effect */}
      <CardHeader className="p-0 overflow-hidden relative">
        <LazyImage
          src={product.thumbnail}
          alt={product.title}
          className="rounded-t-2xl"
        />
        {/* Overlay sutil al hover */}
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500" />
      </CardHeader>

      {/* Contenido */}
      <CardContent className="p-5 flex flex-col gap-2 flex-1">
        {/* Categoría + Rating */}
        <div className="flex justify-between items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
            {product.category}
          </span>
          <span className="text-xs font-bold text-accent-foreground flex items-center gap-1">
            <span>★</span>
            {product.rating?.toFixed(1)}
          </span>
        </div>

        {/* Título */}
        <h3 className="font-serif text-lg leading-tight text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-1">
          {product.title}
        </h3>

        {/* Descripción */}
        <p className="text-sm text-muted-foreground line-clamp-2 font-sans leading-relaxed">
          {product.description}
        </p>
      </CardContent>

      {/* Footer: precio + botón */}
      <CardFooter className="px-5 pb-5 pt-4 flex items-end justify-between gap-4 border-t border-border/50">
        {/* Bloque de precio */}
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-xl font-bold text-foreground leading-none">
            ${product.price.toFixed(2)}
          </span>
          <span
            className={cn(
              'text-[10px] uppercase tracking-wider font-bold mt-1 transition-colors duration-300',
              stockStatus === 'ok' ? 'text-success' : 'text-warning'
            )}
          >
            {isOutOfStock ? 'Agotado' : `${product.stock} en stock`}
          </span>
        </div>

        {/* Botón con micro-interaction */}
        <Button
          onClick={(e) => {
            e.stopPropagation()
            openProductModal(product)
          }}
          disabled={isOutOfStock}
          size="sm"
          variant="outline"
          className="shrink-0 self-end rounded-full border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 hover:scale-105 active:scale-95 px-5"
        >
          {isOutOfStock ? (
            'Sin stock'
          ) : (
            <span className="flex items-center gap-1.5">
              Ver detalles
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
            </span>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
})

ProductCard.displayName = 'ProductCard'

export default ProductCard
