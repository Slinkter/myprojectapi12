import type { CartItem } from '@/entities/cart/types/cart.types'

interface OrderItemRowProps {
  item: CartItem
}

export function OrderItemRow({ item }: OrderItemRowProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-background rounded-xl">
      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-foreground truncate">
          {item.title}
        </p>
        <p className="text-xs text-muted-foreground">
          Cant: {item.quantity} × ${item.price.toFixed(2)}
        </p>
      </div>
      <p className="font-bold text-sm text-foreground">
        ${(item.price * item.quantity).toFixed(2)}
      </p>
    </div>
  )
}


