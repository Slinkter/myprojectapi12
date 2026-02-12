/**
 * @file Navbar.tsx
 * @description The main navigation bar for the application.
 * Handles scroll state to change appearance and provides access to ThemeSwitcher and Cart.
 * @architecture Presentation Layer - Common Components
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useCart } from "@/features/cart/application/useCart";
import ThemeSwitcher from "@/features/theme/presentation/ThemeSwitcher";
import CartIcon from "@/features/cart/presentation/CartIcon";
import { Button } from "@/components/ui/button";

/**
 * @component Navbar
 * @description Main navigation header component.
 * Features a sticky behavior that changes background on scroll.
 *
 * @returns {JSX.Element} The rendered Navbar.
 */
const Navbar = (): JSX.Element => {
    const [scrolled, setScrolled] = useState<boolean>(false);
    const { toggleCart, cart } = useCart();

    // Calcular items totales para el badge
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                "sticky top-0 z-50 w-full transition-all duration-300 ease-in-out border-b",
                scrolled
                    ? "bg-(--bg-main)/80 backdrop-blur-md border-(--border-light) shadow-sm"
                    : "bg-transparent border-transparent"
            )}
            role="navigation"
            aria-label="Main navigation"
        >
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
                {/* Logo Area */}
                <Link
                    to="/"
                    className="group flex items-center gap-2.5 transition-opacity hover:opacity-80"
                    aria-label="Go to home page"
                >
                    <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                        <span className="font-bold text-lg leading-none tracking-tighter">A12</span>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-lg font-bold tracking-tight text-(--text-primary) leading-none">
                            API 12
                        </h1>
                        <span className="text-[10px] font-medium text-(--text-secondary) tracking-widest uppercase">
                            Store
                        </span>
                    </div>
                </Link>

                {/* Actions Area */}
                <div className="flex items-center gap-2 sm:gap-4">
                    <ThemeSwitcher />

                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleCart}
                            className="relative w-10 h-10 rounded-full hover:bg-(--bg-input) transition-all duration-200 active:scale-95 text-(--text-primary)"
                            aria-label="Open shopping cart"
                        >
                            <CartIcon />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-(--bg-main) animate-in zoom-in duration-300 pointer-events-none">
                                    {totalItems > 9 ? '9+' : totalItems}
                                </span>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
