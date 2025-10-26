import ThemeSwitcher from "@/component/ThemeSwitcher";
import CartIcon from "@/component/CartIcon";
import PropTypes from "prop-types";

const Layout = ({ children, onCartIconClick }) => {
    return (
        <div className="min-h-screen bg-custom-light-gray dark:bg-dark-bg font-sans">
            <div className="container mx-auto px-4 py-8">
                <div className="fixed top-4 right-4 z-10 flex items-center space-x-2">
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
