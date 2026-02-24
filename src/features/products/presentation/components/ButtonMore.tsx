/**
 * @file ButtonMore.tsx
 * @description Botón de paginación "Cargar más" junto al mensaje de fin de lista.
 * @architecture Presentation Layer - Componente de Feature
 */

import LoadMoreButton from "@/features/products/presentation/components/LoadMoreButton";
import { IProduct } from "@/features/products/application/types";

/**
 * @interface IButtonMoreProps
 * @description Props del componente ButtonMore.
 */
interface IButtonMoreProps {
  /** Lista de productos actualmente cargados */
  products: IProduct[];
  /** Indica si hay más páginas disponibles */
  hasMore: boolean;
  /** Indica si se está cargando la siguiente página */
  loading: boolean;
  /** Función para cargar la siguiente página */
  loadMore: () => void;
}

/**
 * @component ButtonMore
 * @description Renderiza el botón "Cargar más" si hay páginas pendientes,
 * o un mensaje de fin de lista cuando ya no hay más productos.
 */
const ButtonMore = (props: IButtonMoreProps) => {
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

export default ButtonMore;
