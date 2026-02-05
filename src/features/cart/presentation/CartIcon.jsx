/**
 * Icono del carrito con badge de cantidad.
 */
import PropTypes from "prop-types";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { useCart } from "@/features/cart/application/useCart";

const CartIcon = ({ onClick }) => {
    const { cart } = useCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div
            className="relative flex items-center justify-center"
            onClick={onClick}
        >
            <HiOutlineShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
            {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-red-500 text-[9px] sm:text-[10px] font-bold text-white shadow-sm ring-1 sm:ring-2 ring-white dark:ring-gray-900">
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
