/**
 * @file Cart.tsx
 * @description Componente principal del carrito de compras (Drawer).
 * Diseño limpio y profesional.
 * @architecture Presentation Layer - Cart Feature
 */
import { useNavigate } from "react-router-dom";
import { useCart } from "@/features/cart/application/useCart";
import { ICartItem } from "@/features/cart/domain/cartTypes";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { HiOutlineXMark, HiOutlineShoppingBag, HiOutlineTrash } from "react-icons/hi2";
import { Button } from "@/components/ui/button";

const Cart = () => {
  const { cart, removeFromCart, clearCart, isCartOpen, closeCart, totalPrice } = useCart();
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

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      <div
        ref={cartRef}
        tabIndex={-1}
        className={cn(
          "fixed top-0 right-0 h-full w-full sm:w-[380px] bg-background shadow-xl z-50 transform transition-transform duration-300 ease-in-out",
          isCartOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-lg">Mi Carrito</h2>
              <span className="text-sm text-muted-foreground">({totalItems})</span>
            </div>
            <button
              onClick={closeCart}
              className="p-2 rounded-full hover:bg-muted transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Cerrar carrito"
            >
              <HiOutlineXMark className="w-5 h-5" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <HiOutlineShoppingBag className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground mb-4">Tu carrito está vacío</p>
                <Button variant="outline" onClick={closeCart}>
                  Continuar Comprando
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item: ICartItem) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 p-3 border border-border rounded-lg"
                  >
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-md bg-muted flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h6 className="font-medium text-sm text-foreground truncate">
                        {item.title}
                      </h6>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        ${item.price.toFixed(2)} x {item.quantity}
                      </p>
                      <p className="text-sm font-semibold mt-1">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 rounded-full hover:bg-destructive/10 text-destructive transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-destructive"
                      aria-label={`Eliminar ${item.title}`}
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="p-4 border-t space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${totalPrice.toFixed(2)}</span>
              </div>
              
              <div className="flex items-center justify-between font-bold text-lg">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full"
              >
                Proceder al Pago
              </Button>
              
              <Button
                variant="outline"
                onClick={clearCart}
                className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
              >
                Vaciar Carrito
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
