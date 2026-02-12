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
    const { toggleCart } = useCart();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                "sticky top-0 z-50 w-full px-4 py-2 sm:px-6 sm:py-3 lg:px-10 lg:py-4 transition-all duration-500",
                scrolled
                    ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-sm dark:bg-background/80"
                    : "bg-transparent border-b border-transparent shadow-none",
            )}
            role="navigation"
            aria-label="Main navigation"
        >
            <div className="container mx-auto flex items-center justify-between">
                <Link
                    to="/"
                    className="group flex items-center gap-2 transition-transform duration-300 hover:scale-[1.02]"
                    aria-label="Go to home page"
                >
                    <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                        My project api 12
                    </h1>
                </Link>

                <div className="flex items-center gap-3">
                    <ThemeSwitcher />

                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleCart}
                            className="relative rounded-full hover:bg-accent/50 transition-all duration-300 active:scale-90"
                            aria-label="Open shopping cart"
                        >
                            <CartIcon />
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
