import React from 'react'
import { cn } from '@/shared/lib/cn'
import { getStockStatus } from '@/shared/lib/stockUtils'
import { useProductModalContext } from '@/features/products/application/useProductModalContext'
import type { IProduct } from '@/features/products/application/types'
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'

interface ProductCardProps {
  product: IProduct
}

const ProductCard = React.memo(({ product }: ProductCardProps) => {
  const { openProductModal } = useProductModalContext()
  
  if (!product || !product.id) {
    console.error('ProductCard component received invalid product:', product)
    return null
  }
  
  const stockStatus = getStockStatus(product.stock)

  return (
    <Card
      className="group relative h-full flex flex-col overflow-hidden border-border bg-card transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 rounded-2xl cursor-pointer"
      role="article"
      aria-label={`Producto: ${product.title}`}
    >
      <CardHeader className="p-0">
        <div className="aspect-square w-full overflow-hidden bg-secondary p-6 flex items-center justify-center">
          <img
            className="h-full w-full object-contain transition-opacity duration-300 group-hover:opacity-80"
            src={product.thumbnail}
            alt={product.title}
            loading="lazy"
          />
        </div>
      </CardHeader>

      <CardContent className="p-5 flex flex-col">
        <div className="mb-2">
          <h3 className="font-bold text-base leading-tight text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-border mt-auto pt-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
              Precio
            </span>
            <span className="font-bold text-lg text-foreground">
              ${product.price}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
              Stock
            </span>
            <p
              className={cn(
                'text-xs font-bold',
                stockStatus === 'ok' ? 'text-success' : 'text-warning'
              )}
            >
              {product.stock} disponibles
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Button
          onClick={() => openProductModal(product)}
          disabled={stockStatus === 'out'}
          className="w-full"
          variant={stockStatus !== 'out' ? 'default' : 'secondary'}
        >
          {stockStatus !== 'out' ? 'Ver detalles' : 'Sin stock'}
        </Button>
      </CardFooter>
    </Card>
  )
})

ProductCard.displayName = 'ProductCard'

export { ProductCard }
