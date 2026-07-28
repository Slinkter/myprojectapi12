import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { m, AnimatePresence } from "framer-motion";
import { useCart } from "@/features/cart/application/useCart";
import { ICartItem } from "@/features/cart/domain/cartTypes";
import { X, ShoppingCart, Trash2, ArrowRight, PackageOpen } from "lucide-react";
import { useLogLifecycle } from "@/shared/hooks";
import { CartItemRow } from "./CartItemRow";
import { Button } from "@/shared/ui/Button";

/**
 * @function formatPrice
 * @description Formatea un número como precio en USD usando Intl.NumberFormat.
 * @param {number} price - Valor numérico a formatear
 * @returns {string} Precio formateado como moneda USD (ej. "$1,234.56")
 */
const formatPrice = (price: number): string =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);

/**
 * @component Cart
 * @description Drawer del carrito de compras renderizado con createPortal.
 * Muestra la lista de artículos, resumen de precios, y acciones
 * (proceder al pago, vaciar carrito). Se cierra con clic en backdrop
 * o tecla Escape. Estado vacío muestra mensaje y botón para explorar.
 *
 * @remarks
 * **Secuencia de carga:**
 * 1. `CartContext` provee `isDrawerOpen` + `closeDrawer`.
 * 2. `AnimatePresence mode="wait"` controla entrada/salida del drawer.
 * 3. Backdrop con `motion.div` -> fade-in.
 * 4. Panel con `motion.div` -> slide-in desde la derecha (`x: "100%"` -> `x: 0`).
 * 5. `CartHeader` renderiza título + botón cerrar.
 * 6. `Cart` lista items vía `useCart().items`.
 * 7. `CartItemRow` por cada item (con botón eliminar).
 * 8. `CartFooter` muestra total + botón checkout.
 * 9. Click en checkout -> `navigate("/checkout")`.
 *
 * @returns {JSX.Element | null} Portal del drawer si isCartOpen es true, null en caso contrario
 */
const Cart = () => {
  useLogLifecycle("Cart");
  const { cart, removeFromCart, clearCart, isCartOpen, closeCart, totalPrice } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const hasItems = cart.length > 0;

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
          {/* Backdrop */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
            onClick={closeCart}
          />

          {/* Drawer Panel */}
          <m.div
            role="dialog"
            aria-modal="true"
            aria-label="Carrito de compras"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-[380px] flex flex-col shadow-2xl border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden rounded-l-2xl" style={{ height: 'calc(100dvh - env(safe-area-inset-bottom))' }}
      >
        {/* ── Accent line ── */}
        <div className="h-[3px] w-full shrink-0 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />

        {/* ── Navbar Header ── */}
        <div className="flex items-center justify-between px-5 py-4 shrink-0 border-b border-slate-100 dark:border-slate-800/80">
          {/* Left: Icon + Title + Badge */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 shrink-0">
              <ShoppingCart size={17} className="text-emerald-600 dark:text-emerald-400" />
              {hasItems && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-emerald-500 text-white text-[10px] font-bold leading-none shadow-sm">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </div>

            <div className="flex flex-col min-w-0">
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-none">
                Mi Carrito
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-medium">
                {hasItems
                  ? `${totalItems} ${totalItems === 1 ? "artículo" : "artículos"}`
                  : "Vacío"}
              </p>
            </div>
          </div>

          {/* Right: Close button */}
          <Button
            variant="ghost"
            size="iconSm"
            onClick={closeCart}
            aria-label="Cerrar carrito"
          >
            <X size={16} />
          </Button>
        </div>

        {/* ── Scrollable Content ── */}
        <div className="grow overflow-y-auto px-4 py-4">
          {!hasItems ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center min-h-[340px] gap-5 text-center">
              <div className="w-20 h-20 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-center">
                <PackageOpen size={34} className="text-slate-300 dark:text-slate-600" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-base font-semibold text-slate-700 dark:text-slate-200">
                  Tu carrito está vacío
                </p>
                <p className="text-sm text-slate-400 dark:text-slate-500 leading-normal">
                  Agrega productos para comenzar tu compra
                </p>
              </div>
              <Button
                onClick={closeCart}
                variant="outline"
                className="rounded-xl px-6"
              >
                Explorar productos
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {cart.map((item: ICartItem) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onRemove={removeFromCart}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Footer / Price Summary ── */}
        {hasItems && (
          <div className="shrink-0 border-t border-slate-200 dark:border-slate-800">
            {/* Price rows */}
            <div className="px-5 pt-4 pb-3 flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">
                  Subtotal
                </span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">
                  Envío
                </span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {totalPrice >= 50 ? "Gratis" : formatPrice(9.99)}
                </span>
              </div>
              <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-slate-800 dark:text-slate-100">
                  Total
                </span>
                <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {formatPrice(totalPrice >= 50 ? totalPrice : totalPrice + 9.99)}
                </span>
              </div>
              {totalPrice < 50 && (
                <p className="text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 rounded-lg px-2.5 py-1.5 text-center font-medium">
                  Agrega {formatPrice(50 - totalPrice)} más para envío gratis 🎁
                </p>
              )}
            </div>

            {/* CTA buttons */}
            <div className="px-4 pb-5 flex flex-col gap-2">
              <Button
                onClick={handleCheckout}
                className="w-full h-11 rounded-xl text-sm font-bold gap-2 shadow-[0_4px_14px_rgba(5,150,105,0.25)]"
              >
                Proceder al Pago
                <ArrowRight size={15} />
              </Button>

              <button
                type="button"
                onClick={clearCart}
                className="w-full h-9 flex items-center justify-center gap-1.5 rounded-xl text-xs font-semibold text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer border-none bg-transparent"
              >
                <Trash2 size={13} />
                Vaciar carrito
              </button>
            </div>
          </div>
        )}
      </m.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Cart;
