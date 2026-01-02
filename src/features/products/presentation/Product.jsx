import React from "react";
import PropTypes from "prop-types";
import { useProductModalContext } from "../application/ProductModalContext";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";

const Product = React.memo(({ product }) => {
  const { handleOpenModal } = useProductModalContext();

  return (
    <Card className="w-full h-full flex flex-col shadow-md hover:shadow-xl transition-shadow border border-blue-gray-100 bg-[var(--bg-card)] dark:bg-[var(--dark-card)] dark:border-blue-gray-800">
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="m-0 p-4 h-56 flex items-center justify-center bg-white rounded-b-none border-b border-blue-gray-50 dark:border-blue-gray-800"
      >
        <img
          src={product?.thumbnail}
          alt={product?.title}
          className="h-full w-full object-contain hover:scale-105 transition-transform duration-300"
        />
      </CardHeader>
      <CardBody className="p-5 flex-grow flex flex-col">
        <div className="mb-2 flex items-center justify-between">
          <Typography
            color="blue-gray"
            className="font-bold text-lg leading-tight dark:text-[var(--text-primary)] line-clamp-2"
          >
            {product?.title}
          </Typography>
        </div>
        <Typography
          variant="small"
          color="gray"
          className="font-normal opacity-75 line-clamp-3 mb-4 dark:text-[var(--text-secondary)]"
        >
          {product?.description}
        </Typography>
        <div className="mt-auto flex items-center justify-between border-t border-blue-gray-50 pt-4 dark:border-blue-gray-700">
          <Typography
            color="blue-gray"
            className="font-bold text-xl dark:text-[var(--text-primary)]"
          >
            $ {product?.price}
          </Typography>
          <Typography
            variant="small"
            color="gray"
            className="font-medium dark:text-[var(--text-secondary)]"
          >
            Stock: {product?.stock}
          </Typography>
        </div>
      </CardBody>
      <CardFooter className="pt-0 p-5">
        {product.stock > 0 ? (
          <Button
            ripple={true}
            fullWidth={true}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-none hover:shadow-md transition-colors"
            onClick={() => handleOpenModal(product)}
          >
            Add to Cart
          </Button>
        ) : (
          <Button
            fullWidth={true}
            disabled
            className="bg-blue-gray-100 text-blue-gray-400 shadow-none hover:shadow-none"
          >
            Out of Stock
          </Button>
        )}
      </CardFooter>
    </Card>
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
