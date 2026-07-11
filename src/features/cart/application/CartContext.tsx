/* eslint-disable react-refresh/only-export-components */
/**
 * @file CartContext.tsx
 * @description Gestión de estado global del carrito de compras usando Context API.
 * Implementa optimizaciones de performance con useMemo y useCallback para evitar re-renders innecesarios.
 * @architecture Application Layer - Context y Provider del carrito
 */

import { createContext, useState, useMemo, useContext, useEffect } from "react";
import { useCartActions } from "@/features/cart/application/hooks/useCartActions";
import { calculateTotal } from "@/features/cart/domain/cartUtils";
import { useCartDrawer } from "@/features/cart/application/hooks/useCartDrawer";
import type {
    ICartItem,
    ICartContextValue,
    ICartProviderProps,
} from "@/features/cart/domain/cartTypes";
import { useLogLifecycle } from "@/shared/hooks";

const CART_STORAGE_KEY = "api12-cart-storage";

export const CartContext = createContext<ICartContextValue | undefined>(
    undefined,
);

/**
 * @component CartProvider
 * @description Proveedor del contexto del carrito de compras.
 * Gestiona el estado del carrito con persistencia en localStorage,
 * las acciones (agregar/eliminar/limpiar) y el control del drawer.
 * Implementa optimizaciones de performance con useMemo para evitar re-renders innecesarios.
 * @architecture Application Layer - Provider
 *
 * @param {CartProviderProps} props - Props del componente
 * @param {ReactNode} props.children - Componentes hijos
 *
 * @returns {JSX.Element} Provider del contexto con los hijos
 *
 * @example
 * // Envolver la aplicación con el provider
 * function App() {
 *   return (
 *     <CartProvider>
 *       <YourApp />
 *     </CartProvider>
 *   );
 * }
 *
 * @example
 * // Usar en un componente hijo
 * function ProductCard({ product }) {
 *   const { addToCart } = useCart();
 *
 *   return (
 *     <button onClick={() => addToCart(product, 1)}>
 *       Add to Cart
 *     </button>
 *   );
 * }
 */
export const CartProvider = ({ children }: ICartProviderProps) => {
    useLogLifecycle("CartProvider");
    const [cart, setCart] = useState<ICartItem[]>(() => {
        try {
            const stored = localStorage.getItem(CART_STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error("Error loading cart from localStorage:", error);
            return [];
        }
    });

    // Persistir en localStorage cada vez que el carrito cambia
    useEffect(() => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }, [cart]);

    // Control del drawer del carrito
    const { isCartOpen, openCart, closeCart, toggleCart } = useCartDrawer();

    // Acciones del carrito (add, remove, clear)
    const { addToCart, removeFromCart, clearCart } = useCartActions(
        setCart,
        openCart,
    );

    /**
     * @constant totalPrice
     * @description Precio total del carrito calculado automáticamente.
     * Memoizado para evitar recálculos innecesarios.
     * @type {number}
     */
    const totalPrice = useMemo(() => calculateTotal(cart), [cart]);

    /**
     * @constant totalItems
     * @description Cantidad total de items en el carrito.
     * Memoizado para evitar recálculos innecesarios.
     * @type {number}
     */
    const totalItems = useMemo(
        () => cart.reduce((sum, item) => sum + item.quantity, 0),
        [cart],
    );

    /**
     * @constant value
     * @description Valor del contexto memoizado para optimización de performance.
     * Solo se recalcula cuando alguna de sus dependencias cambia.
     * @type {ICartContextValue}
     */
    const propValue = useMemo<ICartContextValue>(
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
            totalItems,
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
            totalItems,
        ],
    );

    return (
        <CartContext.Provider value={propValue}>
            {children}
        </CartContext.Provider>
    );
};

/**
 * Custom hook to access the cart context.
 * Provides access to cart state and all cart actions.
 * @returns CartContextValue - Object containing cart state (items, isCartOpen) and actions (addToCart, removeFromCart, clearCart, openCart, closeCart, toggleCart)
 * @throws {Error} If used outside of a CartProvider
 */
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart debe usarse dentro de un CartProvider");
    }
    return context;
};
