import { useContext } from "react";
import PropTypes from "prop-types";
import ThemeSwitcher from "./ThemeSwitcher";
import CartIcon from "@/features/cart/presentation/CartIcon";
import { CartContext } from "@/features/cart/application/CartContext";
import { Toaster } from "react-hot-toast";

const Layout = ({ children }) => {
  const { toggleCart } = useContext(CartContext);

  return (
    <div className="layout">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="layout__container">
        <div className="layout__controls">
          <ThemeSwitcher />
          <CartIcon onClick={toggleCart} />
        </div>
        {children}
      </div>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
