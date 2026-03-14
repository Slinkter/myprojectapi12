/**
 * @file Navbar.tsx
 * @description Barra de navegación principal con optimizaciones de rendimiento.
 * - Scroll detection con useMemo
 * - Micro-interactions en hover
 * - Animaciones suaves
 * @architecture Presentation Layer - Widget
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useCart } from "@/features/cart/application/useCart";
import ThemeSwitcher from "@/features/theme/presentation/ThemeSwitcher";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { Button } from "@/components/ui/button";

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const { toggleCart, totalItems } = useCart();

    // Optimizar scroll listener
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                "sticky top-0 z-50 w-full transition-all duration-300 ease-in-out border-b",
                isScrolled
                    ? "bg-background/90 backdrop-blur-md border-border shadow-soft"
                    : "bg-transparent border-transparent",
            )}
            aria-label="Navegación principal"
        >
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
                {/* Logo */}
                <Link
                    to="/"
                    className="group flex items-center gap-2.5 transition-opacity hover:opacity-80"
                    aria-label="Ir a la página de inicio"
                >
                    <div className="flex flex-col">
                        <h1 className="text-lg font-bold tracking-tight text-foreground leading-none">
                            My Project API
                        </h1>
                    </div>
                    <span className="text-primary font-bold">12</span>
                </Link>

                {/* Acciones */}
                <div className="flex items-center gap-2 sm:gap-4">
                    <ThemeSwitcher />

                    {/* Cart Button */}
                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleCart}
                            className="relative w-11 h-11 rounded-full hover:bg-accent transition-all duration-200 active:scale-95 text-muted-foreground hover:text-primary"
                            aria-label="Abrir carrito de compras"
                        >
                            <HiOutlineShoppingBag className="h-6 w-6" />
                        </Button>

                        {/* Badge del carrito */}
                        {totalItems > 0 && (
                            <span
                                className={cn(
                                    "absolute -top-1 -right-1 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-sm ring-2 ring-background font-bold text-[10px] min-w-[1.25rem] h-5 px-1",
                                    "animate-in zoom-in fade-in duration-300",
                                )}
                            >
                                {totalItems > 9 ? "9+" : totalItems}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
