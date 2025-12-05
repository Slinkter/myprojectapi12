import ProductGrid from "./ProductGrid";
import PropTypes from "prop-types";

/**
 * A component that displays a list of products.
 * @param {object} props - The props for the component.
 * @param {Array<object>} props.products - The list of products to display.
 * @returns {JSX.Element}
 */
const Products = ({ products }) => {
    return <ProductGrid products={products} />;
};

Products.propTypes = {
    products: PropTypes.array.isRequired,
};

export default Products;
