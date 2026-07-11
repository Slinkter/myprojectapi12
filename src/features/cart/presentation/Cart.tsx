import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/features/cart/application/useCart";
import { ICartItem } from "@/features/cart/domain/cartTypes";
import { X, ShoppingBag, Trash2 } from "lucide-react";
import { useLogLifecycle } from "@/shared/hooks";
import { CartItemRow } from "./CartItemRow";
import { Button } from "@/shared/ui/Button";

/** Formatea precio con Intl.NumberFormat */
const formatPrice = (price: number): string =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);

const Cart = () => {
  useLogLifecycle("Cart");
  const { cart, removeFromCart, clearCart, isCartOpen, closeCart, totalPrice } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (!isCartOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={closeCart} />
      <div
        aria-label="Carrito de compras"
        className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-[360px] h-screen rounded-l-2xl flex flex-col shadow-2xl glass-panel border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden"
      >
        <div className="flex flex-col h-full">

          {/* MD3 Drawer Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200/50 dark:border-slate-800/50 shrink-0">
            <div className="flex items-center gap-2.5">
              {/* MD3 Leading Icon */}
              <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                <ShoppingBag className="text-primary" size={16} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 leading-snug">
                  Mi Carrito
                </h2>
                {totalItems > 0 && (
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {totalItems} {totalItems === 1 ? "artículo" : "artículos"}
                  </span>
                )}
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={closeCart}
              aria-label="Cerrar carrito"
              className="p-2 rounded-full cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors border-none bg-transparent flex items-center justify-center focus-visible:outline-2 focus-visible:outline-primary"
            >
              <X size={18} />
            </button>
          </div>

          {/* MD3 Drawer Content — Scrollable */}
          <div className="grow overflow-y-auto p-4">
            {cart.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center min-h-[320px] gap-4 text-center">
                <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center">
                  <ShoppingBag size={36} className="text-slate-400 dark:text-slate-500" />
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    Tu carrito está vacío
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-normal">
                    Agrega productos para comenzar tu compra
                  </p>
                </div>
                {/* MD3 Outlined Button */}
                <Button
                  onClick={closeCart}
                  variant="outline"
                  className="rounded-full px-6 py-2.5"
                >
                  Continuar Comprando
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

          {/* MD3 Drawer Footer — Summary & Actions */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 shrink-0 bg-slate-50/50 dark:bg-slate-900/30">
              {/* Price Summary */}
              <div className="flex flex-col gap-1 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Subtotal ({totalItems} items)
                  </span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <div className="border-t border-slate-200/50 dark:border-slate-800/50 my-2" />
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-800 dark:text-slate-200">
                    Total
                  </span>
                  <span className="text-xl font-extrabold text-primary">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>

              {/* MD3 Filled Button — Primary CTA */}
              <Button
                onClick={handleCheckout}
                className="w-full h-11 rounded-full text-sm font-bold shadow-[0_4px_12px_rgba(5,150,105,0.15)] mb-2"
              >
                Proceder al Pago
              </Button>

              {/* MD3 Text Button — Secondary action */}
              <Button
                onClick={clearCart}
                variant="ghost"
                className="w-full h-10 rounded-full hover:bg-red-500/10 hover:text-red-600 text-red-600 dark:text-red-400 text-sm font-semibold flex items-center justify-center gap-1.5"
              >
                <Trash2 size={14} />
                Vaciar Carrito
              </Button>
            </div>
          )}
        </div>
      </div>
    </>,
    document.body
  );
};

export default Cart;
