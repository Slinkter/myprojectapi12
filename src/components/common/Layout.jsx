import { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
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

      <nav
        className={`sticky top-0 z-30 w-full px-3 py-2 sm:px-4 sm:py-3 lg:px-8 lg:py-4 border-b transition-all duration-300 ${scrolled
          ? "bg-white/90 backdrop-blur-md shadow-md dark:bg-gray-900/90 border-gray-200 dark:border-gray-800"
          : "bg-transparent shadow-none border-transparent"
          }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container mx-auto flex items-center justify-between text-gray-900 dark:text-gray-100">
          <Link
            to="/"
            className="mr-2 sm:mr-4 cursor-pointer py-1.5 font-medium"
            aria-label="Go to home page"
          >
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              MyProjectAPI12
            </h1>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeSwitcher />

            <div className="relative">
              <button
                onClick={toggleCart}
                className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center"
                aria-label="Open shopping cart"
              >
                <CartIcon />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-3 py-6 sm:px-4 sm:py-8" role="main">
        {children}
      </main>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
