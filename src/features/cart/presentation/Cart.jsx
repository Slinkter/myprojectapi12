import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdClose, IoMdTrash } from "react-icons/io";
import { CartContext } from "@/features/cart/application/CartContext";

/**
 * Cart component.
 * Displays the user's shopping cart in a drawer/sidebar.
 * Handles removing items, clearing the cart, and navigating to checkout.
 *
 * @returns {JSX.Element} The rendered Cart component.
 */
const Cart = () => {
  const { cart, removeFromCart, clearCart, isCartOpen, closeCart, totalPrice } =
    useContext(CartContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full transform transition-transform duration-300 ease-in-out ${isCartOpen ? "translate-x-0" : "translate-x-full"
        } w-full sm:max-w-md z-50`}
      role="dialog"
      aria-modal="true"
      aria-label="Shopping cart"
      aria-hidden={!isCartOpen}
    >
      <div className="cart-drawer h-full flex flex-col p-4 sm:p-6">
        <div className="cart-drawer__header">
          <h5 className="font-bold text-lg sm:text-xl">Shopping Cart</h5>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Close shopping cart"
          >
            <IoMdClose size={24} className="cart-drawer__close-icon" />
          </button>
        </div>
        <div className="cart-drawer__item-list flex-grow overflow-y-auto px-1 sm:px-2">
          {cart.map((item) => (
            <div key={item.id} className="cart-drawer__item">
              <div className="flex-1 min-w-0">
                <h6 className="font-semibold text-sm sm:text-base truncate">{item.title}</h6>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Quantity: {item.quantity}</p>
              </div>
              <div className="cart-drawer__item-details">
                <p className="cart-drawer__item-price text-sm sm:text-base">
                  $ {(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors text-red-500"
                  aria-label={`Remove ${item.title} from cart`}
                >
                  <IoMdTrash size={18} className="cart-drawer__remove-icon sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div className="cart-drawer__footer border-t border-gray-200 dark:border-gray-700 pt-4 mt-auto flex flex-col gap-3 sm:gap-4">
            <div className="cart-drawer__total-row">
              <h6 className="font-bold text-base sm:text-lg">Total:</h6>
              <h6 className="font-bold text-base sm:text-lg text-amber-600 dark:text-amber-500">$ {totalPrice.toFixed(2)}</h6>
            </div>
            <div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-3">
              <button
                onClick={clearCart}
                className="neumo-button w-full sm:w-1/2 py-2.5 sm:py-3 bg-red-500 hover:bg-red-600 text-white text-sm sm:text-base"
                aria-label="Clear all items from cart"
              >
                Clear Cart
              </button>
              <button
                onClick={handleCheckout}
                className="neumo-button-primary w-full sm:w-1/2 py-2.5 sm:py-3 text-sm sm:text-base"
                aria-label="Proceed to checkout"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
