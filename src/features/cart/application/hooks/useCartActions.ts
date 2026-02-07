/**
 * @file useCartActions.ts
 * @description Hook personalizado para gestionar las acciones del carrito de compras.
 * Proporciona funciones memoizadas para agregar, eliminar y limpiar items del carrito.
 * @architecture Application Layer - Custom Hook
 */

import { useCallback } from "react";
import toast from "react-hot-toast";
import { addItemToCart, removeItemFromCart } from "../../domain/cartUtils";
import type { CartItem, Product } from "../../domain/cartTypes";

/**
 * @interface UseCartActionsReturn
 * @description Valor de retorno del hook useCartActions.
 * Contiene las funciones memoizadas para manipular el carrito.
 * 
 * @property {Function} addToCart - Función para agregar un producto al carrito
 * @property {Function} removeFromCart - Función para eliminar un producto del carrito
 * @property {Function} clearCart - Función para vaciar completamente el carrito
 */
interface UseCartActionsReturn {
    addToCart: (product: Product, quantity: number) => void;
    removeFromCart: (productId: number) => void;
    clearCart: () => void;
}

/**
 * @function useCartActions
 * @description Hook personalizado que proporciona acciones memoizadas para el carrito.
 * Utiliza useCallback para optimizar performance y evitar recreación de funciones.
 * Muestra notificaciones toast al usuario después de cada acción.
 * @architecture Application Layer - Custom Hook
 * 
 * @param {React.Dispatch<React.SetStateAction<CartItem[]>>} setCart - Función para actualizar el estado del carrito
 * @param {Function} openCart - Función para abrir el drawer del carrito
 * 
 * @returns {UseCartActionsReturn} Objeto con las acciones del carrito
 * 
 * @example
 * // Usar en CartProvider
 * function CartProvider({ children }) {
 *   const [cart, setCart] = useState([]);
 *   const { openCart } = useCartDrawer();
 *   
 *   const { addToCart, removeFromCart, clearCart } = useCartActions(
 *     setCart,
 *     openCart
 *   );
 *   
 *   return (
 *     <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
 *       {children}
 *     </CartContext.Provider>
 *   );
 * }
 * 
 * @example
 * // Las funciones están memoizadas y son estables
 * const { addToCart } = useCartActions(setCart, openCart);
 * // addToCart solo se recrea si setCart u openCart cambian
 */
export const useCartActions = (
    setCart: React.Dispatch<React.SetStateAction<CartItem[]>>,
    openCart: () => void,
): UseCartActionsReturn => {
    /**
     * @function addToCart
     * @description Agrega un producto al carrito con la cantidad especificada.
     * Si el producto ya existe, incrementa su cantidad.
     * Muestra notificación de éxito y abre el drawer del carrito.
     * @memoized useCallback - Solo se recrea si setCart u openCart cambian
     * 
     * @param {Product} product - Producto a agregar
     * @param {number} quantity - Cantidad a agregar (debe ser > 0)
     * 
     * @returns {void}
     * 
     * @example
     * addToCart(
     *   { id: 1, title: "Laptop", price: 899, thumbnail: "url", stock: 10 },
     *   2
     * );
     * // Resultado: Producto agregado, toast mostrado, drawer abierto
     */
    const addToCart = useCallback(
        (product: Product, quantity: number) => {
            setCart((prev) => addItemToCart(prev, product, quantity));
            toast.success("Product added to cart!");
            openCart();
        },
        [setCart, openCart],
    );

    /**
     * @function removeFromCart
     * @description Elimina un producto del carrito por su ID.
     * Muestra notificación de error (rojo) para indicar la eliminación.
     * @memoized useCallback - Solo se recrea si setCart cambia
     * 
     * @param {number} productId - ID del producto a eliminar
     * 
     * @returns {void}
     * 
     * @example
     * removeFromCart(1);
     * // Resultado: Producto con ID 1 eliminado, toast mostrado
     */
    const removeFromCart = useCallback(
        (productId: number) => {
            setCart((prev) => removeItemFromCart(prev, productId));
            toast.error("Product removed from cart.");
        },
        [setCart],
    );

    /**
     * @function clearCart
     * @description Vacía completamente el carrito eliminando todos los items.
     * Muestra notificación de éxito confirmando la acción.
     * @memoized useCallback - Solo se recrea si setCart cambia
     * 
     * @returns {void}
     * 
     * @example
     * clearCart();
     * // Resultado: Carrito vacío [], toast mostrado
     */
    const clearCart = useCallback(() => {
        setCart([]);
        toast.success("The cart has been emptied.");
    }, [setCart]);

    return { addToCart, removeFromCart, clearCart };
};
