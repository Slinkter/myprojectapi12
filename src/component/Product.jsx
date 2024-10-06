import React from "react";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Button,
} from "@material-tailwind/react";
import PropTypes from "prop-types";

const Product = ({ product }) => {
    return (
        <>
            <Card className="w-full md:w-96 md:h-96 relative">
                <CardHeader shadow={false} floated={false}>
                    <img
                        src={product?.thumbnail}
                        alt="card-image"
                        className="h-full w-full    object-cover md:object-contain"
                    />
                </CardHeader>
                <CardBody>
                    <Typography
                        variant="h3"
                        color="blue-gray"
                        className="font-medium truncate mb-2"
                    >
                        {product?.title}
                    </Typography>
                    <Typography
                        variant="small"
                        color="gray"
                        className="font-normal opacity-75 truncate"
                    >
                        {product?.description}
                    </Typography>
                </CardBody>
                <CardFooter className="bg-blue-gray-100 rounded-lg ">
                    <div className="flex h-auto justify-center items-center">
                        <Typography color="red" className="font-bold ">
                            $ {product?.price}
                        </Typography>
                    </div>
                </CardFooter>
            </Card>
        </>
    );
};

Product.propTypes = {
    product: PropTypes.shape({
        thumbnail: PropTypes.string.isRequired, // Asegúrate de que el producto tiene una imagen
        title: PropTypes.string.isRequired, // El título del producto debe ser una cadena
        price: PropTypes.number.isRequired, // El precio debe ser un número
        description: PropTypes.string.isRequired, // La descripción es también una cadena
    }).isRequired,
};
export default Product;
