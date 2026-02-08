/**
 * @file useCartDrawer.ts
 * @description Hook personalizado para gestionar el estado de visibilidad del drawer del carrito.
 * Proporciona funciones memoizadas para abrir, cerrar y alternar el drawer.
 * @architecture Application Layer - Custom Hook
 */

import { useState, useCallback } from "react";

/**
 * @interface UseCartDrawerReturn
 * @description Valor de retorno del hook useCartDrawer.
 * Contiene el estado de visibilidad y funciones para controlarlo.
 * 
 * @property {boolean} isCartOpen - Estado actual de visibilidad del drawer
 * @property {Function} openCart - Función para abrir el drawer
 * @property {Function} closeCart - Función para cerrar el drawer
 * @property {Function} toggleCart - Función para alternar el estado del drawer
 */
interface UseCartDrawerReturn {
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
}

/**
 * @function useCartDrawer
 * @description Hook personalizado para controlar la visibilidad del drawer del carrito.
 * Gestiona el estado booleano y proporciona funciones memoizadas para manipularlo.
 * Las funciones están optimizadas con useCallback para evitar recreaciones innecesarias.
 * @architecture Application Layer - Custom Hook
 * 
 * @returns {UseCartDrawerReturn} Objeto con estado y funciones de control del drawer
 * 
 * @example
 * // Uso en ----> CartProvider
 * function CartProvider({ children }) {
 *   const { isCartOpen, openCart, closeCart, toggleCart } = useCartDrawer();
 *   
 *   return (
 *     <CartContext.Provider value={{ isCartOpen, openCart, closeCart, toggleCart }}>
 *       {children}
 *       {isCartOpen && <CartDrawer onClose={closeCart} />}
 *     </CartContext.Provider>
 *   );
 * }
 * 
 * @example
 * // Uso en ---->  componente
 * function CartIcon() {
 *   const { toggleCart } = useCart();
 *   
 *   return (
 *     <button onClick={toggleCart}>
 *       🛒 Cart
 *     </button>
 *   );
 * }
 * 
 * @example
 * // Abrir drawer después de agregar producto
 * function ProductCard({ product }) {
 *   const { addToCart, openCart } = useCart();
 *   
 *   const handleAddToCart = () => {
 *     addToCart(product, 1);
 *     openCart(); // Abre automáticamente el drawer
 *   };
 *   
 *   return <button onClick={handleAddToCart}>Add to Cart</button>;
 * }
 */
export const useCartDrawer = (): UseCartDrawerReturn => {
    const [isCartOpen, setIsCartOpen] = useState(false);

    /**
     * @function openCart
     * @description Abre el drawer del carrito estableciendo isCartOpen en true.
     * @memoized useCallback - Función estable que nunca se recrea
     * 
     * @returns {void}
     */
    const openCart = useCallback(() => setIsCartOpen(true), []);

    /**
     * @function closeCart
     * @description Cierra el drawer del carrito estableciendo isCartOpen en false.
     * @memoized useCallback - Función estable que nunca se recrea
     * 
     * @returns {void}
     */
    const closeCart = useCallback(() => setIsCartOpen(false), []);

    /**
     * @function toggleCart
     * @description Alterna el estado del drawer (abierto ↔ cerrado).
     * Usa functional setState para garantizar la actualización correcta.
     * @memoized useCallback - Función estable que nunca se recrea
     * 
     * @returns {void}
     * 
     * @example
     * // Estado actual: cerrado (false)
     * toggleCart(); // Ahora: abierto (true)
     * toggleCart(); // Ahora: cerrado (false)
     */
    const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

    return { isCartOpen, openCart, closeCart, toggleCart };
};
