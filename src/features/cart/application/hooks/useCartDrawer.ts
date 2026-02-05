/**
 * Hook para gestionar el estado del drawer del carrito.
 */
import { useState, useCallback } from "react";

interface UseCartDrawerReturn {
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
}

/**
 * Hook para controlar la visibilidad del drawer del carrito.
 */
export const useCartDrawer = (): UseCartDrawerReturn => {
    const [isCartOpen, setIsCartOpen] = useState(false);

    const openCart = useCallback(() => setIsCartOpen(true), []);
    const closeCart = useCallback(() => setIsCartOpen(false), []);
    const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

    return { isCartOpen, openCart, closeCart, toggleCart };
};
