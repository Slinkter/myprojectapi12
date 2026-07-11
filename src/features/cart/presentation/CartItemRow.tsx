import { Trash2 } from "lucide-react";
import type { ICartItem } from "@/features/cart/domain/cartTypes";
import { useLogLifecycle } from "@/shared/hooks";

interface CartItemRowProps {
  item: ICartItem;
  onRemove: (id: number) => void;
}

export const CartItemRow = ({ item, onRemove }: CartItemRowProps) => {
  useLogLifecycle("CartItemRow");
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
          ${item.price.toFixed(2)} x {item.quantity}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium h-8 w-8 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500 cursor-pointer border-none bg-transparent"
          aria-label={`Eliminar ${item.title}`}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};
