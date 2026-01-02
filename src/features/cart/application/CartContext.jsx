import { createContext, useState, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";

// 1. Create the Context
const CartContext = createContext();

// 2. Create the Provider Component
const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const openCart = useCallback(() => setIsCartOpen(true), []);
    const closeCart = useCallback(() => setIsCartOpen(false), []);
    const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

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

    const removeFromCart = useCallback((productId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
        toast.error("Product removed from cart.");
    }, []);

    const clearCart = useCallback(() => {
        setCart([]);
        toast.success("The cart has been emptied.");
    }, []);

    const totalPrice = useMemo(() => {
        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }, [cart]);

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
