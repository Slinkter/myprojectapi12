import { HiOutlineTrash } from "react-icons/hi2";
import type { ICartItem } from "@/features/cart/domain/cartTypes";

interface CartItemRowProps {
  item: ICartItem;
  onRemove: (id: number) => void;
}

export const CartItemRow = ({ item, onRemove }: CartItemRowProps) => {
  return (
    <div className="flex items-start gap-3 p-3 border border-border rounded-lg">
      <img
        src={item.thumbnail}
        alt={item.title}
        className="w-14 h-14 object-cover rounded-md bg-muted flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h6 className="font-medium text-sm text-foreground truncate">
          {item.title}
        </h6>
        <p className="text-xs text-muted-foreground mt-0.5">
          ${item.price.toFixed(2)} x {item.quantity}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="font-semibold text-sm">
          ${(item.price * item.quantity).toFixed(2)}
        </span>
        <button
          onClick={() => onRemove(item.id)}
          className="p-1.5 rounded-full hover:bg-destructive/10 text-destructive transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-destructive"
          aria-label={`Eliminar ${item.title}`}
        >
          <HiOutlineTrash className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
