// ============================================
// EJEMPLO: CartContext REFACTORIZADO
// ============================================
// Este archivo muestra cómo quedaría después de la Fase 2 y Fase 3
//
// ANTES: 203 líneas con JSDoc extenso
// DESPUÉS: ~80 líneas con JSDoc conciso
// ============================================

import { createContext, useMemo } from "react";
import PropTypes from "prop-types";
import { useCartState } from "./hooks/useCartState";
import { useCartActions } from "./hooks/useCartActions";
import { useCartDrawer } from "./hooks/useCartDrawer";

/**
 * Contexto global del carrito de compras.
 * Provee estado, acciones y control del drawer.
 */
const CartContext = createContext();

/**
 * Proveedor del contexto del carrito.
 * Combina hooks de estado, acciones y drawer.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes hijos
 */
const CartProvider = ({ children }) => {
    // Estado del carrito
    const { cart, totalPrice } = useCartState();

    // Acciones del carrito
    const { addToCart, removeFromCart, clearCart } = useCartActions();

    // Control del drawer
    const { isCartOpen, openCart, closeCart, toggleCart } = useCartDrawer();

    // Valor del contexto memoizado
    const value = useMemo(
        () => ({
            cart,
            totalPrice,
            addToCart,
            removeFromCart,
            clearCart,
            isCartOpen,
            openCart,
            closeCart,
            toggleCart,
        }),
        [
            cart,
            totalPrice,
            addToCart,
            removeFromCart,
            clearCart,
            isCartOpen,
            openCart,
            closeCart,
            toggleCart,
        ],
    );

    return (
        <CartContext.Provider value={value}>{children}</CartContext.Provider>
    );
};

CartProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { CartContext, CartProvider };
