import { useContext } from "react";
import { IconButton, Badge } from "@material-tailwind/react";
import { CartContext } from "@/features/cart/application/CartContext";
import PropTypes from "prop-types";
import { HiOutlineShoppingCart } from "react-icons/hi2";

const CartIcon = ({ onClick }) => {
  const { cart } = useContext(CartContext);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Badge content={totalItems > 0 ? totalItems : null} withBorder>
      <IconButton onClick={onClick}>
        <HiOutlineShoppingCart className="cart-icon__svg h-5 w-5" />
      </IconButton>
    </Badge>
  );
};

CartIcon.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default CartIcon;
