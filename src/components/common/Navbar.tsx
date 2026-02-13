/**
 * @file Navbar.tsx
 * @description La barra de navegación principal de la aplicación.
 * Maneja el estado del scroll para cambiar la apariencia y proporciona acceso a ThemeSwitcher y al Carrito.
 * @architecture Capa de Presentación - Componentes Comunes
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
 * @description Componente de cabecera de navegación principal.
 * Presenta un comportamiento pegajoso (sticky) que cambia el fondo al hacer scroll.
 *
 * @returns {JSX.Element} El Navbar renderizado.
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
                    : "bg-transparent border-transparent",
            )}
            role="navigation"
            aria-label="Navegación principal"
        >
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
                {/* Área del Logo */}
                <Link
                    to="/"
                    className="group flex items-center gap-2.5 transition-opacity hover:opacity-80"
                    aria-label="Ir a la página de inicio"
                >
                    <div className="flex flex-col">
                        <h1 className="text-lg font-bold tracking-tight text-(--text-primary) leading-none">
                            My Project API
                        </h1>
                    </div>
                    <span>12</span>
                </Link>

                {/* Área de Acciones */}
                <div className="flex items-center gap-2 sm:gap-4">
                    <ThemeSwitcher />

                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleCart}
                            className="relative w-10 h-10 rounded-full hover:bg-(--bg-input) transition-all duration-200 active:scale-95 text-(--text-primary)"
                            aria-label="Abrir carrito de compras"
                        >
                            <CartIcon />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-(--bg-main) animate-in zoom-in duration-300 pointer-events-none">
                                    {totalItems > 9 ? "9+" : totalItems}
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
