import { PackageOpen, ArrowRight } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { useLogLifecycle } from "@/shared/hooks";

/**
 * @interface CartEmptyStateProps
 * @description Propiedades del componente CartEmptyState.
 */
export interface CartEmptyStateProps {
  /** Función para continuar comprando (cierra el drawer del carrito) */
  onContinue: () => void;
}

/**
 * @component CartEmptyState
 * @description Vista del estado vacío del carrito de compras.
 * Muestra una ilustración visual atractiva, un mensaje invitando al usuario
 * a explorar productos y un botón de acción rápida que cierra el drawer.
 *
 * @param {CartEmptyStateProps} props - Propiedades del componente
 * @returns {JSX.Element} Componente de estado vacío del carrito
 */
export const CartEmptyState = ({ onContinue }: CartEmptyStateProps) => {
  useLogLifecycle("CartEmptyState");

  return (
    <div className="flex flex-col items-center justify-center min-h-[360px] px-6 py-12 text-center">
      {/* Icono con contenedor decorativo */}
      <div className="relative mb-5">
        <div className="w-20 h-20 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100/80 dark:border-emerald-900/40 flex items-center justify-center shadow-xs">
          <PackageOpen size={36} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-950 flex items-center justify-center text-[11px]">
          ✨
        </div>
      </div>

      {/* Textos descriptivos */}
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1.5">
        Tu carrito está vacío
      </h3>
      <p className="text-xs text-slate-400 dark:text-slate-500 max-w-[220px] leading-relaxed mb-6">
        Agrega productos desde nuestro catálogo para comenzar tu experiencia de compra.
      </p>

      {/* Botón de acción */}
      <Button
        variant="outline"
        onClick={onContinue}
        className="rounded-xl px-5 h-10 text-xs font-semibold gap-2 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors shadow-xs"
      >
        <span>Explorar productos</span>
        <ArrowRight size={13} />
      </Button>
    </div>
  );
};
