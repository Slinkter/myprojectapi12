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
 * @interface IUseCartActionsReturn
 * @description Acciones memoizadas disponibles para manipular el carrito.
 */
interface IUseCartActionsReturn {
  /** Agrega un producto al carrito con validación previa */
  addToCart: (product: IProduct, quantity: number) => void;
  /** Elimina un producto del carrito por su ID */
  removeFromCart: (productId: number) => void;
  /** Actualiza la cantidad de un producto en el carrito */
  updateQuantity: (productId: number, quantity: number) => void;
  /** Vacía el carrito por completo */
  clearCart: () => void;
}

/**
 * @function useCartActions
 * @description Hook que proporciona acciones memoizadas para el carrito.
 * Valida el producto antes de agregarlo, muestra notificaciones toast,
 * y abre automáticamente el drawer al agregar un artículo.
 *
 * @param {React.Dispatch<React.SetStateAction<ICartItem[]>>} setCart - Actualizador del estado del carrito
 * @param {() => void} openCart - Función para abrir el drawer del carrito
 *
 * @returns {IUseCartActionsReturn} Objeto con funciones addToCart, removeFromCart y clearCart
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
   * Updates the quantity of a product in the cart.
   * Removes the item if quantity is 0 or less.
   * @param productId - The unique identifier of the product
   * @param quantity - The new quantity to set
   * @returns void
   */
  const updateQuantity = useCallback(
    (productId: number, quantity: number) => {
      if (quantity <= 0) {
        setCart((prev) => removeItemFromCart(prev, productId));
        return;
      }
      setCart((prev) =>
        prev.map((item) =>
          item.id === productId ? { ...item, quantity } : item,
        ),
      );
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

  return { addToCart, removeFromCart, updateQuantity, clearCart };
};
