import { useContext, useState } from 'react';
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Typography,
} from "@material-tailwind/react";
import { CartContext } from "@/features/cart/context/CartContext";
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
                    className="product-modal__image"
                />
                <Typography className="product-modal__description">
                    {product?.description}
                </Typography>
                <Typography variant="h6" color="blue-gray" className="product-modal__price">
                    Price: $ {product?.price}
                </Typography>
                <Typography variant="h6" color="blue-gray" className="product-modal__stock">
                    Stock: {product?.stock}
                </Typography>
            </DialogBody>
            <DialogFooter className="product-modal__footer">
                <div className="product-modal__quantity-controls">
                    <Button onClick={decrement} disabled={quantity === 1}>-</Button>
                    <Typography className="product-modal__quantity-value">{quantity}</Typography>
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
