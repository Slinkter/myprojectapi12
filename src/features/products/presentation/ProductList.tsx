/**
 * @file ProductList.tsx
 * @description Componente de alto nivel que gestiona la visualización de la lista de productos,
 * incluyendo estados de carga, error y paginación infinita con renderizado diferido.
 * @architecture Presentation Layer - Componente de Feature
 */

import { memo, useDeferredValue } from "react";
import { Archive } from "lucide-react";
import ProductGrid from "@/features/products/presentation/ProductGrid";
import ErrorMessage from "@/shared/ui/ErrorMessage";
import EmptyState from "@/shared/ui/EmptyState";
import LoadMoreSection from "@/features/products/presentation/components/LoadMoreSection";
import { IProductListProps } from "@/features/products/presentation/type";
import { useLogLifecycle } from "@/shared/hooks";

/**
 * @component ProductList
 * @description Orquesta el ProductGrid y los controles de paginación.
 * Maneja visualmente los estados de error y la carga progresiva mediante un botón "Cargar más".
 * Implementa `useDeferredValue` para transiciones de filtrado fluidas y no bloqueantes.
 * Memoizado para optimizar el rendimiento durante actualizaciones de otros estados.
 *
 * @param {IProductListProps} props - Propiedades del componente.
 * @returns {JSX.Element} La sección de lista de productos con controles.
 */
const ProductList = memo((props: IProductListProps) => {
  useLogLifecycle("ProductList");
  const { products, isLoading, error, hasMore, loadMoreProducts } = props;

  // Aplica useDeferredValue a los productos para evitar bloqueos durante el renderizado (rerender-use-deferred-value)
  const deferredProducts = useDeferredValue(products);
  const isStale = products !== deferredProducts;

  // Renderizado de estado de error
  if (error) {
    return (
      <ErrorMessage
        message={error}
        title="Error al cargar los productos"
        action={{
          label: "Reintentar",
          onClick: loadMoreProducts,
        }}
      />
    );
  }

  // Renderizado de estado vacío
  if (deferredProducts.length === 0 && !isLoading) {
    return (
      <EmptyState
        icon={<Archive size={40} />}
        title="No se encontraron productos"
        description="No hay productos disponibles en este momento. Intenta más tarde o explora otras categorías."
        actionLabel="Recargar"
        onAction={loadMoreProducts}
        className="min-h-[400px]"
      />
    );
  }

  return (
    <div
      style={{ opacity: isStale ? 0.7 : 1 }}
      className="transition-opacity duration-200"
    >
      <ProductGrid products={deferredProducts} />
      <LoadMoreSection
        products={deferredProducts}
        hasMore={hasMore}
        loadMoreProducts={loadMoreProducts}
        isLoading={isLoading}
      />
    </div>
  );
});

ProductList.displayName = "ProductList";

export default ProductList;
