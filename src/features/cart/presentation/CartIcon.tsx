/**
 * @file CartIcon.tsx
 * @description Icono del carrito con badge de cantidad de items.
 * @architecture Presentation Layer - Cart Feature
 */
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/features/cart/application/useCart";
import { MouseEventHandler } from "react";
import clsx from 'clsx';

/**
 * @interface CartIconProps
 * @property {MouseEventHandler<HTMLDivElement>} [onClick] - Handler opcional para el evento click
 */
interface CartIconProps {
  onClick?: MouseEventHandler<HTMLDivElement> | null;
}

/**
 * Componente visual del icono del carrito.
 * Muestra el número total de items mediante un badge notificación si hay productos.
 *
 * @component
 * @param {CartIconProps} props
 */
const CartIcon = ({ onClick = null }: CartIconProps) => {
  const { cart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const content = (
    <div className={clsx("relative flex items-center justify-center")}>
      <ShoppingCart className={clsx("h-4 w-4 sm:h-5 sm:w-5")} />
      {totalItems > 0 && (
        <span className={clsx("absolute -top-1 -right-1 flex h-3.5 w-3.5 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-red-500 text-[9px] sm:text-[10px] font-bold text-white shadow-sm ring-1 sm:ring-2 ring-white dark:ring-gray-900")}>
          {totalItems}
        </span>
      )}
    </div>
  );

  if (onClick) {
    return (
      <div className={clsx("cursor-pointer")} onClick={onClick}>
        {content}
      </div>
    );
  }

  return content;
};

export default CartIcon;
