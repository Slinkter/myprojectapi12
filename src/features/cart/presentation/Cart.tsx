/**
 * @file Cart.tsx
 * @description Componente principal del carrito de compras (Drawer).
 * Muestra la lista de productos agregados, total y opciones de checkout.
 * Implementa un diseño de "drawer" lateral con backdrop.
 * @architecture Presentation Layer - Cart Feature
 */
import { useNavigate } from "react-router-dom";
import { useCart } from "@/features/cart/application/useCart";
import { ICartItem } from "@/features/cart/domain/cartTypes";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

import { CartHeader } from "./CartHeader";
import { CartItemRow } from "./CartItemRow";
import { CartFooter } from "./CartFooter";
import { CartEmptyState } from "./CartEmptyState";

/**
 * @component Cart
 * @description Componente de visualización del carrito de compras.
 *
 * @returns {JSX.Element} El drawer del carrito.
 */
const Cart = () => {
  const { cart, removeFromCart, clearCart, isCartOpen, closeCart, totalPrice } =
    useCart();
  const navigate = useNavigate();
  const cartRef = useRef<HTMLDivElement>(null);

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  useEffect(() => {
    if (!isCartOpen) return;

    cartRef.current?.focus();

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeCart();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isCartOpen, closeCart]);

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm transition-opacity duration-300"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      <div
        ref={cartRef}
        tabIndex={-1}
        className={cn(
          "fixed top-0 right-0 h-full transform transition-transform duration-300 ease-in-out",
          isCartOpen
            ? "translate-x-0 shadow-[-10px_0_30px_rgba(0,0,0,0.15)]"
            : "translate-x-full",
          "w-full sm:max-w-md z-50",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        aria-hidden={!isCartOpen}
      >
        <div className="h-full flex flex-col p-6 bg-card border-l border-border">
          <CartHeader onClose={closeCart} />

          <div className="flex-grow overflow-y-auto px-1 space-y-4">
            {cart.length === 0 ? (
              <CartEmptyState onContinue={closeCart} />
            ) : (
              cart.map((item: ICartItem) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onRemove={removeFromCart}
                />
              ))
            )}
          </div>

          {cart.length > 0 && (
            <CartFooter
              totalPrice={totalPrice}
              onCheckout={handleCheckout}
              onClearCart={clearCart}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;