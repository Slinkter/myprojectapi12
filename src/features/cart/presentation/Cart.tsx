/**
 * @file Cart.tsx
 * @description Componente principal del carrito de compras (Drawer).
 * Muestra la lista de productos agregados, total y opciones de checkout.
 * Implementa un diseño de "drawer" lateral con backdrop.
 * @architecture Presentation Layer - Cart Feature
 */
import { useNavigate } from "react-router-dom";
import { X, Trash2 } from "lucide-react";
import { useCart } from "@/features/cart/application/useCart";
import { ICartItem } from "@/features/cart/domain/cartTypes";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";

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
        <div className="h-full flex flex-col p-6 bg-card border-l border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-bold text-xl sm:text-2xl text-foreground">
              Mi Carrito
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeCart}
              className="rounded-full hover:rotate-90"
              aria-label="Cerrar carrito de compras"
            >
              <X size={20} className="text-slate-500" strokeWidth={2} />
            </Button>
          </div>

          <div className="flex-grow overflow-y-auto px-1 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <X className="text-slate-400" size={28} strokeWidth={2} />
                </div>
                <p className="text-slate-500 font-medium">
                  Tu carrito está vacío.
                </p>
                <Button
                  variant="secondary"
                  className="mt-4"
                  onClick={closeCart}
                >
                  Seguir comprando
                </Button>
              </div>
            ) : (
              cart.map((item: ICartItem) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 transition-all hover:border-amber-200 dark:hover:border-amber-900/40"
                >
                  <div className="flex-1 min-w-0">
                    <h6 className="font-bold text-sm sm:text-base text-foreground truncate">
                      {item.title}
                    </h6>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-slate-600 dark:text-slate-400 font-medium">
                        Cant: {item.quantity}
                      </span>
                      <span className="text-xs text-amber-600 font-bold">
                        ${item.price.toFixed(2)} c/u
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-bold text-sm sm:text-base text-foreground">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors text-red-500 cursor-pointer"
                      aria-label={`Eliminar ${item.title} del carrito`}
                    >
                      <Trash2 size={18} strokeWidth={2} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t border-slate-100 dark:border-slate-800 pt-6 mt-6 space-y-4">
              <div className="flex items-center justify-between px-2">
                <span className="font-medium text-slate-500">
                  Subtotal estimado
                </span>
                <span className="font-bold text-xl text-amber-600 dark:text-amber-500">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleCheckout}
                  variant="default"
                  size="lg"
                  className="w-full text-base font-bold shadow-amber-500/20"
                >
                  Proceder al pago
                </Button>
                <Button
                  onClick={clearCart}
                  variant="destructive"
                  className="w-full font-semibold"
                >
                  Vaciar Carrito
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
