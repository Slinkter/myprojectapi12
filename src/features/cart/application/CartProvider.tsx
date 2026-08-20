/**
 * @file CartProvider.tsx
 * @description Proveedor del contexto del carrito de compras.
 * Gestiona el estado del carrito con persistencia en localStorage,
 * las acciones (agregar/eliminar/limpiar) y el control del drawer.
 * @architecture Application Layer - Provider Component
 */

import { useMemo } from "react";
import { useCartActions } from "@/features/cart/application/hooks/useCartActions";
import { calculateCartSummary } from "@/features/cart/domain/cartUtils";
import { useCartDrawer } from "@/features/cart/application/hooks/useCartDrawer";
import type {
    ICartItem,
    ICartContextValue,
    ICartProviderProps,
} from "@/features/cart/domain/cartTypes";
import { useLogLifecycle, useLocalStorage } from "@/shared/hooks";
import { CartContext } from "@features/cart/application/CartContext";

const CART_STORAGE_KEY = "api12-cart-storage";

/**
 * Proveedor del contexto del carrito de compras.
 *
 * @component
 * @param props - Props del componente
 * @param props.children - Componentes hijos
 * @returns Elemento JSX con el Provider del contexto
 */
export const CartProvider = ({ children }: ICartProviderProps) => {
    useLogLifecycle("CartProvider");
    const [cart, setCart] = useLocalStorage<ICartItem[]>(CART_STORAGE_KEY, []);

    // Control del drawer del carrito
    const { isCartOpen, openCart, closeCart, toggleCart } = useCartDrawer();

    // Acciones del carrito (add, remove, clear)
    const { addToCart, removeFromCart, updateQuantity, clearCart } =
        useCartActions(setCart, openCart);

    // Cálculo combinado en una sola pasada O(n) para precio y cantidad
    const { totalPrice, totalItems } = useMemo(
        () => calculateCartSummary(cart),
        [cart],
    );

    const propValue = useMemo<ICartContextValue>(
        () => ({
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
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
            updateQuantity,
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
