import React from "react";
import Product from "./Product";

const Products = ({ products }) => {
    console.log(products);

    return (
        <div className="container  mx-auto flex flex-row flex-wrap justify-center items-center gap-6">
            {products.map((product, idx) => (
                <Product key={idx} product={product} />
            ))}
        </div>
    );
};

export default Products;
