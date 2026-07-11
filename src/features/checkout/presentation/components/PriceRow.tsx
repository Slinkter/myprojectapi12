/**
 * @file PriceRow.tsx
 * @description Fila de precio reutilizable para el resumen del pedido.
 * @architecture Capa de Presentación - Componente de Checkout
 */

import React from "react";
import { useLogLifecycle } from "@/shared/hooks";
import { cn } from "@/shared/lib/cn";

/**
 * @interface PriceRowProps
 * @description Propiedades del componente PriceRow.
 */
interface PriceRowProps {
  /** Texto descriptivo de la fila (ej. "Subtotal", "Envío") */
  label: React.ReactNode;
  /** Valor del precio a mostrar */
  value: React.ReactNode;
  /** Variante visual de la fila */
  variant?: 'default' | 'success' | 'highlight';
}

/**
 * Componente que renderiza una fila de precio con estilos según la variante.
 * Útil para subtotales, descuentos, envío y total general.
 *
 * @param {PriceRowProps} props - Propiedades del componente.
 * @returns {JSX.Element} Fila de precio formateada.
 */
export function PriceRow({ label, value, variant = 'default' }: PriceRowProps) {
  useLogLifecycle("PriceRow");

  const isSuccess = variant === 'success';
  const isHighlight = variant === 'highlight';

  return (
    <div
      className={cn(
        "flex justify-between items-center text-sm transition-colors",
        isHighlight && "text-lg font-bold border-t border-slate-200 dark:border-slate-800 pt-3 mt-2 text-slate-900 dark:text-slate-100",
        isSuccess && "text-emerald-600 dark:text-emerald-400 font-semibold"
      )}
    >
      <span className={cn(
        isSuccess ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"
      )}>
        {label}
      </span>
      <span className={cn(
        "font-semibold",
        isHighlight ? "text-lg" : "text-sm",
        isSuccess ? "text-emerald-600 dark:text-emerald-400" : "text-slate-900 dark:text-slate-100"
      )}>
        {value}
      </span>
    </div>
  );
}