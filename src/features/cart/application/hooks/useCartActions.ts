/**
 * Hook para gestionar las acciones del carrito.
 */
import { useCallback } from "react";
import toast from "react-hot-toast";
import { addItemToCart, removeItemFromCart } from "../../domain/cartUtils";
import type { CartItem, Product } from "../../domain/cartTypes";

interface UseCartActionsReturn {
    addToCart: (product: Product, quantity: number) => void;
    removeFromCart: (productId: number) => void;
    clearCart: () => void;
}

/**
 * Hook para las acciones del carrito (add, remove, clear).
 */
export const useCartActions = (
    setCart: React.Dispatch<React.SetStateAction<CartItem[]>>,
    openCart: () => void,
): UseCartActionsReturn => {
    const addToCart = useCallback(
        (product: Product, quantity: number) => {
            setCart((prev) => addItemToCart(prev, product, quantity));
            toast.success("Product added to cart!");
            openCart();
        },
        [setCart, openCart],
    );

    const removeFromCart = useCallback(
        (productId: number) => {
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
