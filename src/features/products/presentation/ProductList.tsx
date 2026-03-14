/**
 * @file ProductList.tsx
 * @description Componente de alto nivel que gestiona la visualización de la lista de productos,
 * incluyendo estados de carga, error y paginación infinita.
 * @architecture Presentation Layer - Componente de Feature
 */

import { memo } from "react";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import ProductGrid from "@/features/products/presentation/ProductGrid";
import ErrorMessage from "@/components/common/ErrorMessage";
import EmptyState from "@/components/common/EmptyState";
import LoadMoreSection from "@/features/products/presentation/components/LoadMoreSection";
import { IProductListProps } from "@/features/products/presentation/type";

/**
 * @component ProductList
 * @description Orquesta el ProductGrid y los controles de paginación.
 * Maneja visualmente los estados de error y la carga progresiva mediante un botón "Cargar más".
 * Memoizado para optimizar el rendimiento durante actualizaciones de otros estados.
 *
 * @param {IProductListProps} props - Propiedades del componente.
 * @returns {JSX.Element} La sección de lista de productos con controles.
 */
const ProductList = memo((props: IProductListProps) => {
  const { products, isLoading, error, hasMore, loadMore } = props;

  // Renderizado de estado de error
  if (error) {
    return (
      <ErrorMessage
        message={error}
        title="Error al cargar los productos"
        action={{
          label: "Reintentar",
          onClick: loadMore,
        }}
      />
    );
  }

  // Renderizado de estado vacío
  if (products.length === 0 && !isLoading) {
    return (
      <EmptyState
        icon={<HiOutlineShoppingBag className="w-10 h-10" />}
        title="No se encontraron productos"
        description="No hay productos disponibles en este momento. Intenta más tarde o explora otras categorías."
        actionLabel="Recargar"
        onAction={loadMore}
        className="min-h-[400px]"
      />
    );
  }

  return (
    <>
      <ProductGrid products={products} />
      <LoadMoreSection
        products={products}
        hasMore={hasMore}
        loadMore={loadMore}
        isLoading={isLoading}
      />
    </>
  );
});

ProductList.displayName = "ProductList";

export default ProductList;
