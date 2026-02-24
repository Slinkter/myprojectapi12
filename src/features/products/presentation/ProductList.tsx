/**
 * @file ProductList.tsx
 * @description Componente de alto nivel que gestiona la visualización de la lista de productos,
 * incluyendo estados de carga, error y paginación infinita.
 * @architecture Presentation Layer - Componente de Feature
 */

import { memo } from "react";
import ProductGrid from "@/features/products/presentation/ProductGrid";
import ErrorMessage from "@/components/common/ErrorMessage";
import ButtonMore from "@/features/products/presentation/components/ButtonMore";
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
  /* variables props */
  const { products, loading, error, hasMore, loadMore } = props;

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
  if (products.length === 0 && !loading) {
    return (
      <p className="text-center text-slate-500 py-10">
        No se encontraron productos.
      </p>
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

export default ProductList;
