import { createContext, useState } from "react";
import PropTypes from "prop-types";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    /*  */
    const [cart, setCart] = useState([]);
    /*  */
    const addToCart = (product, quantity) => {
        setCart((prevCart) => {
            /* buscar el producto en el [] , con find */
            const productInCart = prevCart.find(
                (item) => item.id === product.id
            );
            /* si hay , usar map y modificar   */
            if (productInCart) {
                return prevCart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            /*  */
            return [...prevCart, { ...product, quantity }];
        });
    };

    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };

    const clearCart = () => {
        setCart([]);
    };

    const propValues = {
        cart,
        addToCart,
        removeFromCart,
        clearCart,
    };

    return (
        <CartContext.Provider value={propValues}>
            {children}
        </CartContext.Provider>
    );
};

CartProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
