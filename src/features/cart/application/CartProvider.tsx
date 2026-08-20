/**
 * @file CartProvider.tsx
 * @description Proveedor del contexto del carrito de compras con segregación de Estado y Acciones.
 * Implementa State/Actions Context Segregation para eliminar tormentas de re-render en el catálogo.
 * @architecture Application Layer - Provider Component (Context Segregation Pattern)
 */

import { useMemo } from "react";
import { useCartActions as useCartActionsHook } from "@/features/cart/application/hooks/useCartActions";
import { calculateCartSummary } from "@/features/cart/domain/cartUtils";
import { useCartDrawer } from "@/features/cart/application/hooks/useCartDrawer";
import type {
    ICartItem,
    ICartContextValue,
    ICartStateContextValue,
    ICartActionsContextValue,
    ICartProviderProps,
} from "@/features/cart/domain/cartTypes";
import { useLogLifecycle, useLocalStorage } from "@/shared/hooks";
import { CartContext } from "@/features/cart/application/CartContext";
import { CartStateContext } from "@/features/cart/application/CartStateContext";
import { CartActionsContext } from "@/features/cart/application/CartActionsContext";

const CART_STORAGE_KEY = "api12-cart-storage";

/**
 * Proveedor del contexto del carrito de compras con segregación de Estado y Acciones.
 *
 * @component
 * @param props - Props del componente
 * @param props.children - Componentes hijos con acceso a los contextos segregados
 * @returns Elemento JSX con la jerarquía de Providers
 */
export const CartProvider = ({ children }: ICartProviderProps) => {
    useLogLifecycle("CartProvider");
    const [cart, setCart] = useLocalStorage<ICartItem[]>(CART_STORAGE_KEY, []);

    // Control del drawer del carrito
    const { isCartOpen, openCart, closeCart, toggleCart } = useCartDrawer();

    // Acciones del carrito (add, remove, clear)
    const { addToCart, removeFromCart, updateQuantity, clearCart } =
        useCartActionsHook(setCart, openCart);

    // Cálculo combinado en una sola pasada O(n) para precio y cantidad
    const { totalPrice, totalItems } = useMemo(
        () => calculateCartSummary(cart),
        [cart],
    );

    // Contexto de acciones estables (no muta cuando cambian los items ni totales)
    const actionsValue = useMemo<ICartActionsContextValue>(
        () => ({
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            openCart,
            closeCart,
            toggleCart,
        }),
        [
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            openCart,
            closeCart,
            toggleCart,
        ],
    );

    // Contexto de estado reactivo (muta únicamente cuando cambian items o totales)
    const stateValue = useMemo<ICartStateContextValue>(
        () => ({
            cart,
            isCartOpen,
            totalPrice,
            totalItems,
        }),
        [cart, isCartOpen, totalPrice, totalItems],
    );

    // Contexto unificado para retrocompatibilidad total con useCart()
    const combinedValue = useMemo<ICartContextValue>(
        () => ({
            ...stateValue,
            ...actionsValue,
        }),
        [stateValue, actionsValue],
    );

    return (
        <CartActionsContext.Provider value={actionsValue}>
            <CartStateContext.Provider value={stateValue}>
                <CartContext.Provider value={combinedValue}>
                    {children}
                </CartContext.Provider>
            </CartStateContext.Provider>
        </CartActionsContext.Provider>
    );
};
