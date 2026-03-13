import { memo } from 'react'
import { motion as m } from 'framer-motion'
import { ProductCard } from '@/widgets/ProductCard'
import type { IProduct } from '@/features/products/application/types'
import { staggerContainer, slideUp } from '@/shared/lib/animations'

interface ProductGridProps {
  products: IProduct[]
}

const ProductGrid = memo(({ products }: ProductGridProps) => {
  return (
    <m.div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {products.map((product: IProduct) => (
        <m.div key={product.id} variants={slideUp}>
          <ProductCard product={product} />
        </m.div>
      ))}
    </m.div>
  )
})

ProductGrid.displayName = 'ProductGrid'

export { ProductGrid }
