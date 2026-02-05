/**
 * Hook para gestionar las acciones del carrito.
 */
import { useCallback } from "react";
import toast from "react-hot-toast";
import { addItemToCart, removeItemFromCart } from "../../domain/cartUtils";

/**
 * Hook para las acciones del carrito (add, remove, clear).
 *
 * @param {Function} setCart - Setter del estado del carrito
 * @param {Function} openCart - Función para abrir el drawer
 * @returns {Object} Acciones del carrito
 */
export const useCartActions = (setCart, openCart) => {
    const addToCart = useCallback(
        (product, quantity) => {
            setCart((prev) => addItemToCart(prev, product, quantity));
            toast.success("Product added to cart!");
            openCart();
        },
        [setCart, openCart],
    );

    const removeFromCart = useCallback(
        (productId) => {
            setCart((prev) => removeItemFromCart(prev, productId));
            toast.error("Product removed from cart.");
        },
        [setCart],
    );

    const clearCart = useCallback(() => {
        setCart([]);
        toast.success("The cart has been emptied.");
    }, [setCart]);

    return { addToCart, removeFromCart, clearCart };
};
