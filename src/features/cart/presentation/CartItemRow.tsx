import { Trash2, Minus, Plus } from "lucide-react";
import type { ICartItem } from "@/features/cart/domain/cartTypes";
import { useLogLifecycle } from "@/shared/hooks";
import { useCart } from "@/features/cart/application/CartContext";

interface CartItemRowProps {
  item: ICartItem;
  onRemove: (id: number) => void;
}

export const CartItemRow = ({ item, onRemove }: CartItemRowProps) => {
  useLogLifecycle("CartItemRow");
  const { updateQuantity } = useCart();

  return (
    <div className="flex items-start gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-xl">
      <img
        src={item.thumbnail}
        alt={item.title}
        className="w-14 h-14 object-cover rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0"
      />
      <div className="grow min-w-0">
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 overflow-hidden text-ellipsis whitespace-nowrap">
          {item.title}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          ${item.price.toFixed(2)} c/u
        </p>

        <div className="flex items-center gap-1 mt-2">
          <button
            type="button"
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-slate-300 dark:border-slate-600 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer transition-colors"
            aria-label={`Reducir cantidad de ${item.title}`}
          >
            <Minus size={12} />
          </button>
          <span className="w-8 text-center text-xs font-bold text-slate-800 dark:text-slate-200 tabular-nums">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-slate-300 dark:border-slate-600 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer transition-colors"
            aria-label={`Aumentar cantidad de ${item.title}`}
          >
            <Plus size={12} />
          </button>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="inline-flex items-center justify-center rounded-full text-sm font-medium h-8 w-8 hover:bg-red-50 dark:hover:bg-red-950/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/25 text-red-500 cursor-pointer border-none bg-transparent transition-all"
          aria-label={`Eliminar ${item.title}`}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};
