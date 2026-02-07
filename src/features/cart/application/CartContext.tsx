/**
 * @file CartContext.tsx
 * @description Gestión de estado global del carrito de compras usando Context API.
 * Implementa optimizaciones de performance con useMemo y useCallback para evitar re-renders innecesarios.
 * @architecture Application Layer - Context y Provider del carrito
 */

import {
    createContext,
    useState,
    useMemo,
    useContext,
    type ReactNode,
} from "react";
import { calculateTotal } from "../domain/cartUtils";
import { useCartDrawer } from "./hooks/useCartDrawer";
import { useCartActions } from "./hooks/useCartActions";
import type { CartItem, Product } from "../domain/cartTypes";

/**
 * @interface CartContextValue
 * @description Valor del contexto del carrito. Define todas las propiedades y métodos
 * disponibles para los componentes que consumen el contexto.
 * 
 * @property {CartItem[]} cart - Array de items en el carrito
 * @property {Function} addToCart - Función para agregar productos al carrito
 * @property {Function} removeFromCart - Función para eliminar productos del carrito
 * @property {Function} clearCart - Función para vaciar el carrito completamente
 * @property {boolean} isCartOpen - Estado de visibilidad del drawer del carrito
 * @property {Function} openCart - Función para abrir el drawer del carrito
 * @property {Function} closeCart - Función para cerrar el drawer del carrito
 * @property {Function} toggleCart - Función para alternar visibilidad del drawer
 * @property {number} totalPrice - Precio total de todos los items en el carrito
 */
interface CartContextValue {
    cart: CartItem[];
    addToCart: (product: Product, quantity: number) => void;
    removeFromCart: (productId: number) => void;
    clearCart: () => void;
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
    totalPrice: number;
}

/**
 * @constant CartContext
 * @description Contexto de React para el carrito de compras.
 * Provee estado global del carrito, acciones y control del drawer.
 * @type {React.Context<CartContextValue | undefined>}
 * 
 * @example
 * // Consumir el contexto
 * const { cart, addToCart } = useCart();
 */
export const CartContext = createContext<CartContextValue | undefined>(
    undefined,
);

/**
 * @interface CartProviderProps
 * @description Props del CartProvider
 * @property {ReactNode} children - Componentes hijos que tendrán acceso al contexto
 */
interface CartProviderProps {
    children: ReactNode;
}

/**
 * @component CartProvider
 * @description Proveedor del contexto del carrito de compras.
 * Gestiona el estado del carrito, las acciones (agregar/eliminar/limpiar) y el control del drawer.
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
export const CartProvider = ({ children }: CartProviderProps) => {
    const [cart, setCart] = useState<CartItem[]>([]);

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
     * @constant value
     * @description Valor del contexto memoizado para optimización de performance.
     * Solo se recalcula cuando alguna de sus dependencias cambia.
     * @type {CartContextValue}
     */
    const value = useMemo<CartContextValue>(
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
        ],
    );

    return (
        <CartContext.Provider value={value}>{children}</CartContext.Provider>
    );
};

/**
 * @function useCart
 * @description Hook personalizado para consumir el contexto del carrito.
 * Proporciona acceso al estado del carrito y todas sus acciones.
 * @architecture Application Layer - Custom Hook
 * 
 * @returns {CartContextValue} Valor del contexto con estado y acciones del carrito
 * 
 * @throws {Error} Si se usa fuera de un CartProvider
 * 
 * @example
 * // Usar el hook en un componente
 * function ShoppingCart() {
 *   const { cart, totalPrice, removeFromCart } = useCart();
 *   
 *   return (
 *     <div>
 *       <h2>Total: ${totalPrice}</h2>
 *       {cart.map(item => (
 *         <div key={item.id}>
 *           {item.title} - ${item.price} x {item.quantity}
 *           <button onClick={() => removeFromCart(item.id)}>Remove</button>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * 
 * @example
 * // Error: usar fuera del provider
 * function BadComponent() {
 *   const { cart } = useCart(); // ❌ Error: must be used within CartProvider
 * }
 */
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within CartProvider");
    }
    return context;
};
