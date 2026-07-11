/**
 * @module useCart
 * @description Re-exportación del hook useCart desde CartContext.
 * Proporciona un punto de entrada único para acceder al contexto del carrito.
 *
 * @returns {ICartContextValue} Estado y acciones del carrito
 * @throws {Error} Si se usa fuera de un CartProvider
 *
 * @example
 * const { cart, addToCart, totalPrice } = useCart();
 */
export { useCart } from "./CartContext";
