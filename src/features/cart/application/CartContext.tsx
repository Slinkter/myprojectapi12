/**
 * Gestión de estado global del carrito de compras.
 * Usa Context API con optimizaciones de performance (useMemo, useCallback).
 */
import { createContext, useState, useMemo, type ReactNode } from "react";
import { calculateTotal } from "../domain/cartUtils";
import { useCartDrawer } from "./hooks/useCartDrawer";
import { useCartActions } from "./hooks/useCartActions";
import type { CartItem, Product } from "../domain/cartTypes";

interface CartContextValue {
    cart: CartItem[];
    addToCart: (product: Product, quantity: number) => void;
    removeFromCart: (productId: number) => void;
    clearCart: () => void;
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
    totalPrice: number;
}

/**
 * Contexto del carrito de compras.
 * Provee estado, acciones y control del drawer.
 */
export const CartContext = createContext<CartContextValue | undefined>(
    undefined,
);

interface CartProviderProps {
    children: ReactNode;
}

/**
 * Proveedor del contexto del carrito.
 * Gestiona estado, acciones (add/remove/clear) y drawer.
 */
export const CartProvider = ({ children }: CartProviderProps) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    // Control del drawer
    const { isCartOpen, openCart, closeCart, toggleCart } = useCartDrawer();

    // Acciones del carrito
    const { addToCart, removeFromCart, clearCart } = useCartActions(
        setCart,
        openCart,
    );

    /** Precio total calculado automáticamente. */
    const totalPrice = useMemo(() => calculateTotal(cart), [cart]);

    /** Valor del contexto memoizado. */
    const value = useMemo<CartContextValue>(
        () => ({
            cart,
            addToCart,
            removeFromCart,
            clearCart,
            isCartOpen,
            openCart,
            closeCart,
            toggleCart,
            totalPrice,
        }),
        [
            cart,
            addToCart,
            removeFromCart,
            clearCart,
            isCartOpen,
            openCart,
            closeCart,
            toggleCart,
            totalPrice,
        ],
    );

    return (
        <CartContext.Provider value={value}>{children}</CartContext.Provider>
    );
};
