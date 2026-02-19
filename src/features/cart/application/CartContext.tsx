/* eslint-disable react-refresh/only-export-components */
/**
 * @file CartContext.tsx
 * @description Gestión de estado global del carrito de compras usando Context API.
 * Implementa optimizaciones de performance con useMemo y useCallback para evitar re-renders innecesarios.
 * @architecture Application Layer - Context y Provider del carrito
 */

import { createContext, useState, useMemo, useContext } from "react";
import { useCartActions } from "@/features/cart/application/hooks/useCartActions";
import { calculateTotal } from "@/features/cart/domain/cartUtils";
import { useCartDrawer } from "@/features/cart/application/hooks/useCartDrawer";
import type {
  ICartItem,
  ICartContextValue,
  ICartProviderProps,
} from "@/features/cart/domain/cartTypes";

export const CartContext = createContext<ICartContextValue | undefined>(
  undefined,
);

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
export const CartProvider = ({ children }: ICartProviderProps) => {
  /*  */
  const [cart, setCart] = useState<ICartItem[]>([]);

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
   * @type {ICartContextValue}
   */
  const value = useMemo<ICartContextValue>(
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

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

/**
 * @function useCart
 * @description Hook personalizado para consumir el contexto del carrito.
 * Proporciona acceso al estado del carrito y todas sus acciones.
 * @architecture Capa de Aplicación - Hook Personalizado
 *
 * @returns {CartContextValue} Valor del contexto con estado y acciones del carrito
 *
 * @throws {Error} Si se usa fuera de un CartProvider
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
};
