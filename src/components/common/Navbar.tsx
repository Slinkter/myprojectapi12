import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X, Search, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/features/cart/application/CartContext";
import { cn } from "@/lib/utils";
import { useTheme } from "@/features/theme/application/ThemeContext";
import { useLogLifecycle } from "@/shared/hooks";

const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/products", label: "Productos" },
    { href: "/checkout", label: "Checkout" },
];

const Navbar = () => {
    useLogLifecycle("Navbar");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const location = useLocation();
    const { cart } = useCart();
    const { theme, toggleDarkMode } = useTheme();

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const isActive = (path: string) => location.pathname === path;

    return (
        <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm border-b border-border">
            <div className="container mx-auto flex h-14 items-center justify-between px-4">
                <Link
                    to="/"
                    className="flex items-center gap-2 text-lg font-semibold text-foreground hover:text-primary transition-colors"
                >
                    API-12
                </Link>

                <nav className="hidden md:flex items-center gap-1">
                    {navLinks.map(({ href, label }) => (
                        <Link
                            key={href}
                            to={href}
                            className={cn(
                                "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                                "hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary",
                                isActive(href)
                                    ? "text-primary bg-primary/10"
                                    : "text-muted-foreground",
                            )}
                        >
                            {label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        className="p-2 rounded-lg hover:bg-muted transition-colors focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                        aria-label="Buscar"
                    >
                        <Search className="w-5 h-5" />
                    </button>

                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-lg hover:bg-muted transition-colors focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                        aria-label={
                            theme === "dark" ? "Modo claro" : "Modo oscuro"
                        }
                    >
                        {theme === "dark" ? (
                            <Sun className="w-5 h-5 text-amber-500" />
                        ) : (
                            <Moon className="w-5 h-5" />
                        )}
                    </button>

                    <Link
                        to="/checkout"
                        className="relative p-2 rounded-lg hover:bg-muted transition-colors focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                        aria-label={`Carrito de compras, ${totalItems} artículos`}
                    >
                        <ShoppingCart className="w-5 h-5" />
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                                {totalItems > 99 ? "99+" : totalItems}
                            </span>
                        )}
                    </Link>

                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label={
                            isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"
                        }
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-5 h-5" />
                        ) : (
                            <Menu className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>

            {isSearchOpen && (
                <div className="border-t border-border bg-background p-4">
                    <div className="container mx-auto">
                        <div className="relative max-w-xl mx-auto">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                                type="search"
                                placeholder="Buscar productos..."
                                className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                autoFocus
                                aria-label="Buscar productos"
                            />
                        </div>
                    </div>
                </div>
            )}

            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-border bg-background">
                    <nav className="container mx-auto px-4 py-2 flex flex-col gap-1">
                        {navLinks.map(({ href, label }) => (
                            <Link
                                key={href}
                                to={href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={cn(
                                    "px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                                    "hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary",
                                    isActive(href)
                                        ? "text-primary bg-primary/10"
                                        : "text-muted-foreground",
                                )}
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Navbar;
