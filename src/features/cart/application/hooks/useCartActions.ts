/**
 * @file useCartActions.ts
 * @description Hook para gestionar acciones del carrito.
 */

import { useCallback } from "react";
import toast from "react-hot-toast";
import {
  addItemToCart,
  removeItemFromCart,
  validateCartItem,
} from "@/features/cart/domain/cartUtils";
import type { ICartItem, IProduct } from "@/features/cart/domain/cartTypes";

/**
 * Acciones disponibles para el carrito.
 */
interface IUseCartActionsReturn {
  addToCart: (product: IProduct, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
}

/**
 * Proporciona acciones memoizadas para el carrito.
 * @param {React.Dispatch<React.SetStateAction<ICartItem[]>>} setCart - Actualizador del estado
 * @param {Function} openCart - Abre el drawer
 */
export const useCartActions = (
  setCart: React.Dispatch<React.SetStateAction<ICartItem[]>>,
  openCart: () => void,
): IUseCartActionsReturn => {
  /** Agrega producto y abre el carrito con validación previa */
  const addToCart = useCallback(
    (product: IProduct, quantity: number) => {
      const validation = validateCartItem(product, quantity);

      if (!validation.valid) {
        toast.error(validation.error || "Error al agregar el producto");
        return;
      }

      setCart((prev) => addItemToCart(prev, product, quantity));
      toast.success(`${product.title} agregado al carrito!`);
      openCart();
    },
    [setCart, openCart],
  );

  /** Elimina producto del carrito */
  const removeFromCart = useCallback(
    (productId: number) => {
      setCart((prev) => removeItemFromCart(prev, productId));
      toast.error("Product removed from cart.");
    },
    [setCart],
  );

  /** Vacía el carrito */
  const clearCart = useCallback(() => {
    setCart([]);
    toast.success("The cart has been emptied.");
  }, [setCart]);

  return { addToCart, removeFromCart, clearCart };
};
