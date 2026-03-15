import type { CartItem } from '@/entities/cart/types/cart.types'
import { HiOutlineTrash } from 'react-icons/hi2'
import { useLogLifecycle } from "@/shared/hooks";

interface OrderItemRowProps {
  item: CartItem
  onRemove: (id: number) => void
}

export function OrderItemRow({ item, onRemove }: OrderItemRowProps) {
  useLogLifecycle("OrderItemRow");
  return (
    <div className="flex items-center gap-2 p-2 border border-border rounded-lg">
      <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center overflow-hidden flex-shrink-0">
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-xs text-foreground truncate">
          {item.title}
        </p>
        <p className="text-xs text-muted-foreground">
          ${item.price.toFixed(2)} x {item.quantity}
        </p>
      </div>
      <p className="font-semibold text-xs text-foreground min-w-[50px] text-right">
        ${(item.price * item.quantity).toFixed(2)}
      </p>
      <button
        onClick={() => onRemove(item.id)}
        className="p-1.5 rounded hover:bg-destructive/10 text-destructive cursor-pointer"
        aria-label={`Eliminar ${item.title}`}
      >
        <HiOutlineTrash className="w-4 h-4" />
      </button>
    </div>
  )
}
