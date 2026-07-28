import LoadMoreButton from "@/features/products/presentation/components/LoadMoreButton";
import { IProduct } from "@/features/products/application/types";
import { useLogLifecycle } from "@/shared/hooks";

/**
 * @interface ILoadMoreSectionProps
 * @description Propiedades del componente LoadMoreSection.
 */
export interface ILoadMoreSectionProps {
  /** Lista de productos cargados actualmente. */
  products: IProduct[];
  /** Indica si existen más páginas disponibles. */
  hasMore: boolean;
  /** Indica si hay una operación de carga en curso. */
  isLoading: boolean;
  /** Función para solicitar la siguiente página. */
  loadMoreProducts: () => void;
}

/**
 * Sección de control de paginación "Cargar más".
 *
 * @remarks
 * Muestra el botón `LoadMoreButton` si hay más páginas disponibles.
 * Cuando se han cargado todos los productos, muestra un mensaje
 * "Has llegado al final de la lista".
 *
 * @component
 * @param props.products - Lista actual de productos.
 * @param props.hasMore - Si hay más productos por cargar.
 * @param props.isLoading - Si hay una carga en progreso.
 * @param props.loadMoreProducts - Callback para cargar más.
 * @returns Elemento JSX con la sección de paginación.
 */
const LoadMoreSection = (props: ILoadMoreSectionProps) => {
  useLogLifecycle("LoadMoreSection");
  const { products, hasMore, loadMoreProducts, isLoading } = props;
  return (
    <div className="flex flex-col items-center justify-center w-full mt-6 mb-4">
      {hasMore && <LoadMoreButton onClick={loadMoreProducts} isLoading={isLoading} />}

      {!hasMore && products.length > 0 && (
        <p className="text-center text-slate-500 dark:text-slate-400 mt-4 text-sm">
          Has llegado al final de la lista.
        </p>
      )}
    </div>
  );
};

export default LoadMoreSection;
