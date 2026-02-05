/**
 * Gestión de estado global del carrito de compras.
 * Usa Context API con optimizaciones de performance (useMemo, useCallback).
 * Force reload.
 */
import {
    createContext,
    useState,
    useMemo,
    useContext,
    type ReactNode,
} from "react";
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

/**
 * Hook para consumir el contexto del carrito.
 * @throws {Error} Si se usa fuera de CartProvider
 */
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within CartProvider");
    }
    return context;
};
