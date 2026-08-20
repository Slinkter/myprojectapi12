/**
 * @file AppliedDiscountBadge.tsx
 * @description Distintivo que muestra el código de descuento aplicado con opción a eliminarlo.
 * @architecture Capa de Presentación - Componente de Checkout
 */

import { Tag, X, CheckCircle2 } from 'lucide-react';
import { useLogLifecycle } from "@/shared/hooks";
import { Button } from "@/shared/ui/Button";
import type { IDiscountCode } from "@/features/checkout/application/useDiscountValidation";

/**
 * @interface AppliedDiscountBadgeProps
 * @description Propiedades del componente AppliedDiscountBadge.
 */
export interface AppliedDiscountBadgeProps {
  /** Código de descuento aplicado */
  discount: IDiscountCode;
  /** Callback para eliminar el descuento */
  onRemove: () => void;
}

/**
 * Componente que muestra una insignia con el código de descuento aplicado,
 * el monto o porcentaje ahorrado y un botón para removerlo.
 *
 * @param {AppliedDiscountBadgeProps} props - Propiedades del componente.
 * @returns {JSX.Element} Distintivo de descuento aplicado.
 */
export function AppliedDiscountBadge({ discount, onRemove }: AppliedDiscountBadgeProps) {
  useLogLifecycle("AppliedDiscountBadge");

  return (
    <div
      className="rounded-xl border bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 mb-3 p-3 animate-in fade-in slide-in-from-top-1 duration-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 shrink-0">
            <Tag className="h-4 w-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300 truncate">
                {discount.code}
              </span>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              Descuento {discount.type === 'percentage' ? `${discount.discount}%` : `$${discount.discount}`} aplicado
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="iconSm"
          onClick={onRemove}
          aria-label={`Eliminar cupón ${discount.code}`}
          title="Eliminar cupón"
          className="text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}