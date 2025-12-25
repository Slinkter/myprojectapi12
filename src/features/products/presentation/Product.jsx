import React, { useState } from "react";
import PropTypes from "prop-types";
import ProductDetailModal from "./ProductDetailModal";

const Product = React.memo(({ product }) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(!open);

    return (
        <>
            <div className="neumo-card transition-transform duration-300 hover:scale-105">
                <div className="h-56">
                    <img
                        className="h-full w-full object-cover rounded-t-xl"
                        src={product?.thumbnail}
                        alt={product?.title}
                    />
                </div>
                <div className="p-4">
                    <h5 className="font-bold text-lg mb-2 truncate">
                        {product?.title}
                    </h5>
                    <p className="font-normal text-sm text-gray-600 dark:text-gray-400 truncate h-5">
                        {product?.description}
                    </p>
                </div>
                <div className="p-4 border-t border-[var(--neumo-shadow-dark)] dark:border-[var(--neumo-shadow-dark-mode-dark)]">
                    <div className="flex justify-between items-center">
                        <p className="font-bold text-lg">
                            $ {product?.price}
                        </p>
                        {product.stock > 0 ? (
                            <button
                                onClick={handleOpen}
                                className="neumo-button px-4 py-2 text-sm text-[var(--neumo-accent)]"
                            >
                                Details
                            </button>
                        ) : (
                            <p className="font-semibold text-red-500">
                                Out of stock
                            </p>
                        )}
                    </div>
                </div>
            </div>
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
