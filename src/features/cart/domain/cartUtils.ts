/**
 * @file cartUtils.ts
 * @description Utilidades puras para lógica del carrito de compras.
 * Contiene funciones puras sin efectos secundarios para manipular el estado del carrito.
 * @architecture Domain Layer - Lógica pura de negocio
 */

import type { CartItem, Product, ValidationResult } from "./cartTypes";

/**
 * @function calculateTotal
 * @description Calcula el precio total del carrito sumando el precio de cada item 
 * multiplicado por su cantidad. Función pura sin efectos secundarios.
 * @architecture Domain Layer - Lógica pura de negocio
 * 
 * @param {CartItem[]} cart - Array de items en el carrito
 * 
 * @returns {number} Precio total del carrito en USD (suma de precio * cantidad de cada item)
 * 
 * @example
 * const cart = [
 *   { id: 1, price: 10, quantity: 2, title: "Item 1", thumbnail: "", stock: 10 },
 *   { id: 2, price: 5, quantity: 3, title: "Item 2", thumbnail: "", stock: 5 }
 * ];
 * const total = calculateTotal(cart);
 * console.log(total); // 35 (10*2 + 5*3)
 * 
 * @example
 * // Carrito vacío
 * const total = calculateTotal([]);
 * console.log(total); // 0
 */
export const calculateTotal = (cart: CartItem[]): number => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

/**
 * @function addItemToCart
 * @description Agrega un producto al carrito o incrementa su cantidad si ya existe.
 * Función pura que no modifica el array original, retorna un nuevo array.
 * @architecture Domain Layer - Lógica de carrito
 * 
 * @param {CartItem[]} cart - Array actual del carrito
 * @param {Product} product - Producto a agregar
 * @param {number} quantity - Cantidad a agregar (debe ser mayor a 0)
 * 
 * @returns {CartItem[]} Nuevo array del carrito con el item agregado o actualizado
 * 
 * @example
 * // Agregar nuevo producto al carrito vacío
 * const cart = [];
 * const product = { id: 1, title: "Laptop", price: 899, thumbnail: "url", stock: 5 };
 * const newCart = addItemToCart(cart, product, 2);
 * // newCart = [{ id: 1, title: "Laptop", price: 899, quantity: 2, thumbnail: "url", stock: 5 }]
 * 
 * @example
 * // Incrementar cantidad de producto existente
 * const cart = [{ id: 1, quantity: 2, price: 899, title: "Laptop", thumbnail: "url", stock: 5 }];
 * const product = { id: 1, title: "Laptop", price: 899, thumbnail: "url", stock: 5 };
 * const newCart = addItemToCart(cart, product, 3);
 * // newCart = [{ id: 1, quantity: 5, ... }] (2 + 3)
 */
export const addItemToCart = (
    cart: CartItem[],
    product: Product,
    quantity: number,
): CartItem[] => {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
        return cart.map((item) =>
            item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item,
        );
    }

    return [...cart, { ...product, quantity }];
};

/**
 * @function removeItemFromCart
 * @description Elimina un item del carrito por su ID.
 * Función pura que retorna un nuevo array sin el item especificado.
 * @architecture Domain Layer - Lógica de carrito
 * 
 * @param {CartItem[]} cart - Array actual del carrito
 * @param {number} productId - ID del producto a eliminar
 * 
 * @returns {CartItem[]} Nuevo array del carrito sin el item eliminado
 * 
 * @example
 * const cart = [
 *   { id: 1, title: "Laptop", price: 899, quantity: 2, thumbnail: "url", stock: 5 },
 *   { id: 2, title: "Mouse", price: 29, quantity: 1, thumbnail: "url", stock: 10 }
 * ];
 * const newCart = removeItemFromCart(cart, 1);
 * // newCart = [{ id: 2, title: "Mouse", ... }]
 * 
 * @example
 * // Intentar eliminar item que no existe (no hace nada)
 * const cart = [{ id: 1, ... }];
 * const newCart = removeItemFromCart(cart, 999);
 * // newCart = [{ id: 1, ... }] (sin cambios)
 */
export const removeItemFromCart = (
    cart: CartItem[],
    productId: number,
): CartItem[] => {
    return cart.filter((item) => item.id !== productId);
};

/**
 * @function validateCartItem
 * @description Valida si un producto puede ser agregado al carrito.
 * Verifica que el producto sea válido, la cantidad sea positiva y haya stock suficiente.
 * @architecture Domain Layer - Validación de negocio
 * 
 * @param {Product | null | undefined} product - Producto a validar
 * @param {number} quantity - Cantidad deseada
 * 
 * @returns {ValidationResult} Objeto con resultado de validación:
 *   - valid: true si pasa todas las validaciones
 *   - error: mensaje descriptivo si falla, null si es válido
 * 
 * @example
 * // Producto válido con stock suficiente
 * const product = { id: 1, title: "Laptop", price: 899, thumbnail: "url", stock: 10 };
 * const result = validateCartItem(product, 5);
 * // { valid: true, error: null }
 * 
 * @example
 * // Stock insuficiente
 * const product = { id: 1, title: "Laptop", price: 899, thumbnail: "url", stock: 3 };
 * const result = validateCartItem(product, 5);
 * // { valid: false, error: "Insufficient stock" }
 * 
 * @example
 * // Producto inválido (null)
 * const result = validateCartItem(null, 1);
 * // { valid: false, error: "Invalid product" }
 * 
 * @example
 * // Cantidad inválida
 * const product = { id: 1, title: "Laptop", price: 899, thumbnail: "url", stock: 10 };
 * const result = validateCartItem(product, 0);
 * // { valid: false, error: "Quantity must be greater than 0" }
 */
export const validateCartItem = (
    product: Product | null | undefined,
    quantity: number,
): ValidationResult => {
    if (!product || !product.id) {
        return { valid: false, error: "Invalid product" };
    }

    if (quantity <= 0) {
        return { valid: false, error: "Quantity must be greater than 0" };
    }

    if (product.stock < quantity) {
        return { valid: false, error: "Insufficient stock" };
    }

    return { valid: true, error: null };
};
