import React, { useState } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
} from "@material-tailwind/react";
import PropTypes from "prop-types";
import ProductDetailModal from "./ProductDetailModal";

/**
 * A component that displays a single product.
 * @param {object} props - The props for the component.
 * @param {object} props.product - The product to display.
 * @returns {JSX.Element}
 */
const Product = React.memo(({ product }) => {
    /*  */
    const [open, setOpen] = useState(false);

    /*  */
    const handleOpen = () => setOpen(!open);

    return (
        <>
            <Card className="product-card">
                <CardHeader
                    className="product-card__header"
                    shadow={false}
                    floated={false}
                >
                    <img
                        className="product-card__image"
                        src={product?.thumbnail}
                        alt={product?.title}
                    />
                </CardHeader>
                <CardBody className="product-card__body">
                    <Typography
                        variant="h5"
                        color="blue-gray"
                        className="product-card__title"
                    >
                        {product?.title}
                    </Typography>
                    <Typography
                        variant="small"
                        color="gray"
                        className="product-card__description"
                    >
                        {product?.description}
                    </Typography>
                </CardBody>
                <CardFooter className="product-card__footer">
                    <div className="product-card__footer-content">
                        <Typography
                            color="blue-gray"
                            className="product-card__price"
                        >
                            $ {product?.price}
                        </Typography>
                        {product.stock > 0 ? (
                            <button
                                onClick={handleOpen}
                                className="product-card__details-button"
                            >
                                Details
                            </button>
                        ) : (
                            <Typography
                                color="red"
                                className="product-card__out-of-stock"
                            >
                                Out of stock
                            </Typography>
                        )}
                    </div>
                </CardFooter>
            </Card>
            {/* MODAL DETALLES PRODUCTO */}
            {product.stock > 0 && (
                <ProductDetailModal
                    product={product}
                    open={open}
                    onClose={handleOpen}
                />
            )}
        </>
    );
});

Product.displayName = "Product";

Product.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.number.isRequired,
        thumbnail: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        description: PropTypes.string.isRequired,
        stock: PropTypes.number.isRequired,
    }).isRequired,
};

export default Product;
