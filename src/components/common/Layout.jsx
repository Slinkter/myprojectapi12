import { useContext } from "react";
import ThemeSwitcher from "./ThemeSwitcher";
import CartIcon from "@/features/cart/components/CartIcon";
import PropTypes from "prop-types";
import { CartContext } from "@/features/cart/context/CartContext";

const Layout = ({ children }) => {
  const { toggleCart } = useContext(CartContext);

  return (
    <div className="layout">
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
