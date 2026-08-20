/**
 * @file ProductStockInfo.tsx
 * @description Indicador de estado y disponibilidad de inventario.
 * @architecture Presentation Layer - Product Component
 */

import { StockStatus } from "@/entities/product";
import { cn } from "@/shared/lib/cn";

/**
 * @interface ProductStockInfoProps
 * @description Propiedades del componente ProductStockInfo.
 */
export interface ProductStockInfoProps {
  /** Cantidad de unidades en inventario. */
  stock: number;
  /** Estado del stock: 'ok', 'low' o 'out'. */
  status: StockStatus;
}

/**
 * Muestra la información de disponibilidad y stock de un producto.
 *
 * @remarks
 * Renderiza una etiqueta "Disponibilidad" seguida del estado descriptivo:
 * - "Agotado" si status es 'out'
 * - "Solo quedan X unidades" si status es 'low'
 * - "X unidades disponibles" si status es 'ok'
 * Aplica estilos condicionales accesibles según el estado.
 *
 * @component
 * @param {ProductStockInfoProps} props - Propiedades del componente.
 * @returns {JSX.Element} Elemento JSX con la información de disponibilidad.
 * @see StockStatus - Tipo que define los estados posibles.
 */
const ProductStockInfo = ({ stock, status }: ProductStockInfoProps) => {
  const isOutOfStock = status === "out";

  return (
    <div className="flex flex-col">
      <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold mb-1">
        Disponibilidad
      </span>
      <span
        className={cn(
          "text-sm font-semibold flex items-center gap-1.5",
          isOutOfStock
            ? "text-red-600 dark:text-red-400"
            : status === "low"
              ? "text-amber-600 dark:text-amber-400"
              : "text-emerald-600 dark:text-emerald-400"
        )}
        aria-live="polite"
      >
        <span
          className={cn(
            "w-2 h-2 rounded-full",
            isOutOfStock
              ? "bg-red-500"
              : status === "low"
                ? "bg-amber-500 animate-pulse"
                : "bg-emerald-500"
          )}
          aria-hidden="true"
        />
        {isOutOfStock
          ? "Agotado"
          : status === "low"
            ? `Solo quedan ${stock} unidades`
            : `${stock} unidades disponibles`}
      </span>
    </div>
  );
};

export default ProductStockInfo;


