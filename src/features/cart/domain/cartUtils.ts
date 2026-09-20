/**
 * @file cartUtils.ts
 * @description Utilidades puras para la lógica del carrito de compras.
 * Contiene funciones puras sin efectos secundarios para manipular el estado del carrito
 * optimizadas con iteraciones de una sola pasada.
 * @architecture Domain Layer - Lógica pura de negocio
 */

import type {
  ICartItem,
  IProduct,
  IValidationResult,
} from "@/features/cart/domain/cartTypes";

/**
 * Calcula el precio total y la cantidad total de artículos en una sola pasada O(N).
 *
 * @param {ICartItem[]} cart - Array actual del carrito.
 * @returns {{ totalPrice: number; totalItems: number }} Resumen de totales del carrito.
 */
export const calculateCartSummary = (
  cart: ICartItem[],
): { totalPrice: number; totalItems: number } => {
  let totalPrice = 0;
  let totalItems = 0;
  for (let i = 0; i < cart.length; i++) {
    const item = cart[i];
    totalPrice += item.price * item.quantity;
    totalItems += item.quantity;
  }
  return { totalPrice, totalItems };
};

/**
 * Agrega un producto al carrito o incrementa su cantidad si ya existe.
 * Realiza la búsqueda y actualización en un único pase sobre el array.
 *
 * @param {ICartItem[]} cart - Array actual del carrito.
 * @param {IProduct} product - Producto a agregar.
 * @param {number} quantity - Cantidad a agregar (debe ser mayor a 0).
 * @returns {ICartItem[]} Nuevo array del carrito con el item agregado o actualizado.
 */
export const addItemToCart = (
  cart: ICartItem[],
  product: IProduct,
  quantity: number,
): ICartItem[] => {
  let found = false;
  const nextCart: ICartItem[] = [];

  for (let i = 0; i < cart.length; i++) {
    const item = cart[i];
    if (item.id === product.id) {
      found = true;
      nextCart.push({ ...item, quantity: item.quantity + quantity });
    } else {
      nextCart.push(item);
    }
  }

  if (!found) {
    nextCart.push({ ...product, quantity });
  }

  return nextCart;
};

/**
 * Elimina un item del carrito por su ID en una sola iteración O(N).
 *
 * @param {ICartItem[]} cart - Array actual del carrito.
 * @param {number} productId - ID del producto a eliminar.
 * @returns {ICartItem[]} Nuevo array del carrito sin el item eliminado.
 */
export const removeItemFromCart = (
  cart: ICartItem[],
  productId: number,
): ICartItem[] => {
  const result: ICartItem[] = [];
  for (let i = 0; i < cart.length; i++) {
    const item = cart[i];
    if (item.id !== productId) {
      result.push(item);
    }
  }
  return result;
};

/**
 * Actualiza la cantidad de un item o lo elimina si la cantidad es <= 0 en un solo pase.
 *
 * @param {ICartItem[]} cart - Array actual del carrito.
 * @param {number} productId - ID del producto.
 * @param {number} quantity - Nueva cantidad.
 * @returns {ICartItem[]} Nuevo array del carrito actualizado.
 */
export const updateCartItemQuantity = (
  cart: ICartItem[],
  productId: number,
  quantity: number,
): ICartItem[] => {
  if (quantity <= 0) {
    return removeItemFromCart(cart, productId);
  }

  const result: ICartItem[] = [];
  for (let i = 0; i < cart.length; i++) {
    const item = cart[i];
    if (item.id === productId) {
      result.push({ ...item, quantity });
    } else {
      result.push(item);
    }
  }
  return result;
};

/**
 * Valida si un producto puede ser agregado al carrito.
 * Verifica que el producto sea válido, la cantidad sea positiva y haya stock suficiente.
 *
 * @param {IProduct | null | undefined} product - Producto a validar.
 * @param {number} quantity - Cantidad deseada.
 * @returns {IValidationResult} Objeto con resultado de validación.
 */
export const validateCartItem = (
  product: IProduct | null | undefined,
  quantity: number,
): IValidationResult => {
  if (!product || !product.id) {
    return { isValid: false, error: "Producto inválido" };
  }

  if (quantity <= 0) {
    return { isValid: false, error: "La cantidad debe ser mayor a 0" };
  }

  if (product.stock < quantity) {
    return { isValid: false, error: "Stock insuficiente" };
  }

  return { isValid: true, error: null };
};
