import { HiOutlineTrash } from "react-icons/hi2";
import type { ICartItem } from "@/features/cart/domain/cartTypes";

interface CartItemRowProps {
  item: ICartItem;
  onRemove: (id: number) => void;
}

export const CartItemRow = ({ item, onRemove }: CartItemRowProps) => {
  return (
    <div
      className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-background/50 transition-all hover:border-primary/50"
    >
      <div className="flex-1 min-w-0">
        <h6 className="font-bold text-sm sm:text-base text-foreground truncate">
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
      <div className="flex items-center gap-4">
        <p className="font-bold text-sm sm:text-base text-foreground">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
        <button
          onClick={() => onRemove(item.id)}
          className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-destructive/10 rounded-full transition-colors text-destructive cursor-pointer"
          aria-label={`Eliminar ${item.title} del carrito`}
        >
          <HiOutlineTrash size={20} />
        </button>
      </div>
    </div>
  );
};