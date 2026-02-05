/**
 * Utilidades puras para lógica del carrito.
 */

import type { CartItem, Product, ValidationResult } from "./cartTypes";

/**
 * Calcula el precio total del carrito.
 */
export const calculateTotal = (cart: CartItem[]): number => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

/**
 * Agrega un item al carrito o incrementa su cantidad.
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
 * Elimina un item del carrito.
 */
export const removeItemFromCart = (
    cart: CartItem[],
    productId: number,
): CartItem[] => {
    return cart.filter((item) => item.id !== productId);
};

/**
 * Valida si un producto puede ser agregado al carrito.
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
