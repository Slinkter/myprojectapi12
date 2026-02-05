/**
 * Hook para gestionar el estado del drawer del carrito.
 */
import { useState, useCallback } from "react";

/**
 * Hook para controlar la visibilidad del drawer del carrito.
 *
 * @returns {Object} Estado y funciones del drawer
 */
export const useCartDrawer = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);

    const openCart = useCallback(() => setIsCartOpen(true), []);
    const closeCart = useCallback(() => setIsCartOpen(false), []);
    const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

    return { isCartOpen, openCart, closeCart, toggleCart };
};
