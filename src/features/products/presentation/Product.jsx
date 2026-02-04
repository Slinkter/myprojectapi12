import React from "react";
import PropTypes from "prop-types";
import { useProductModalContext } from "../application/ProductModalContext";

const Product = React.memo(({ product }) => {
  const { handleOpenModal } = useProductModalContext();

  return (
    <div className="product-card neumo-card w-full h-full flex flex-col">
      {/* Card Header / Image */}
      <div className="product-card__image-container h-56 flex items-center justify-center rounded-t-2xl border-b border-gray-100 dark:border-gray-700 p-4 overflow-hidden">
        <img
          src={product?.thumbnail}
          alt={product?.title}
          className="product-card__image h-full w-full object-contain transition-transform duration-300"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Card Body */}
      <div className="p-5 flex-grow flex flex-col">
        <div className="mb-2">
          <h3 className="font-bold text-lg leading-tight text-gray-900 dark:text-gray-100 line-clamp-2">
            {product?.title}
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 italic">
          {product?.description}
        </p>
        <div className="mt-auto flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-4">
          <span className="font-bold text-xl text-amber-600 dark:text-amber-500">
            $ {product?.price}
          </span>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Stock: {product?.stock}
          </span>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-5 pt-0">
        {product.stock > 0 ? (
          <button
            onClick={() => handleOpenModal(product)}
            className="neumo-button-primary w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300"
          >
            Add to Cart
          </button>
        ) : (
          <button
            disabled
            className="w-full py-3 px-4 rounded-xl font-semibold bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
          >
            Out of Stock
          </button>
        )}
      </div>
    </div>
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
