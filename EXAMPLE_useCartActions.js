// ============================================
// EJEMPLO: useCartActions Hook
// ============================================
// Archivo: src/features/cart/application/hooks/useCartActions.js
// Responsabilidad: Acciones del carrito (add, remove, clear)
// ============================================

import { useCallback } from "react";
import toast from "react-hot-toast";
import { addItemToCart, removeItemFromCart } from "../../domain/cartUtils";

/**
 * Hook para las acciones del carrito.
 *
 * @param {Function} setCart - Setter del estado del carrito
 * @param {Function} openCart - Función para abrir el drawer
 * @returns {Object} Acciones del carrito
 */
export const useCartActions = (setCart, openCart) => {
    /**
     * Agrega un producto al carrito.
     *
     * @param {Object} product - Producto a agregar
     * @param {number} quantity - Cantidad a agregar
     */
    const addToCart = useCallback(
        (product, quantity) => {
            setCart((prev) => addItemToCart(prev, product, quantity));
            toast.success("Product added to cart!");
            openCart();
        },
        [setCart, openCart],
    );

    /**
     * Elimina un producto del carrito.
     *
     * @param {number} productId - ID del producto
     */
    const removeFromCart = useCallback(
        (productId) => {
            setCart((prev) => removeItemFromCart(prev, productId));
            toast.error("Product removed from cart.");
        },
        [setCart],
    );

    /**
     * Vacía el carrito completamente.
     */
    const clearCart = useCallback(() => {
        setCart([]);
        toast.success("The cart has been emptied.");
    }, [setCart]);

    return { addToCart, removeFromCart, clearCart };
};
