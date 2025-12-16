import { createContext, useState, useMemo, useCallback } from "react";
import PropTypes from "prop-types";

// 1. Crear el Contexto
// Este es el objeto que los componentes consumirán para acceder al estado y las funciones del carrito.
const CartContext = createContext();

// 2. Crear el Componente Proveedor (Provider)
// Este componente envolverá a las partes de la app que necesitan acceso al carrito.
const CartProvider = ({ children }) => {
    // Estado para almacenar los productos.
    const [cart, setCart] = useState([]);
    // Estado para controlar la visibilidad del carrito (Drawer)
    const [isCartOpen, setIsCartOpen] = useState(false);

    const openCart = useCallback(() => setIsCartOpen(true), []);
    const closeCart = useCallback(() => setIsCartOpen(false), []);
    const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

    /**
     * Añade un producto al carrito o actualiza su cantidad si ya existe.
     * @param {object} product - El producto a añadir.
     * @param {number} quantity - La cantidad del producto a añadir.
     */
    const addToCart = useCallback((product, quantity) => {
        setCart((prevCart) => {
            // Busca si el producto ya está en el carrito.
            const productInCart = prevCart.find(
                (item) => item.id === product.id
            );
            // Si el producto ya existe, actualiza su cantidad.
            if (productInCart) {
                return prevCart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            // Si el producto es nuevo, lo añade al carrito.
            return [...prevCart, { ...product, quantity }];
        });
        // Opcional: Abrir el carrito automáticamente al agregar producto (Experiencia Amazon)
        setIsCartOpen(true);
    }, []);

    /**
     * Elimina un producto del carrito por su ID.
     * @param {string|number} productId - El ID del producto a eliminar.
     */
    const removeFromCart = useCallback((productId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    }, []);

    /**
     * Vacía completamente el carrito de compras.
     */
    const clearCart = useCallback(() => {
        setCart([]);
    }, []);

    // Memoizamos el valor del contexto para evitar re-renderizados innecesarios
    // en los componentes consumidores. El objeto de valor solo se recalculará si 'cart' cambia.
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
        ]
    );

    return (
        <CartContext.Provider value={propsValues}>
            {children}
        </CartContext.Provider>
    );
};

export { CartContext, CartProvider };

// Validación de props para asegurar que el componente Provider siempre reciba sus hijos.
CartProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
