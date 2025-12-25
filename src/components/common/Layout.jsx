import { useContext } from "react";
import PropTypes from "prop-types";
import ThemeSwitcher from "./ThemeSwitcher";
import CartIcon from "@/features/cart/presentation/CartIcon";
import { CartContext } from "@/features/cart/application/CartContext";
import { useEffect } from "react";

const Layout = ({ children }) => {
  //
  const { toggleCart } = useContext(CartContext);

  function testing() {
    console.log("testing");
  }

  useEffect(() => {
    testing();
    return () => {};
  }, []);

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
