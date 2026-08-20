/**
 * @file useCartActions.ts
 * @description Hook para gestionar acciones del carrito de compras.
 * Proporciona métodos optimizados con functional setState y llamadas de una sola pasada.
 * @architecture Application Layer - Custom Hook
 */

import { useCallback } from "react";
import toast from "react-hot-toast";
import {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
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
 * @returns {IUseCartActionsReturn} Objeto con funciones addToCart, removeFromCart, updateQuantity y clearCart
 */
export const useCartActions = (
  setCart: React.Dispatch<React.SetStateAction<ICartItem[]>>,
  openCart: () => void,
): IUseCartActionsReturn => {
  /**
   * Agrega un producto al carrito con validación previa.
   * Abre el drawer del carrito tras agregarlo exitosamente.
   *
   * @param {IProduct} product - Producto a agregar
   * @param {number} quantity - Cantidad a agregar
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
   * Elimina un producto del carrito por su ID.
   *
   * @param {number} productId - ID único del producto a eliminar
   */
  const removeFromCart = useCallback(
    (productId: number) => {
      setCart((prev) => removeItemFromCart(prev, productId));
      toast.error("Producto eliminado del carrito.");
    },
    [setCart],
  );

  /**
   * Actualiza la cantidad de un producto en el carrito en una sola pasada.
   *
   * @param {number} productId - ID único del producto
   * @param {number} quantity - Nueva cantidad
   */
  const updateQuantity = useCallback(
    (productId: number, quantity: number) => {
      setCart((prev) => updateCartItemQuantity(prev, productId, quantity));
    },
    [setCart],
  );

  /**
   * Vacía todos los artículos del carrito.
   */
  const clearCart = useCallback(() => {
    setCart(() => []);
    toast.success("El carrito ha sido vaciado.");
  }, [setCart]);

  return { addToCart, removeFromCart, updateQuantity, clearCart };
};

