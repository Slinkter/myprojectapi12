import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
    Button,
    Drawer,
    Typography,
    IconButton,
} from "@material-tailwind/react";
import { IoMdClose, IoMdTrash } from "react-icons/io";
import { CartContext } from "@/features/cart/application/CartContext";

const Cart = () => {
    /*  */
    const {
        cart,
        removeFromCart,
        clearCart,
        isCartOpen,
        closeCart,
        totalPrice,
    } = useContext(CartContext);
    const navigate = useNavigate();

    const handleCheckout = () => {
        closeCart();
        navigate("/checkout");
    };

    return (
        <Drawer open={isCartOpen} onClose={closeCart} className="cart-drawer">
            <div className="cart-drawer__header">
                <Typography variant="h5" color="blue-gray">
                    Shopping Cart
                </Typography>
                <IconButton
                    variant="text"
                    color="blue-gray"
                    onClick={closeCart}
                >
                    <IoMdClose className="cart-drawer__close-icon" />
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
                                <IoMdTrash className="cart-drawer__remove-icon" />
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

export default Cart;
