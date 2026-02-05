/**
 * Hook para acceder al contexto del carrito.
 */
import { useContext } from "react";
import { CartContext } from "./CartContext";

/**
 * Hook para consumir el contexto del carrito.
 *
 * @throws {Error} Si se usa fuera de CartProvider
 */
export const useCart = () => {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error("useCart must be used within CartProvider");
    }

    return context;
};
