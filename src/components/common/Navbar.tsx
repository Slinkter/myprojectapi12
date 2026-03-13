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
                "sticky top-0 z-50 w-full transition-all duration-500 ease-in-out border-b",
                scrolled
                    ? "bg-background/80 backdrop-blur-lg border-border shadow-soft py-2"
                    : "bg-transparent border-transparent py-4",
            )}
            aria-label="Navegación principal"
        >
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                {/* Área del Logo */}
                <Link
                    to="/"
                    className="group flex items-center gap-2 transition-all duration-300"
                    aria-label="Ir a la página de inicio"
                >
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                        <span className="text-white font-serif font-bold text-xl italic">A</span>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-lg font-serif font-black tracking-tighter text-foreground leading-none">
                            API <span className="text-primary italic">Twelve</span>
                        </h1>
                        <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-bold">Luxury Catalog</span>
                    </div>
                </Link>

                {/* Área de Acciones */}
                <div className="flex items-center gap-3">
                    <ThemeSwitcher />

                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleCart}
                            className="relative w-12 h-12 rounded-full hover:bg-primary/5 transition-all duration-300 active:scale-95 text-muted-foreground hover:text-primary border border-transparent hover:border-primary/10"
                            aria-label="Abrir carrito de compras"
                        >
                            <CartIcon />
                            {totalItems > 0 && (
                                <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-lg shadow-primary/30 ring-2 ring-background animate-in zoom-in duration-500">
                                    {totalItems}
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
