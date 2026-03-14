import { IoTrashOutline } from 'react-icons/io5'
import type { ICartItem } from '@/features/cart/domain/cartTypes'

interface CartItemCardProps {
  item: ICartItem
  onRemove: (id: number) => void
}

export function CartItemCard({ item, onRemove }: CartItemCardProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl border border-border bg-background/50 transition-all duration-300 hover:border-primary/30 hover:shadow-soft animate-in fade-in slide-in-from-right-2">
      <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0">
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h6 className="font-semibold text-sm text-foreground truncate">
          {item.title}
        </h6>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs bg-muted px-2 py-0.5 rounded-md text-muted-foreground font-medium">
            Cant: {item.quantity}
          </span>
          <span className="text-xs text-primary font-bold">
            ${item.price.toFixed(2)} c/u
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <p className="font-bold text-sm text-foreground">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
        <button
          onClick={() => onRemove(item.id)}
          className="p-2 flex items-center justify-center hover:bg-destructive/10 rounded-full transition-colors text-destructive cursor-pointer hover:scale-110 active:scale-95"
          aria-label={`Eliminar ${item.title} del carrito`}
        >
          <IoTrashOutline size={16} />
        </button>
      </div>
    </div>
  )
}
