/**
 * @file LoadMoreSection.tsx
 * @description Sección de control de paginación manual "Cargar más" con botón de carga y spinner.
 * @architecture Presentation Layer - Product Component
 */

import { memo } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { useLogLifecycle } from "@/shared/hooks";
import type { IProduct } from "@/features/products/application/types";

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
 * @param {ILoadMoreSectionProps} props - Propiedades del componente.
 * @returns {JSX.Element} Elemento JSX con la sección de paginación.
 */
const LoadMoreSection = memo((props: ILoadMoreSectionProps) => {
  useLogLifecycle("LoadMoreSection");
  const { products, hasMore, loadMoreProducts, isLoading } = props;

  return (
    <div className="flex flex-col items-center justify-center w-full mt-6 mb-4">
      {hasMore && (
        <Button
          onClick={loadMoreProducts}
          disabled={isLoading}
          variant="default"
          size="lg"
          className="mt-4"
          aria-label={isLoading ? "Cargando más items..." : "Cargar más items"}
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin mr-2" />
              <span>Cargando...</span>
            </>
          ) : (
            "Cargar más productos"
          )}
        </Button>
      )}

      {!hasMore && products.length > 0 && (
        <p className="text-center text-slate-500 dark:text-slate-400 mt-4 text-sm">
          Has llegado al final de la lista.
        </p>
      )}
    </div>
  );
});

LoadMoreSection.displayName = "LoadMoreSection";

export default LoadMoreSection;
