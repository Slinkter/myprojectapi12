import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
    Button,
    Drawer,
    Typography,
    IconButton,
} from "@material-tailwind/react";
import { CartContext } from "@/features/cart/context/CartContext";
import PropTypes from "prop-types";

const Cart = ({ open, onClose }) => {
    const { cart, removeFromCart, clearCart } = useContext(CartContext);
    const navigate = useNavigate();

    const totalPrice = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const handleCheckout = () => {
        onClose();
        navigate("/checkout");
    };

    return (
        <Drawer open={open} onClose={onClose} className="cart-drawer">
            <div className="cart-drawer__header">
                <Typography variant="h5" color="blue-gray">
                    Shopping Cart
                </Typography>
                <IconButton variant="text" color="blue-gray" onClick={onClose}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="cart-drawer__close-icon"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </IconButton>
            </div>
            <div className="cart-drawer__item-list">
                {cart.map((item) => (
                    <div key={item.id} className="cart-drawer__item">
                        <div>
                            <Typography variant="h6" color="blue-gray">
                                {item.title}
                            </Typography>
                            <Typography variant="small" color="gray">
                                Quantity: {item.quantity}
                            </Typography>
                        </div>
                        <div className="cart-drawer__item-details">
                            <Typography
                                color="blue-gray"
                                className="cart-drawer__item-price"
                            >
                                $ {(item.price * item.quantity).toFixed(2)}
                            </Typography>
                            <IconButton
                                variant="text"
                                color="red"
                                onClick={() => removeFromCart(item.id)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="cart-drawer__remove-icon"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                </svg>
                            </IconButton>
                        </div>
                    </div>
                ))}
            </div>
            <div className="cart-drawer__footer">
                <div className="cart-drawer__total-row">
                    <Typography variant="h6" color="blue-gray">
                        Total:
                    </Typography>
                    <Typography variant="h6" color="blue-gray">
                        $ {totalPrice.toFixed(2)}
                    </Typography>
                </div>
                <Button
                    onClick={clearCart}
                    variant="gradient"
                    color="red"
                    className="cart-drawer__button"
                >
                    Clear Cart
                </Button>
                <Button
                    onClick={handleCheckout}
                    variant="gradient"
                    color="green"
                    className="cart-drawer__button"
                >
                    Checkout
                </Button>
            </div>
        </Drawer>
    );
};

Cart.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default Cart;
