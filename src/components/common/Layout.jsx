import ThemeSwitcher from "./ThemeSwitcher";
import CartIcon from "@/features/cart/components/CartIcon";
import PropTypes from "prop-types";

const Layout = ({ children, onCartIconClick }) => {
    return (
        <div className="layout">
            <div className="layout__container">
                <div className="layout__controls">
                    <ThemeSwitcher />
                    <CartIcon onClick={onCartIconClick} />
                </div>
                {children}
            </div>
        </div>
    );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired,
    onCartIconClick: PropTypes.func.isRequired,
};

export default Layout;
