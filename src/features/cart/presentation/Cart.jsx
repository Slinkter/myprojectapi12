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
      className={`fixed top-0 right-0 h-full transform transition-transform duration-300 ease-in-out ${
        isCartOpen ? "translate-x-0" : "translate-x-full"
      } w-full max-w-md z-50`}
    >
      <div className="neumo-card h-full flex flex-col p-4">
        <div className="cart-drawer__header">
          <h5 className="font-bold text-xl">Shopping Cart</h5>
          <button
            onClick={closeCart}
            className="neumo-button rounded-full p-2 w-8 h-8 flex items-center justify-center"
          >
            <IoMdClose className="cart-drawer__close-icon" />
          </button>
        </div>
        <div className="cart-drawer__item-list flex-grow overflow-y-auto px-2">
          {cart.map((item) => (
            <div key={item.id} className="cart-drawer__item">
              <div>
                <h6 className="font-semibold">{item.title}</h6>
                <p className="text-sm">Quantity: {item.quantity}</p>
              </div>
              <div className="cart-drawer__item-details">
                <p className="cart-drawer__item-price">
                  $ {(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="neumo-button rounded-full p-2 w-8 h-8 flex items-center justify-center text-red-500"
                >
                  <IoMdTrash className="cart-drawer__remove-icon" />
                </button>
              </div>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div className="cart-drawer__footer border-t border-[var(--neumo-shadow-dark)] dark:border-[var(--neumo-shadow-dark-mode-dark)] pt-4 mt-auto flex flex-col gap-4">
            <div className="cart-drawer__total-row">
              <h6 className="font-bold text-lg">Total:</h6>
              <h6 className="font-bold text-lg">$ {totalPrice.toFixed(2)}</h6>
            </div>
            <div className="flex w-full gap-3">
              <button
                onClick={clearCart}
                className="neumo-button w-1/2 py-3 bg-red-500 text-white"
              >
                Clear Cart
              </button>
              <button
                onClick={handleCheckout}
                className="neumo-button w-1/2 py-3 bg-green-500 text-white"
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
