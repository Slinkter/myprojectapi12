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
  /**
   * Adds a product to the cart with validation.
   * Opens the cart drawer after successfully adding the product.
   * @param product - The product object to add to the cart
   * @param quantity - The quantity of the product to add
   * @returns void
   */
  const addToCart = useCallback(
    (product: IProduct, quantity: number) => {
      const validation = validateCartItem(product, quantity);

      if (!validation.isValid) {
        toast.error(validation.error || "Error al agregar el producto");
        return;
      }

      setCart((prev) => addItemToCart(prev, product, quantity));
      toast.success(`${product.title} agregado al carrito!`);
      openCart();
    },
    [setCart, openCart],
  );

  /**
   * Removes a product from the cart by its product ID.
   * @param productId - The unique identifier of the product to remove
   * @returns void
   */
  const removeFromCart = useCallback(
    (productId: number) => {
      setCart((prev) => removeItemFromCart(prev, productId));
      toast.error("Producto eliminado del carrito.");
    },
    [setCart],
  );

  /**
   * Clears all items from the cart, emptying it completely.
   * @returns void
   */
  const clearCart = useCallback(() => {
    setCart([]);
    toast.success("El carrito ha sido vaciado.");
  }, [setCart]);

  return { addToCart, removeFromCart, clearCart };
};
