import { useContext } from "react";
import { CartContext } from "@/features/cart/application/CartContext";
import PropTypes from "prop-types";
import { HiOutlineShoppingCart } from "react-icons/hi2";

const CartIcon = () => {
  const { cart } = useContext(CartContext);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="relative inline-flex items-center justify-center">
      <HiOutlineShoppingCart className="h-6 w-6" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-gray-900">
          {totalItems}
        </span>
      )}
    </div>
  );
};

CartIcon.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default CartIcon;
