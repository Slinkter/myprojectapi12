import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addToCart = (product, quantity) => {
        const stockData = JSON.parse(localStorage.getItem('stock')) || {};
        const newStock = stockData[product.id] - quantity;
        stockData[product.id] = newStock;
        localStorage.setItem('stock', JSON.stringify(stockData));

        setCart((prevCart) => {
            const productInCart = prevCart.find((item) => item.id === product.id);
            if (productInCart) {
                return prevCart.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
                );
            }
            return [...prevCart, { ...product, quantity }];
        });
    };

    const removeFromCart = (productId) => {
        const stockData = JSON.parse(localStorage.getItem('stock')) || {};
        const productInCart = cart.find((item) => item.id === productId);
        const newStock = stockData[productId] + productInCart.quantity;
        stockData[productId] = newStock;
        localStorage.setItem('stock', JSON.stringify(stockData));

        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };

    const clearCart = () => {
        const stockData = JSON.parse(localStorage.getItem('stock')) || {};
        cart.forEach(item => {
            stockData[item.id] += item.quantity;
        });
        localStorage.setItem('stock', JSON.stringify(stockData));

        setCart([]);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

CartProvider.propTypes = {
    children: PropTypes.node.isRequired,
};