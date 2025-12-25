import { useContext } from "react";
import { CartContext } from "@/features/cart/application/CartContext";
import PropTypes from "prop-types";
import { HiOutlineShoppingCart } from "react-icons/hi2";

const CartIcon = ({ onClick }) => {
  const { cart } = useContext(CartContext);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <button onClick={onClick} className="neumo-button p-3 relative">
      <HiOutlineShoppingCart className="cart-icon__svg" />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--neumo-accent)] text-xs font-bold text-white">
          {totalItems}
        </span>
      )}
    </button>
  );
};

CartIcon.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default CartIcon;
