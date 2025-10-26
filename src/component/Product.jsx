
import React, { useState } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
} from "@material-tailwind/react";
import PropTypes from "prop-types";
import ProductDetailModal from "@/component/ProductDetailModal";

/**
 * A component that displays a single product.
 * @param {object} props - The props for the component.
 * @param {object} props.product - The product to display.
 * @returns {JSX.Element}
 */
const Product = React.memo(({ product }) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(!open);

    return (
        <>
            <Card className="w-full max-w-sm mx-auto bg-white dark:bg-dark-card rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105">
                <CardHeader shadow={false} floated={false} className="h-56">
                    <img
                        src={product?.thumbnail}
                        alt={product?.title}
                        className="h-full w-full object-cover"
                    />
                </CardHeader>
                <CardBody className="p-4">
                    <Typography variant="h5" color="blue-gray" className="font-bold text-lg mb-2 truncate dark:text-dark-text">
                        {product?.title}
                    </Typography>
                    <Typography variant="small" color="gray" className="font-normal text-gray-600 dark:text-gray-400 truncate">
                        {product?.description}
                    </Typography>
                </CardBody>
                <CardFooter className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex justify-between items-center">
                        <Typography color="blue-gray" className="font-bold text-lg dark:text-dark-text">
                            $ {product?.price}
                        </Typography>
                        {product.stock > 0 ? (
                            <button onClick={handleOpen} className="text-custom-blue font-semibold">Details</button>
                        ) : (
                            <Typography color="red" className="font-semibold">Out of stock</Typography>
                        )}
                    </div>
                </CardFooter>
            </Card>
            {product.stock > 0 && <ProductDetailModal product={product} open={open} onClose={handleOpen} />}
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

