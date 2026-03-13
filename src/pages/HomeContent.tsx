/**
 * @file HomeContent.tsx
 * @description Página principal de la aplicación. Orquesta la carga de productos,
 * el estado de carga inicial, el modal de detalle y la paginación infinita.
 * @architecture Presentation Layer - Página
 */

import { useState, useCallback, useEffect } from 'react'
import { useProducts } from '@/features/products/application/useProducts'
import { useProductModalContext } from '@/features/products/application/useProductModalContext'
import { SearchInput } from '@/features/products/presentation/components/SearchInput'
import { LoadingProgress } from '@/components/common/LoadingProgress'
import SkeletonGrid from '@/features/products/presentation/SkeletonGrid'
import ProductList from '@/features/products/presentation/ProductList'
import ProductDetailModal from '@/features/products/presentation/ProductDetailModal'
import HomeHeader from '@/pages/HomeHeader'
import { useDebounce } from '@/shared/hooks/useDebounce'

export const HomeContent = () => {
  const { products, initialLoading, loading, error, loadMore, hasMore } = useProducts()
  const { selectedProduct, isModalOpen, handleCloseModal } = useProductModalContext()
  const isLoading = initialLoading || loading
  
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery, 350)
  
  const [filteredProducts, setFilteredProducts] = useState(products)
  
  useEffect(() => {
    if (!debouncedSearch) {
      setFilteredProducts(prev => {
        if (prev !== products && JSON.stringify(prev) !== JSON.stringify(products)) {
          return products
        }
        return prev
      })
    } else {
      const lowerQuery = debouncedSearch.toLowerCase()
      const filtered = products.filter(
        (p) =>
          p.title.toLowerCase().includes(lowerQuery) ||
          p.description.toLowerCase().includes(lowerQuery) ||
          p.category?.toLowerCase().includes(lowerQuery) ||
          p.brand?.toLowerCase().includes(lowerQuery)
      )
      setFilteredProducts(prev => {
        if (JSON.stringify(prev) !== JSON.stringify(filtered)) {
          return filtered
        }
        return prev
      })
    }
  }, [debouncedSearch, products])

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  return (
    <>
      <LoadingProgress isLoading={isLoading} />
      <div className="container mx-auto px-4 py-8">
      <HomeHeader />
      
      <div className="mb-8 max-w-xl mx-auto">
        <SearchInput
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Buscar productos por nombre, descripción o categoría..."
        />
        {searchQuery && (
          <p className="mt-2 text-sm text-muted-foreground text-center">
            {filteredProducts.length} resultado{filteredProducts.length !== 1 ? 's' : ''} para &quot;{searchQuery}&quot;
          </p>
        )}
      </div>
      
      {initialLoading && <SkeletonGrid />}
      {!initialLoading && (
        <ProductList
          products={filteredProducts}
          loading={loading}
          error={error}
          hasMore={hasMore && !searchQuery}
          loadMore={loadMore}
        />
      )}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          open={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
      </div>
    </>
  )
}
