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
import { CartItem } from "@/features/checkout/application/types";
import clsx from "clsx";
import { useEffect, useRef } from "react"; // Import useEffect and useRef

/**
 * Componente de visualización del carrito de compras.
 *
 * @component
 * @example
 * return (
 *   <Cart />
 * )
 */

const Cart = () => {
  // useCart hook is already typed, so these are correctly inferred
  const { cart, removeFromCart, clearCart, isCartOpen, closeCart, totalPrice } =
    useCart();
  const navigate = useNavigate();
  const cartRef = useRef<HTMLDivElement>(null); // Ref for the cart drawer

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  useEffect(() => {
    if (isCartOpen) {
      // Focus the cart drawer when it opens
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
    }
  }, [isCartOpen, closeCart]);

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div
          className={clsx(
            "fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity duration-300",
          )}
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      <div
        ref={cartRef} // Attach ref to the drawer
        tabIndex={-1} // Make it programmatically focusable
        className={clsx(
          "fixed top-0 right-0 h-full transform transition-transform duration-300 ease-in-out",
          isCartOpen
            ? "translate-x-0 shadow-[-10px_0_30px_rgba(0,0,0,0.15)]"
            : "translate-x-full",
          "w-full sm:max-w-md z-50",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        aria-hidden={!isCartOpen}
      >
        <div
          className={clsx(
            "cart-drawer h-full flex flex-col p-4 sm:p-6 bg-[var(--bg-card)]",
          )}
        >
          <div className={clsx("cart-drawer__header")}>
            <h5 className={clsx("font-bold text-lg sm:text-xl")}>
              Shopping Cart
            </h5>
            <button
              onClick={closeCart}
              className={clsx(
                "p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors",
              )}
              aria-label="Close shopping cart"
            >
              <X size={24} className={clsx("cart-drawer__close-icon")} />
            </button>
          </div>
          <div
            className={clsx(
              "cart-drawer__item-list flex-grow overflow-y-auto px-1 sm:px-2",
            )}
          >
            {cart.map(
              (
                item: CartItem, // Explicitly type item here
              ) => (
                <div key={item.id} className={clsx("cart-drawer__item")}>
                  <div className={clsx("flex-1 min-w-0")}>
                    <h6
                      className={clsx(
                        "font-semibold text-sm sm:text-base truncate",
                      )}
                    >
                      {item.title}
                    </h6>
                    <p
                      className={clsx(
                        "text-xs sm:text-sm text-gray-600 dark:text-gray-400",
                      )}
                    >
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className={clsx("cart-drawer__item-details")}>
                    <p
                      className={clsx(
                        "cart-drawer__item-price text-sm sm:text-base",
                      )}
                    >
                      $ {(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className={clsx(
                        "p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors text-red-500",
                      )}
                      aria-label={`Remove ${item.title} from cart`}
                    >
                      <Trash2
                        size={18}
                        className={clsx(
                          "cart-drawer__remove-icon sm:w-5 sm:h-5",
                        )}
                      />
                    </button>
                  </div>
                </div>
              ),
            )}
          </div>
          {cart.length > 0 && (
            <div
              className={clsx(
                "cart-drawer__footer border-t border-gray-200 dark:border-gray-700 pt-4 mt-auto flex flex-col gap-3 sm:gap-4",
              )}
            >
              <div className={clsx("cart-drawer__total-row")}>
                <h6 className={clsx("font-bold text-base sm:text-lg")}>
                  Total:
                </h6>
                <h6
                  className={clsx(
                    "font-bold text-base sm:text-lg text-amber-600 dark:text-amber-500",
                  )}
                >
                  $ {totalPrice.toFixed(2)}
                </h6>
              </div>
              <div
                className={clsx(
                  "flex flex-col sm:flex-row w-full gap-2 sm:gap-3",
                )}
              >
                <button
                  onClick={clearCart}
                  className={clsx(
                    "cart-clear-button w-full sm:w-1/2 py-2.5 sm:py-3 bg-red-500 hover:bg-red-600 text-white text-sm sm:text-base",
                  )}
                  aria-label="Clear all items from cart"
                >
                  Clear Cart
                </button>
                <button
                  onClick={handleCheckout}
                  className={clsx(
                    "cart-checkout-button w-full sm:w-1/2 py-2.5 sm:py-3 text-sm sm:text-base",
                  )}
                  aria-label="Proceed to checkout"
                >
                  Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
