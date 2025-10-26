import { useContext, useState } from 'react';
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Typography,
} from "@material-tailwind/react";
import { CartContext } from "@/context/CartContext";
import PropTypes from "prop-types";

const ProductDetailModal = ({ product, open, onClose }) => {
    const { addToCart } = useContext(CartContext);
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        addToCart(product, quantity);
        onClose();
    };

    const increment = () => {
        if (quantity < product.stock) {
            setQuantity(quantity + 1);
        }
    };

    const decrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    return (
        <Dialog open={open} handler={onClose}>
            <DialogHeader>
                <Typography variant="h5" color="blue-gray">
                    {product?.title}
                </Typography>
            </DialogHeader>
            <DialogBody divider>
                <img
                    src={product?.thumbnail}
                    alt={product?.title}
                    className="h-96 w-full object-cover rounded-lg mb-4"
                />
                <Typography className="font-normal text-gray-600 dark:text-gray-400">
                    {product?.description}
                </Typography>
                <Typography variant="h6" color="blue-gray" className="mt-4">
                    Price: $ {product?.price}
                </Typography>
                <Typography variant="h6" color="blue-gray" className="mt-4">
                    Stock: {product?.stock}
                </Typography>
            </DialogBody>
            <DialogFooter className="justify-between">
                <div className="flex items-center">
                    <Button onClick={decrement} disabled={quantity === 1}>-</Button>
                    <Typography className="mx-4">{quantity}</Typography>
                    <Button onClick={increment} disabled={quantity >= product.stock}>+</Button>
                </div>
                <Button variant="gradient" color="green" onClick={handleAddToCart} disabled={product.stock === 0}>
                    <span>Add to Cart</span>
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

ProductDetailModal.propTypes = {
    product: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default ProductDetailModal;
