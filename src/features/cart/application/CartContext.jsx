import { createContext, useState, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";

/**
 * @typedef {Object} CartItem
 * @property {number} id - Product ID
 * @property {string} title - Product title
 * @property {number} price - Product price
 * @property {number} quantity - Quantity in cart
 * @property {string} thumbnail - Product image URL
 * @property {number} stock - Available stock
 */

/**
 * @typedef {Object} CartContextValue
 * @property {CartItem[]} cart - Array of items in the cart
 * @property {Function} addToCart - Adds a product to cart or increases quantity if already exists
 * @property {Function} removeFromCart - Removes a product from cart by ID
 * @property {Function} clearCart - Removes all items from cart
 * @property {boolean} isCartOpen - Whether the cart drawer is open
 * @property {Function} openCart - Opens the cart drawer
 * @property {Function} closeCart - Closes the cart drawer
 * @property {Function} toggleCart - Toggles cart drawer open/closed state
 * @property {number} totalPrice - Total price of all items in cart
 */

/**
 * Cart context for managing shopping cart state across the application.
 * Provides cart items, cart manipulation functions, and cart drawer state.
 * 
 * @type {React.Context<CartContextValue>}
 */
const CartContext = createContext();

/**
 * Cart provider component that manages shopping cart state and operations.
 * 
 * Features:
 * - Add products to cart (creates new entry or increases quantity)
 * - Remove products from cart
 * - Clear entire cart
 * - Calculate total price automatically
 * - Manage cart drawer visibility (open/close/toggle)
 * - Show toast notifications for cart actions
 * - Optimized with useMemo and useCallback to prevent unnecessary re-renders
 * 
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components that will have access to cart context
 * @returns {JSX.Element} Provider component wrapping children
 * 
 * @example
 * // Wrap your app with CartProvider
 * <CartProvider>
 *   <App />
 * </CartProvider>
 * 
 * @example
 * // Use cart context in a component
 * import { useContext } from 'react';
 * import { CartContext } from '@/features/cart/application/CartContext';
 * 
 * function MyComponent() {
 *   const { cart, addToCart, totalPrice } = useContext(CartContext);
 *   
 *   return (
 *     <div>
 *       <p>Items: {cart.length}</p>
 *       <p>Total: ${totalPrice.toFixed(2)}</p>
 *       <button onClick={() => addToCart(product, 1)}>Add to Cart</button>
 *     </div>
 *   );
 * }
 */
const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    /**
     * Opens the cart drawer.
     */
    const openCart = useCallback(() => setIsCartOpen(true), []);

    /**
     * Closes the cart drawer.
     */
    const closeCart = useCallback(() => setIsCartOpen(false), []);

    /**
     * Toggles the cart drawer between open and closed states.
     */
    const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

    /**
     * Adds a product to the cart or increases its quantity if already present.
     * Shows a success toast notification and opens the cart drawer.
     * 
     * @param {Object} product - Product object to add
     * @param {number} product.id - Product ID
     * @param {string} product.title - Product title
     * @param {number} product.price - Product price
     * @param {string} product.thumbnail - Product image URL
     * @param {number} product.stock - Available stock
     * @param {number} quantity - Quantity to add (default: 1)
     * 
     * @example
     * addToCart(product, 2); // Adds 2 units of the product
     */
    const addToCart = useCallback((product, quantity) => {
        setCart((prevCart) => {
            const productInCart = prevCart.find((item) => item.id === product.id);
            if (productInCart) {
                return prevCart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prevCart, { ...product, quantity }];
        });
        toast.success("Product added to cart!");
        setIsCartOpen(true);
    }, []);

    /**
     * Removes a product from the cart by its ID.
     * Shows an error toast notification.
     * 
     * @param {number} productId - ID of the product to remove
     * 
     * @example
     * removeFromCart(123); // Removes product with ID 123
     */
    const removeFromCart = useCallback((productId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
        toast.error("Product removed from cart.");
    }, []);

    /**
     * Removes all items from the cart.
     * Shows a success toast notification.
     * 
     * @example
     * clearCart(); // Empties the entire cart
     */
    const clearCart = useCallback(() => {
        setCart([]);
        toast.success("The cart has been emptied.");
    }, []);

    /**
     * Calculates the total price of all items in the cart.
     * Automatically recalculates when cart changes.
     * 
     * @type {number}
     */
    const totalPrice = useMemo(() => {
        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }, [cart]);

    /**
     * Memoized context value to prevent unnecessary re-renders.
     * Only recalculates when dependencies change.
     */
    const propsValues = useMemo(
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
            totalPrice,
            addToCart,
            removeFromCart,
            clearCart,
            isCartOpen,
            openCart,
            closeCart,
            toggleCart,
        ]
    );

    return (
        <CartContext.Provider value={propsValues}>
            {children}
        </CartContext.Provider>
    );
};

export { CartContext, CartProvider };

CartProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
