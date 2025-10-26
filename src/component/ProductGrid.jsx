import Product from "@/component/Product";
import PropTypes from "prop-types";

const ProductGrid = ({ products }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
                <Product key={product.id} product={product} />
            ))}
        </div>
    );
};

ProductGrid.propTypes = {
    products: PropTypes.array.isRequired,
};

export default ProductGrid;
