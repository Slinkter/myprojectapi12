import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Drawer,
    Typography,
    IconButton,
} from "@material-tailwind/react";
import { CartContext } from "@/context/CartContext";
import PropTypes from "prop-types";

const Cart = ({ open, onClose }) => {
    const { cart, removeFromCart, clearCart } = useContext(CartContext);
    const navigate = useNavigate();

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleCheckout = () => {
        onClose();
        navigate('/checkout');
    };

    return (
        <Drawer open={open} onClose={onClose} className="p-4">
            <div className="mb-6 flex items-center justify-between">
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
                        className="h-5 w-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </IconButton>
            </div>
            <div className="divide-y divide-gray-200">
                {cart.map((item) => (
                    <div key={item.id} className="py-4 flex items-center justify-between">
                        <div>
                            <Typography variant="h6" color="blue-gray">
                                {item.title}
                            </Typography>
                            <Typography variant="small" color="gray">
                                Quantity: {item.quantity}
                            </Typography>
                        </div>
                        <div className="flex items-center">
                            <Typography color="blue-gray" className="mr-4">
                                $ {(item.price * item.quantity).toFixed(2)}
                            </Typography>
                            <IconButton variant="text" color="red" onClick={() => removeFromCart(item.id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </IconButton>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6">
                <div className="flex justify-between items-center">
                    <Typography variant="h6" color="blue-gray">
                        Total:
                    </Typography>
                    <Typography variant="h6" color="blue-gray">
                        $ {totalPrice.toFixed(2)}
                    </Typography>
                </div>
                <Button onClick={clearCart} variant="gradient" color="red" className="mt-4 w-full">
                    Clear Cart
                </Button>
                <Button onClick={handleCheckout} variant="gradient" color="green" className="mt-4 w-full">
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
