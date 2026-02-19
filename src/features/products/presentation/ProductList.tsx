/**
 * @file ProductList.tsx
 * @description Componente de alto nivel que gestiona la visualización de la lista de productos,
 * incluyendo estados de carga, error y paginación infinita.
 * @architecture Presentation Layer - Componente de Feature
 */

import { memo } from "react";
import ProductGrid from "@/features/products/presentation/ProductGrid";
import ErrorMessage from "@/components/common/ErrorMessage";
import LoadMoreButton from "@/features/products/presentation/components/LoadMoreButton";
import { IProductListProps } from "@/features/products/presentation/type";
import { IProduct } from "@/features/products/application/types";

/**
 * @component ProductList
 * @description Orquesta el ProductGrid y los controles de paginación.
 * Maneja visualmente los estados de error y la carga progresiva mediante un botón "Load More".
 * Memoizado para optimizar el rendimiento durante actualizaciones de otros estados.
 *
 * @param {IProductListProps} props - Propiedades del componente.
 * @returns {JSX.Element} La sección de lista de productos con controles.
 */
const ProductList = memo((props: IProductListProps) => {
  /* variables props */
  const { products, loading, error, hasMore, loadMore } = props;
  // Renderizado de estado de error
  if (error) {
    return (
      <ErrorMessage
        message={error}
        title="Failed to load products"
        action={{
          label: "Try again",
          onClick: loadMore,
        }}
      />
    );
  }

  // Renderizado de estado vacío
  if (products.length === 0 && !loading) {
    return (
      <p className="text-center text-slate-500 py-10">No products found.</p>
    );
  }

  return (
    <>
      <ProductGrid products={products} />
      <ButtonMore
        products={products}
        hasMore={hasMore}
        loadMore={loadMore}
        loading={loading}
      />
    </>
  );
});

ProductList.displayName = "ProductList";

interface IButtonMore {
  products: IProduct[];
  hasMore: boolean;
  loading: boolean;
  loadMore: () => void;
}

const ButtonMore = (props: IButtonMore) => {
  const { products, hasMore, loadMore, loading } = props;
  return (
    <div className="flex flex-col items-center justify-center w-full mt-12 mb-8">
      {hasMore && <LoadMoreButton onClick={loadMore} loading={loading} />}

      {!hasMore && products.length > 0 && (
        <p className="text-center text-slate-500 dark:text-slate-400 mt-8">
          Has llegado al final de la lista.
        </p>
      )}
    </div>
  );
};

export default ProductList;
