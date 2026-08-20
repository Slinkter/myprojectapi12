import { ShoppingCart, X } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { useLogLifecycle } from "@/shared/hooks";

/**
 * @interface CartHeaderProps
 * @description Props del componente CartHeader.
 */
export interface CartHeaderProps {
  /** Función para cerrar el drawer del carrito */
  onClose: () => void;
  /** Cantidad total de artículos en el carrito */
  totalItems?: number;
}

/**
 * @component CartHeader
 * @description Encabezado del drawer del carrito de compras.
 * Muestra el icono de la cesta con badge dinámico, título, subtítulo
 * con conteo de artículos y botón para cerrar el drawer.
 *
 * @param {CartHeaderProps} props - Propiedades del componente
 * @returns {JSX.Element} Encabezado del carrito
 */
export const CartHeader = ({ onClose, totalItems = 0 }: CartHeaderProps) => {
  useLogLifecycle("CartHeader");
  const hasItems = totalItems > 0;

  return (
    <div className="flex items-center justify-between px-5 py-4 shrink-0 border-b border-slate-100 dark:border-slate-800/80">
      {/* Icono + Título + Contador */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 shrink-0">
          <ShoppingCart size={17} className="text-emerald-600 dark:text-emerald-400" />
          {hasItems && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-emerald-500 text-white text-[10px] font-bold leading-none shadow-sm tabular-nums">
              {totalItems > 99 ? "99+" : totalItems}
            </span>
          )}
        </div>

        <div className="flex flex-col min-w-0">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-none">
            Mi Carrito
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">
            {hasItems
              ? `${totalItems} ${totalItems === 1 ? "artículo" : "artículos"}`
              : "Vacío"}
          </p>
        </div>
      </div>

      {/* Botón de cierre */}
      <Button
        variant="ghost"
        size="iconSm"
        onClick={onClose}
        className="rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-label="Cerrar carrito"
      >
        <X size={16} />
      </Button>
    </div>
  );
};
