import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { m, AnimatePresence } from "framer-motion";
import { useCart } from "@/features/cart/application/useCart";
import { useLogLifecycle, useIsMobile } from "@/shared/hooks";
import { CartHeader } from "@features/cart/presentation/CartHeader";
import { CartItemRow } from "@features/cart/presentation/CartItemRow";
import { CartFooter } from "@features/cart/presentation/CartFooter";
import { CartEmptyState } from "@features/cart/presentation/CartEmptyState";

/**
 * @component Cart
 * @description Panel del carrito de compras renderizado mediante createPortal.
 * En móvil se comporta como un **Modal Bottom Sheet** de Material Design 3 (desliza
 * desde el borde inferior con handle de arrastre para cerrar); en escritorio conserva
 * el comportamiento de drawer lateral. Compone de manera modular y declarativa
 * `CartHeader`, `CartItemRow`, `CartFooter` y `CartEmptyState`. Incorpora animaciones
 * fluidas con Framer Motion, soporte de tecla Escape y navegación al flujo de Checkout.
 *
 * @remarks
 * **Composición y Flujo de Interacción:**
 * 1. `useCart` provee el estado global del carrito (`cart`, `totalPrice`, `totalItems`, `isCartOpen`, etc.).
 * 2. `useIsMobile` decide el patrón de presentación: bottom sheet (móvil) o drawer (escritorio).
 * 3. `AnimatePresence` maneja el ciclo de vida de animación de entrada y salida.
 * 4. `m.div` (Backdrop) genera un fondo oscuro con `backdrop-blur-sm` que responde al clic de cierre.
 * 5. En móvil, un handle superior es arrastrable hacia abajo para cerrar (drag-to-dismiss).
 * 6. `CartHeader` muestra el título interactivo, badge y botón de cierre.
 * 7. El área con scroll renderiza `CartItemRow` para cada producto o `CartEmptyState` si está vacío.
 * 8. `CartFooter` desglosa subtotal, envío, total y dispara el checkout al hacer clic.
 *
 * @returns {JSX.Element | null} Portal del panel si el carrito está montado, gestionado por AnimatePresence.
 */
const Cart = () => {
  useLogLifecycle("Cart");
  const isMobile = useIsMobile();
  const { cart, removeFromCart, clearCart, isCartOpen, closeCart, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  const hasItems = cart.length > 0;

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { y: number }; velocity: { y: number } }
  ) => {
    if (info.offset.y > 120 || info.velocity.y > 500) closeCart();
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

          {/* Panel: Bottom Sheet M3 en móvil / Drawer lateral en escritorio */}
          <m.div
            role="dialog"
            aria-modal="true"
            aria-label="Carrito de compras"
            initial={isMobile ? { y: "100%" } : { x: "100%" }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: "100%" } : { x: "100%" }}
            transition={
              isMobile
                ? { type: "spring", stiffness: 260, damping: 32, mass: 1 }
                : { type: "spring", damping: 26, stiffness: 280 }
            }
            className={
              isMobile
                ? "fixed inset-x-0 bottom-0 z-50 max-h-[92dvh] flex flex-col shadow-2xl border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden rounded-t-3xl"
                : "fixed top-0 right-0 bottom-0 z-50 w-full max-w-[400px] flex flex-col shadow-2xl border-l border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden rounded-l-3xl"
            }
            style={
              isMobile
                ? { maxHeight: "92dvh" }
                : { height: "calc(100dvh - env(safe-area-inset-bottom))" }
            }
          >
            {/* Handle de arrastre M3 (solo móvil) — drag-to-dismiss */}
            {isMobile && (
              <div
                className="flex justify-center pt-2.5 pb-1 shrink-0"
                style={{ paddingBottom: "0.25rem" }}
              >
                <m.div
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={{ top: 0, bottom: 0.35 }}
                  dragMomentum={false}
                  onDragEnd={handleDragEnd}
                  className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-700 cursor-grab active:cursor-grabbing touch-none"
                  aria-hidden="true"
                />
              </div>
            )}

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

            {/* Safe area inferior de iOS */}
            {isMobile && (
              <div
                className="shrink-0 bg-slate-50/50 dark:bg-slate-900/30"
                style={{ height: "env(safe-area-inset-bottom)" }}
                aria-hidden="true"
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

