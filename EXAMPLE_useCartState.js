// ============================================
// EJEMPLO: useCartState Hook
// ============================================
// Archivo: src/features/cart/application/hooks/useCartState.js
// Responsabilidad: Gestionar el estado del carrito
// ============================================

import { useState, useMemo } from "react";
import { calculateTotal } from "../../domain/cartUtils";

/**
 * Hook para gestionar el estado del carrito.
 *
 * @returns {Object} Estado del carrito
 * @returns {Array} cart - Items en el carrito
 * @returns {number} totalPrice - Precio total calculado
 */
export const useCartState = () => {
    const [cart, setCart] = useState([]);

    // Calcular total usando función pura del dominio
    const totalPrice = useMemo(() => calculateTotal(cart), [cart]);

    return { cart, setCart, totalPrice };
};
