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
 * Renderiza una etiqueta "Disponibilidad" seguida del estado:
 * - "Agotado" si status es 'out'
 * - "{stock} en stock" en caso contrario
 * Aplica estilos condicionales según el estado.
 *
 * @component
 * @param props.stock - Nivel de inventario actual.
 * @param props.status - Estado calculado del stock.
 * @returns Elemento JSX con la info de disponibilidad.
 * @see StockStatus - Tipo que define los estados posibles.
 */
const ProductStockInfo = ({ stock, status }: ProductStockInfoProps) => {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Disponibilidad</span>
      <span className={cn(
        "text-sm font-bold",
        status === "ok" ? "text-success" : "text-accent"
      )}>
        {status === "out" ? "Agotado" : `${stock} en stock`}
      </span>
    </div>
  );
};

export default ProductStockInfo;

