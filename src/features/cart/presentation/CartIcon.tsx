// src/features/cart/presentation/CartIcon.tsx
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { useCart } from "@/features/cart/application/useCart"; // useCart is now typed
import { MouseEventHandler } from "react"; // Import MouseEventHandler type

interface CartIconProps {
  onClick?: MouseEventHandler<HTMLDivElement> | null;
}

const CartIcon = ({ onClick = null }: CartIconProps) => {
  // useCart hook is already typed, so these are correctly inferred
  const { cart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const content = (
    <div className="relative flex items-center justify-center">
      <HiOutlineShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-red-500 text-[9px] sm:text-[10px] font-bold text-white shadow-sm ring-1 sm:ring-2 ring-white dark:ring-gray-900">
          {totalItems}
        </span>
      )}
    </div>
  );

  if (onClick) {
    return (
      <div className="cursor-pointer" onClick={onClick}>
        {content}
      </div>
    );
  }

  return content;
};

export default CartIcon;