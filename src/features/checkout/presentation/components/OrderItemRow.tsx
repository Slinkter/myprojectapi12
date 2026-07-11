import type { ICartItem } from '@/features/cart/domain/cartTypes';
import { Trash2 } from 'lucide-react'
import { useLogLifecycle } from "@/shared/hooks";

interface OrderItemRowProps {
  item: ICartItem
  onRemove: (id: number) => void
}

export function OrderItemRow({ item, onRemove }: OrderItemRowProps) {
  useLogLifecycle("OrderItemRow");
  return (
    <div
      className="flex items-center gap-2 p-2 border border-slate-200 dark:border-slate-850 rounded-lg"
    >
      <div
        className="w-10 h-10 rounded overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800"
      >
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-grow min-w-0">
        <p className="text-xs font-medium truncate">
          {item.title}
        </p>
        <p className="text-xs text-muted-foreground">
          ${item.price.toFixed(2)} x {item.quantity}
        </p>
      </div>
      <span className="text-xs font-bold min-w-[50px] text-right">
        ${(item.price * item.quantity).toFixed(2)}
      </span>
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/25 disabled:pointer-events-none disabled:opacity-50 h-8 w-8 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer border-none bg-transparent text-red-500"
        onClick={() => onRemove(item.id)}
        aria-label={`Eliminar ${item.title}`}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}