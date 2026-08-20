import { Trash2, Minus, Plus } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import type { ICartItem } from "@/features/cart/domain/cartTypes";
import { useLogLifecycle } from "@/shared/hooks";
import { useCart } from "@/features/cart/application/CartContext";

const priceFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const formatPrice = (price: number): string => priceFormatter.format(price);

/**
 * @interface CartItemRowProps
 * @description Propiedades del componente CartItemRow.
 */
export interface CartItemRowProps {
  /** Objeto del artículo en el carrito */
  item: ICartItem;
  /** Función callback para remover el artículo por su ID */
  onRemove: (id: number) => void;
}

/**
 * @component CartItemRow
 * @description Fila que representa un producto individual en el carrito de compras.
 * Permite ajustar la cantidad con retroalimentación táctil, deshabilitando el decremento
 * cuando la cantidad es 1, y eliminar el producto con confirmación visual sutil.
 *
 * @param {CartItemRowProps} props - Propiedades del componente
 * @returns {JSX.Element} Fila del artículo en el carrito
 */
export const CartItemRow = ({ item, onRemove }: CartItemRowProps) => {
  useLogLifecycle("CartItemRow");
  const { updateQuantity } = useCart();
  const isMinQuantity = item.quantity <= 1;

  return (
    <div className="group flex items-center gap-3 p-3 bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-xs">
      {/* Miniatura del producto */}
      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-800 shrink-0">
        <img
          src={item.thumbnail}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Información del producto */}
      <div className="grow min-w-0 flex flex-col justify-between self-stretch py-0.5">
        <div>
          <h3
            className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate leading-snug"
            title={item.title}
          >
            {item.title}
          </h3>
          <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-0.5 tabular-nums">
            {formatPrice(item.price)} c/u
          </p>
        </div>

        {/* Controles de cantidad */}
        <div className="flex items-center gap-1.5 mt-1.5">
          <button
            type="button"
            onClick={() => !isMinQuantity && updateQuantity(item.id, item.quantity - 1)}
            disabled={isMinQuantity}
            className={`inline-flex items-center justify-center w-6 h-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all ${
              isMinQuantity
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-90 cursor-pointer"
            }`}
            aria-label={`Reducir cantidad de ${item.title}`}
          >
            <Minus size={11} />
          </button>

          <span className="w-6 text-center text-xs font-bold text-slate-800 dark:text-slate-200 tabular-nums select-none">
            {item.quantity}
          </span>

          <button
            type="button"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="inline-flex items-center justify-center w-6 h-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 active:scale-90 transition-[transform,colors] cursor-pointer"
            aria-label={`Aumentar cantidad de ${item.title}`}
          >
            <Plus size={11} />
          </button>
        </div>
      </div>

      {/* Precio total y botón eliminar */}
      <div className="flex flex-col items-end justify-between self-stretch py-0.5 shrink-0">
        <span className="text-xs font-bold text-slate-900 dark:text-slate-100 tabular-nums">
          {formatPrice(item.price * item.quantity)}
        </span>

        <Button
          variant="ghost"
          size="iconSm"
          onClick={() => onRemove(item.id)}
          className="w-7 h-7 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 focus-visible:ring-red-500/25 transition-colors"
          aria-label={`Eliminar ${item.title} del carrito`}
        >
          <Trash2 size={13} />
        </Button>
      </div>
    </div>
  );
};
