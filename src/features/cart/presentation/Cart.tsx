import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { m, AnimatePresence } from "framer-motion";
import { useCart } from "@/features/cart/application/useCart";
import { useLogLifecycle } from "@/shared/hooks";
import { CartHeader } from "@features/cart/presentation/CartHeader";
import { CartItemRow } from "@features/cart/presentation/CartItemRow";
import { CartFooter } from "@features/cart/presentation/CartFooter";
import { CartEmptyState } from "@features/cart/presentation/CartEmptyState";

/**
 * @component Cart
 * @description Drawer del carrito de compras renderizado mediante createPortal.
 * Compone de manera modular y declarativa `CartHeader`, `CartItemRow`, `CartFooter`
 * y `CartEmptyState`. Incorpora animaciones fluidas con Framer Motion (slide-in con spring
 * y backdrop con desenfoque), soporte de tecla Escape y navegación al flujo de Checkout.
 *
 * @remarks
 * **Composición y Flujo de Interacción:**
 * 1. `useCart` provee el estado global del carrito (`cart`, `totalPrice`, `totalItems`, `isCartOpen`, etc.).
 * 2. `AnimatePresence` maneja el ciclo de vida de animación de entrada y salida.
 * 3. `m.div` (Backdrop) genera un fondo oscuro con `backdrop-blur-sm` que responde al clic de cierre.
 * 4. `m.div` (Panel) se desliza desde el borde derecho con física de resorte (spring).
 * 5. `CartHeader` muestra el título interactivo, badge y botón de cierre.
 * 6. El área con scroll renderiza `CartItemRow` para cada producto o `CartEmptyState` si está vacío.
 * 7. `CartFooter` desglosa subtotal, envío, total y dispara el checkout al hacer clic.
 *
 * @returns {JSX.Element | null} Portal del drawer si el carrito está montado, gestionado por AnimatePresence.
 */
const Cart = () => {
  useLogLifecycle("Cart");
  const { cart, removeFromCart, clearCart, isCartOpen, closeCart, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  const hasItems = cart.length > 0;

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  useEffect(() => {
    if (!isCartOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isCartOpen, closeCart]);

  return createPortal(
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Fondo desenfocado (Backdrop) */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-40 bg-slate-950/40 dark:bg-black/60 backdrop-blur-xs"
            onClick={closeCart}
            aria-hidden="true"
          />

          {/* Panel Lateral Deslizante (Drawer) */}
          <m.div
            role="dialog"
            aria-modal="true"
            aria-label="Carrito de compras"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 280 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-[400px] flex flex-col shadow-2xl border-l border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden rounded-l-3xl"
            style={{ height: "calc(100dvh - env(safe-area-inset-bottom))" }}
          >
            {/* Línea de acento visual superior */}
            <div className="h-[3px] w-full shrink-0 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />

            {/* Encabezado del Carrito */}
            <CartHeader onClose={closeCart} totalItems={totalItems} />

            {/* Contenido con scroll */}
            <div className="grow overflow-y-auto px-4 py-4 scrollbar-thin">
              {!hasItems ? (
                <CartEmptyState onContinue={closeCart} />
              ) : (
                <div className="flex flex-col gap-2.5">
                  {cart.map((item) => (
                    <CartItemRow
                      key={item.id}
                      item={item}
                      onRemove={removeFromCart}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Pie con resumen de precios y checkout */}
            {hasItems && (
              <CartFooter
                totalPrice={totalPrice}
                onCheckout={handleCheckout}
                onClearCart={clearCart}
              />
            )}
          </m.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Cart;

