/**
 * @file cartUtils.ts
 * @description Utilidades puras para lógica del carrito de compras.
 * Contiene funciones puras sin efectos secundarios para manipular el estado del carrito
 * optimizadas con iteraciones de una sola pasada y búsquedas en Set O(1).
 * @architecture Domain Layer - Lógica pura de negocio
 */

import type {
  ICartItem,
  IProduct,
  IValidationResult,
} from "@/features/cart/domain/cartTypes";

/**
 * @function calculateTotal
 * @description Calcula el precio total del carrito sumando el precio de cada item
 * multiplicado por su cantidad en una sola pasada.
 * @architecture Domain Layer - Lógica pura de negocio
 *
 * @param {ICartItem[]} cart - Array de items en el carrito
 * @returns {number} Precio total del carrito en USD (suma de precio * cantidad de cada item)
 *
 * @example
 * const cart = [
 *   { id: 1, price: 10, quantity: 2, title: "Item 1", thumbnail: "", stock: 10 },
 *   { id: 2, price: 5, quantity: 3, title: "Item 2", thumbnail: "", stock: 5 }
 * ];
 * const total = calculateTotal(cart);
 * console.log(total); // 35
 */
export const calculateTotal = (cart: ICartItem[]): number => {
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    total += cart[i].price * cart[i].quantity;
  }
  return total;
};

/**
 * @function calculateCartSummary
 * @description Calcula el precio total y la cantidad total de artículos en una sola pasada.
 * @architecture Domain Layer - Lógica de carrito
 *
 * @param {ICartItem[]} cart - Array actual del carrito
 * @returns {{ totalPrice: number; totalItems: number }} Resumen de totales del carrito
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
 * @function addItemToCart
 * @description Agrega un producto al carrito o incrementa su cantidad si ya existe.
 * Realiza la búsqueda y actualización en un único pase sobre el array.
 * @architecture Domain Layer - Lógica de carrito
 *
 * @param {ICartItem[]} cart - Array actual del carrito
 * @param {IProduct} product - Producto a agregar
 * @param {number} quantity - Cantidad a agregar (debe ser mayor a 0)
 * @returns {ICartItem[]} Nuevo array del carrito con el item agregado o actualizado
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
 * @function removeItemFromCart
 * @description Elimina un item del carrito por su ID en una sola iteración.
 * @architecture Domain Layer - Lógica de carrito
 *
 * @param {ICartItem[]} cart - Array actual del carrito
 * @param {number} productId - ID del producto a eliminar
 * @returns {ICartItem[]} Nuevo array del carrito sin el item eliminado
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
 * @function removeMultipleItemsFromCart
 * @description Elimina múltiples items del carrito utilizando un Set para verificaciones O(1).
 * @architecture Domain Layer - Lógica de carrito
 *
 * @param {ICartItem[]} cart - Array actual del carrito
 * @param {number[]} productIds - Array de IDs de productos a eliminar
 * @returns {ICartItem[]} Nuevo array sin los items indicados
 */
export const removeMultipleItemsFromCart = (
  cart: ICartItem[],
  productIds: number[],
): ICartItem[] => {
  const idsToRemove = new Set(productIds);
  const result: ICartItem[] = [];
  for (let i = 0; i < cart.length; i++) {
    const item = cart[i];
    if (!idsToRemove.has(item.id)) {
      result.push(item);
    }
  }
  return result;
};

/**
 * @function isProductInCart
 * @description Verifica la presencia de un producto en el carrito con búsqueda O(N) sin alocación intermedia de memoria.
 * @architecture Domain Layer - Lógica de carrito
 *
 * @param {ICartItem[]} cart - Array actual del carrito
 * @param {number} productId - ID del producto a verificar
 * @returns {boolean} True si el producto está en el carrito
 */
export const isProductInCart = (
  cart: ICartItem[],
  productId: number,
): boolean => {
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === productId) return true;
  }
  return false;
};

/**
 * @function isProductInIdSet
 * @description Verifica la presencia de un producto en un Set de IDs previamente indexado con complejidad O(1).
 * @architecture Domain Layer - Lógica de carrito
 *
 * @param {Set<number>} idSet - Conjunto de IDs indexados
 * @param {number} productId - ID del producto a verificar
 * @returns {boolean} True si el ID está presente
 */
export const isProductInIdSet = (
  idSet: Set<number>,
  productId: number,
): boolean => {
  return idSet.has(productId);
};

/**
 * @function calculateDetailedCartSummary
 * @description Calcula subtotal, impuestos, descuento y total de artículos en una sola pasada O(N).
 * @architecture Domain Layer - Reducción de carrito de un solo paso
 *
 * @param {ICartItem[]} cart - Array del carrito
 * @param {number} [discountPercentage=0] - Porcentaje de descuento opcional
 * @param {number} [taxRate=0] - Tasa de impuesto opcional
 * @returns {{ subtotal: number; totalItems: number; discountAmount: number; taxAmount: number; finalTotal: number }} Resumen financiero consolidado
 */
export const calculateDetailedCartSummary = (
  cart: ICartItem[],
  discountPercentage: number = 0,
  taxRate: number = 0,
): {
  subtotal: number;
  totalItems: number;
  discountAmount: number;
  taxAmount: number;
  finalTotal: number;
} => {
  let subtotal = 0;
  let totalItems = 0;

  for (let i = 0; i < cart.length; i++) {
    const item = cart[i];
    subtotal += item.price * item.quantity;
    totalItems += item.quantity;
  }

  const discountAmount = discountPercentage > 0 ? (subtotal * discountPercentage) / 100 : 0;
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const taxAmount = taxRate > 0 ? (discountedSubtotal * taxRate) / 100 : 0;
  const finalTotal = Math.round((discountedSubtotal + taxAmount) * 100) / 100;

  return {
    subtotal,
    totalItems,
    discountAmount,
    taxAmount,
    finalTotal,
  };
};

/**
 * @function updateCartItemQuantity
 * @description Actualiza la cantidad de un item o lo elimina si la cantidad es <= 0 en un solo pase.
 * @architecture Domain Layer - Lógica de carrito
 *
 * @param {ICartItem[]} cart - Array actual del carrito
 * @param {number} productId - ID del producto
 * @param {number} quantity - Nueva cantidad
 * @returns {ICartItem[]} Nuevo array del carrito actualizado
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
 * @function validateCartItem
 * @description Valida si un producto puede ser agregado al carrito.
 * Verifica que el producto sea válido, la cantidad sea positiva y haya stock suficiente.
 * @architecture Capa de Dominio - Validación de negocio
 *
 * @param {IProduct | null | undefined} product - Producto a validar
 * @param {number} quantity - Cantidad deseada
 * @returns {IValidationResult} Objeto con resultado de validación:
 *   - valid: true si pasa todas las validaciones
 *   - error: mensaje descriptivo si falla, null si es válido
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
