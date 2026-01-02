import { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Navbar, Typography, IconButton } from "@material-tailwind/react";
import ThemeSwitcher from "@/features/theme/presentation/ThemeSwitcher";
import CartIcon from "@/features/cart/presentation/CartIcon";
import { CartContext } from "@/features/cart/application/CartContext";
import { Toaster } from "react-hot-toast";

const Layout = ({ children }) => {
  const { toggleCart } = useContext(CartContext);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-main)]">
      <Toaster position="top-center" reverseOrder={false} />

      <Navbar
        className={`sticky top-0 z-30 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4 border-none transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-md dark:bg-gray-900/90"
            : "bg-transparent shadow-none"
        }`}
      >
        <div className="flex items-center justify-between text-blue-gray-900 dark:text-gray-100">
          <Link to="/" className="mr-4 cursor-pointer py-1.5 font-medium">
            <Typography
              as="span"
              variant="h5"
              className="mr-4 cursor-pointer py-1.5 font-bold tracking-tight text-blue-gray-900 dark:text-white"
            >
              MyProjectAPI12
            </Typography>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <ThemeSwitcher />
            </div>

            <div className="relative">
              <IconButton
                variant="text"
                color="blue-gray"
                onClick={toggleCart}
                className="rounded-full hover:bg-blue-gray-50/50 dark:hover:bg-gray-800"
              >
                <CartIcon />
              </IconButton>
            </div>
          </div>
        </div>
      </Navbar>

      <div className="container mx-auto px-4 py-8">{children}</div>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
