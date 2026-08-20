/**
 * @file OrderItemRow.tsx
 * @description Fila individual de un producto en el resumen del pedido con números tabulares.
 * @architecture Capa de Presentación - Componente de Checkout
 */

import type { ICartItem } from '@/features/cart/domain/cartTypes';
import { Trash2 } from 'lucide-react';
import { useLogLifecycle } from "@/shared/hooks";

/**
 * @interface OrderItemRowProps
 * @description Propiedades del componente OrderItemRow.
 */
export interface OrderItemRowProps {
  /** Item del carrito a mostrar */
  item: ICartItem;
  /** Callback para eliminar el item del carrito */
  onRemove: (id: number) => void;
}

/**
 * Componente que renderiza una fila con la imagen, título, precio unitario, cantidad y total
 * para un producto en el resumen del pedido.
 *
 * @param {OrderItemRowProps} props - Propiedades del componente.
 * @returns {JSX.Element} Fila de producto.
 */
export function OrderItemRow({ item, onRemove }: OrderItemRowProps) {
  useLogLifecycle("OrderItemRow");

  return (
    <div
      className="flex items-center gap-3 p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-background/50 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors"
    >
      <div
        className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50"
      >
        <img
          src={item.thumbnail}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-grow min-w-0">
        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
          {item.title}
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
          ${item.price.toFixed(2)} × {item.quantity}
        </p>
      </div>
      <span className="text-xs font-bold text-slate-900 dark:text-slate-100 tabular-nums min-w-[55px] text-right">
        ${(item.price * item.quantity).toFixed(2)}
      </span>
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/25 h-8 w-8 hover:bg-red-50 dark:hover:bg-red-950/25 cursor-pointer border-none bg-transparent text-slate-400 hover:text-red-500"
        onClick={() => onRemove(item.id)}
        aria-label={`Eliminar ${item.title}`}
        title={`Eliminar ${item.title}`}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}