/**
 * @file Navbar.tsx
 * @description Barra de navegación principal de la aplicación. Orquesta los
 * widgets de búsqueda, carrito, tema, autenticación, categorías y menú móvil.
 * @architecture Widget Layer - Navigation Bar
 */

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { IconButton } from "@/shared/ui/IconButton";
import { NavLink } from "@/widgets/NavLink";
import SearchComponent from "@/widgets/SearchComponent";
import CartButton from "@/widgets/CartButton";
import ThemeToggle from "@/widgets/ThemeToggle";
import AuthActions from "@/widgets/AuthActions";
import CategoriesDropdown from "@/widgets/CategoriesDropdown";
import MobileMenu from "@/widgets/MobileMenu";
import { useSearchTrigger } from "@/widgets/hooks/useSearchTrigger";
import { useLogLifecycle } from "@/shared/hooks";
import { useCategories } from "@/features/products/application/useCategories";
import { useAuth } from "@/features/auth/application/AuthContext";
import { LoginModal } from "@/features/auth/presentation/LoginModal";

/**
 * @component NavLogo
 * @description Logo animado de la aplicación con enlace a la página de inicio.
 * Muestra el nombre "MyProjectAPI12".
 *
 * @returns {JSX.Element} Elemento Link con el logo y nombre de la marca.
 */
const NavLogo = () => (
    <Link
        to="/"
        className="flex items-center gap-2.5 no-underline shrink-0 group rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
        <div className="flex flex-col">
            <span className="text-lg font-extrabold tracking-tight leading-none text-slate-800 dark:text-slate-100">
                MyProject
                <span className="text-primary transition-colors group-hover:text-primary-hover">
                    API12
                </span>
            </span>
        </div>
    </Link>
);

/**
 * @component Navbar
 * @description Barra de navegación principal de la aplicación. Incluye logo,
 * enlaces de navegación, búsqueda expandible, selector de categorías, cambio
 * de tema, carrito, controles de sesión y menú responsive para móviles.
 *
 * @remarks
 * **Secuencia de carga:**
 * 1. `useSearchTrigger` -> estado global de búsqueda (input expand-on-click).
 * 2. `useCategories()` -> carga categorías para dropdown desktop y menú móvil.
 * 3. `useAuth()` -> roles y controles de sesión vía `AuthActions`.
 * 4. Menu desktop: `NavLink` + `CategoriesDropdown` envuelto en animación.
 * 5. `SearchComponent` -> formulario expandible (desktop) con foco automático.
 * 6. `ThemeToggle` y `CartButton` (con `CartBadge`) -> acciones a la derecha.
 * 7. `MobileMenu` -> panel deslizante con búsqueda y categorías (solo móvil).
 * 8. `LoginModal` -> se abre con `?login=true` o desde el botón de sesión.
 *
 * @returns {JSX.Element} Header con navegación completa.
 */
const Navbar = () => {
    useLogLifecycle("Navbar");

    const { user } = useAuth();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isCatOpen, setIsCatOpen] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const { data: categories, isLoading } = useCategories();

    const {
        searchVal,
        setSearchVal,
        isOpen: isSearchOpen,
        triggerSearch,
        openSearch,
        closeSearch,
    } = useSearchTrigger();

    const isHome = location.pathname === "/" && !location.search;
    const isCatActive = location.pathname === "/" && !!location.search;

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                if (isCatOpen) setIsCatOpen(false);
                if (isSearchOpen) closeSearch();
                if (isMobileOpen) setIsMobileOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isCatOpen, isSearchOpen, isMobileOpen, closeSearch]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get("login") === "true") {
            setIsLoginOpen(true);
            navigate("/", { replace: true });
        }
    }, [location.search, navigate]);

    const handleCategorySelect = (slug: string | null) => {
        setIsMobileOpen(false);
        setIsCatOpen(false);
        navigate(slug ? `/?category=${slug}` : "/");
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        triggerSearch(searchVal);
    };

    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800/80 shadow-[0_2px_15px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_15px_rgba(0,0,0,0.3)] transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
                <NavLogo />

                {/* ── Desktop Nav (center) ── */}
                <nav
                    aria-label="Navegación principal"
                    className="hidden md:flex items-center justify-center gap-1 flex-grow"
                >
                    <AnimatePresence mode="wait">
                        {!isSearchOpen && (
                            <m.div
                                key="desktop-links"
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                transition={{ duration: 0.18, ease: "easeOut" }}
                                className="flex items-center gap-1"
                            >
                                <NavLink to="/" active={isHome}>
                                    Inicio
                                </NavLink>

                                <CategoriesDropdown
                                    active={isCatActive}
                                    open={isCatOpen}
                                    onToggle={() => setIsCatOpen(!isCatOpen)}
                                    onClose={() => setIsCatOpen(false)}
                                    onSelect={handleCategorySelect}
                                />

                                <NavLink
                                    to="/faq"
                                    active={location.pathname === "/faq"}
                                >
                                    Ayuda & FAQ
                                </NavLink>
                            </m.div>
                        )}
                    </AnimatePresence>
                </nav>

                {/* ── Actions (right) ── */}
                <div className="flex items-center gap-1">
                    <SearchComponent
                        open={isSearchOpen}
                        searchVal={searchVal}
                        onSearchChange={setSearchVal}
                        onOpen={openSearch}
                        onClose={closeSearch}
                        onSubmit={handleSearchSubmit}
                    />

                    <ThemeToggle />
                    <CartButton />

                    <div className="flex items-center gap-1">
                        <AuthActions onLogin={() => setIsLoginOpen(true)} />
                    </div>

                    {/* Mobile Hamburger — only on mobile */}
                    <div className="block md:hidden">
                        <IconButton
                            onClick={() => setIsMobileOpen(!isMobileOpen)}
                            label={isMobileOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
                        >
                            <AnimatePresence mode="wait">
                                {isMobileOpen ? (
                                    <m.span
                                        key="x"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.18 }}
                                    >
                                        <X size="18" />
                                    </m.span>
                                ) : (
                                    <m.span
                                        key="burger"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                        transition={{ duration: 0.18 }}
                                    >
                                        <Menu size="18" />
                                    </m.span>
                                )}
                            </AnimatePresence>
                        </IconButton>
                    </div>
                </div>
            </div>

            <MobileMenu
                open={isMobileOpen}
                isHome={isHome}
                pathname={location.pathname}
                isAdmin={user?.role === "admin"}
                searchVal={searchVal}
                onSearchChange={setSearchVal}
                onSearchSubmit={handleSearchSubmit}
                onCategorySelect={handleCategorySelect}
                onClose={() => setIsMobileOpen(false)}
                categories={categories}
                isLoading={isLoading}
            />

            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
            />
        </header>
    );
};

export default Navbar;