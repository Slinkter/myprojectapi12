/**
 * @file Navbar.tsx
 * @description Barra de navegación principal de la aplicación.
 * @architecture Widget Layer - Navigation Bar
 */

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";
import { useCart } from "@/features/cart/application/CartContext";
import { useTheme } from "@/features/theme/application/ThemeContext";
import { useLogLifecycle } from "@/shared/hooks";
import { useCategories } from "@/features/products/application/useCategories";
import {
    Search,
    X,
    Sun,
    Moon,
    ShoppingCart,
    Menu,
    ChevronDown,
    Home,
} from "lucide-react";

/**
 * @component NavLogo
 * @description Logo animado de la aplicación con enlace a la página de inicio.
 * Muestra el nombre "MyProjectAPI12" con un icono de bolsa de compras.
 *
 * @remarks
 * **Secuencia de carga:**
 * 1. `useCart()` -> lee items para badge de cantidad.
 * 2. `useTheme()` -> lee estado para toggle sun/moon.
 * 3. `useCategories()` -> carga categorías de la API.
 * 4. `Link` (react-router) -> navegación interna.
 * 5. Búsqueda: input expand-on-click -> dispatch de evento `input` en HomeContent.
 * 6. Categorías: dropdown animado con `AnimatePresence` + `layoutId`.
 * 7. Tema: `ThemeSwitcher` -> `toggleDarkMode()`.
 * 8. Carrito: badge con `m.span animate={{ scale }}` -> click abre drawer.
 * 9. Mobile: hamburger menu con `AnimatePresence` -> `motion.nav` slide-down.
 *
 * @returns {JSX.Element} Elemento Link con el logo y nombre de la marca.
 */
const NavLogo = () => (
    <Link
        to="/"
        className="flex items-center gap-2.5 no-underline shrink-0 group"
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
 * @component NavLink
 * @description Enlace de navegación con indicador animado de ruta activa.
 * Renderiza un `Link` de React Router con estilos condicionales.
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.to - Ruta de destino.
 * @param {boolean} props.active - Indica si la ruta actual coincide.
 * @param {React.ReactNode} props.children - Contenido del enlace.
 * @param {() => void} [props.onClick] - Callback al hacer clic.
 * @returns {JSX.Element} Elemento Link estilizado.
 */
const NavLink = ({
    to,
    active,
    children,
    onClick,
}: {
    to: string;
    active: boolean;
    children: React.ReactNode;
    onClick?: () => void;
}) => (
    <Link to={to} className="no-underline" onClick={onClick}>
        <div
            className={`px-4 py-2 rounded-full text-sm font-semibold tracking-wide transition-all cursor-pointer relative flex items-center min-h-[44px] ${
                active
                    ? "bg-primary/10 text-primary dark:bg-primary/20 hover:bg-primary/15 dark:hover:bg-primary/25"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
        >
            {children}
            {active && (
                <m.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-[20%] right-[20%] h-0.5 rounded-t-full bg-primary"
                />
            )}
        </div>
    </Link>
);

/**
 * @component ActionBtn
 * @description Botón de acción iconográfico con animaciones de hover y tap.
 * Utilizado para búsqueda, cambio de tema, carrito y menú móvil.
 * @param {Object} props - Propiedades del componente.
 * @param {() => void} [props.onClick] - Callback al hacer clic.
 * @param {string} props.label - Etiqueta ARIA para accesibilidad.
 * @param {React.ReactNode} props.children - Contenido (icono).
 * @param {string} [props.className] - Clases CSS adicionales.
 * @returns {JSX.Element} Botón animado con ícono.
 */
const actionBtnClass =
    "flex items-center justify-center w-10 h-10 rounded-full border-none bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-150 cursor-pointer text-slate-600 dark:text-slate-300 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:ring-offset-1";

const ActionBtn = ({
    onClick,
    label,
    children,
    className,
}: {
    onClick?: () => void;
    label: string;
    children: React.ReactNode;
    className?: string;
}) => (
    <m.button
        type="button"
        onClick={onClick}
        aria-label={label}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`${actionBtnClass} ${className ?? ""}`}
    >
        {children}
    </m.button>
);

/**
 * @component Navbar
 * @description Barra de navegación principal de la aplicación.
 * Incluye logo, enlaces de navegación, búsqueda expandible,
 * selector de categorías, cambio de tema oscuro/claro, carrito
 * y menú responsive para dispositivos móviles.
 * @returns {JSX.Element} Header con navegación completa.
 */
const Navbar = () => {
    useLogLifecycle("Navbar");
    const shouldReduceMotion = useReducedMotion();

    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isCatOpen, setIsCatOpen] = useState(false);
    const [searchVal, setSearchVal] = useState("");
    const searchRef = useRef<HTMLInputElement>(null);

    const location = useLocation();
    const navigate = useNavigate();
    const { cart, openCart } = useCart();
    const { theme, toggleDarkMode } = useTheme();
    const { data: categories, isLoading } = useCategories();

    const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
    const isHome = location.pathname === "/" && !location.search;
    const isCatActive = location.pathname === "/" && !!location.search;

    const handleCategorySelect = (slug: string | null) => {
        setIsMobileOpen(false);
        setIsCatOpen(false);
        navigate(slug ? `/?category=${slug}` : "/");
    };

    const openSearch = () => {
        setIsSearchOpen(true);
        setTimeout(() => searchRef.current?.focus(), 80);
    };

    const closeSearch = () => {
        setIsSearchOpen(false);
        setSearchVal("");
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchVal.trim()) return;
        navigate("/");
        setTimeout(() => {
            const input = document.querySelector<HTMLInputElement>(
                '[aria-label="Buscar productos"]',
            );
            if (input) {
                input.value = searchVal;
                input.dispatchEvent(new Event("input", { bubbles: true }));
                input.focus();
            }
        }, 100);
        closeSearch();
    };

    return (
        <header
            role="banner"
            className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800 shadow-[0_2px_15px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_15px_rgba(0,0,0,0.3)]"
        >
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-2">

                {/* ── Logo ── */}
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

                                {/* Categories Dropdown */}
                                <div className="relative">
                                    <m.button
                                        type="button"
                                        onClick={() => setIsCatOpen(!isCatOpen)}
                                        whileTap={{ scale: 0.98 }}
                                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold tracking-wide border-none cursor-pointer transition-all min-h-[44px] ${
                                            isCatActive
                                                ? "bg-primary/10 text-primary dark:bg-primary/20 hover:bg-primary/15 dark:hover:bg-primary/25"
                                                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                        }`}
                                        aria-haspopup="listbox"
                                        aria-expanded={isCatOpen}
                                        aria-label="Menú de categorías"
                                    >
                                        Categorías
                                        <m.span
                                            animate={{
                                                rotate: isCatOpen ? 180 : 0,
                                            }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <ChevronDown size="14" />
                                        </m.span>
                                    </m.button>

                                    {/* Dropdown Panel */}
                                    <AnimatePresence>
                                        {isCatOpen && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-40"
                                                    onClick={() =>
                                                        setIsCatOpen(false)
                                                    }
                                                    aria-hidden="true"
                                                />
                                                <m.div
                                                    initial={{
                                                        opacity: 0,
                                                        y: -8,
                                                        scale: 0.96,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                        scale: 1,
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                        y: -8,
                                                        scale: 0.96,
                                                    }}
                                                    transition={{
                                                        duration: 0.18,
                                                        ease: [0.4, 0, 0.2, 1],
                                                    }}
                                                    className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-xl p-2 min-w-[220px] max-h-[360px] overflow-y-auto"
                                                    role="listbox"
                                                    aria-label="Categorías de productos"
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleCategorySelect(
                                                                null,
                                                            )
                                                        }
                                                        className="w-full text-left px-4 py-2.5 rounded-xl border-none bg-transparent cursor-pointer text-sm font-bold text-primary hover:bg-primary/10 transition-colors flex items-center gap-2"
                                                    >
                                                        <Home size={15} />
                                                        Todas las categorías
                                                    </button>
                                                    <div className="h-px bg-slate-200 dark:bg-slate-700/60 my-1 mx-2" />
                                                    {isLoading ? (
                                                        <span className="block px-4 py-2.5 text-slate-500 dark:text-slate-400 text-xs">
                                                            Cargando…
                                                        </span>
                                                    ) : (
                                                        categories?.map(
                                                            (cat) => (
                                                                <button
                                                                    key={
                                                                        cat.slug
                                                                    }
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleCategorySelect(
                                                                            cat.slug,
                                                                        )
                                                                    }
                                                                    className="w-full text-left px-4 py-2.5 rounded-xl border-none bg-transparent cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 capitalize transition-colors"
                                                                >
                                                                    {cat.name}
                                                                </button>
                                                            ),
                                                        )
                                                    )}
                                                </m.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </m.div>
                        )}
                    </AnimatePresence>
                </nav>

                {/* ── Actions (right) ── */}
                <div className="flex items-center gap-1">
                    {/* Search — expandible (desktop only) */}
                    <AnimatePresence mode="wait">
                        {isSearchOpen ? (
                            <m.form
                                key="search-open"
                                onSubmit={handleSearchSubmit}
                                initial={
                                    shouldReduceMotion
                                        ? { opacity: 0 }
                                        : {
                                              scaleX: 0.8,
                                              opacity: 0,
                                              originX: 1,
                                          }
                                }
                                animate={{ scaleX: 1, opacity: 1, originX: 1 }}
                                exit={
                                    shouldReduceMotion
                                        ? { opacity: 0 }
                                        : {
                                              scaleX: 0.8,
                                              opacity: 0,
                                              originX: 1,
                                          }
                                }
                                transition={
                                    shouldReduceMotion
                                        ? { duration: 0.05 }
                                        : {
                                              duration: 0.25,
                                              ease: [0.4, 0, 0.2, 1],
                                          }
                                }
                                role="search"
                                className="flex items-center gap-2 bg-slate-100/80 dark:bg-slate-800/80 rounded-full border border-primary px-3 overflow-hidden h-10 w-[240px] sm:w-[300px]"
                            >
                                <Search
                                    size="16"
                                    className="text-primary shrink-0"
                                />
                                <input
                                    ref={searchRef}
                                    value={searchVal}
                                    onChange={(e) =>
                                        setSearchVal(e.target.value)
                                    }
                                    placeholder="Buscar productos…"
                                    className="border-none bg-transparent outline-none text-sm text-slate-800 dark:text-slate-100 w-full"
                                    aria-label="Buscar productos"
                                />
                                <button
                                    type="button"
                                    onClick={closeSearch}
                                    aria-label="Cerrar búsqueda"
                                    className="flex items-center justify-center w-6 h-6 rounded-full bg-none border-none cursor-pointer text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors shrink-0"
                                >
                                    <X size="14" />
                                </button>
                            </m.form>
                        ) : (
                            <m.div
                                key="search-closed"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <ActionBtn
                                    onClick={openSearch}
                                    label="Buscar productos"
                                >
                                    <Search size="20" />
                                </ActionBtn>
                            </m.div>
                        )}
                    </AnimatePresence>

                    {/* Theme Toggle */}
                    <ActionBtn
                        onClick={toggleDarkMode}
                        label={
                            theme === "dark" ? "Activar modo claro" : "Activar modo oscuro"
                        }
                    >
                        <AnimatePresence mode="wait">
                            {theme === "dark" ? (
                                <m.span
                                    key="sun"
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Sun size="20" className="text-amber-500" />
                                </m.span>
                            ) : (
                                <m.span
                                    key="moon"
                                    initial={{ rotate: 90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: -90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Moon size="20" />
                                </m.span>
                            )}
                        </AnimatePresence>
                    </ActionBtn>

                    {/* Cart Button */}
                    <div className="relative">
                        <ActionBtn
                            onClick={openCart}
                            label={`Abrir carrito${totalItems > 0 ? ` — ${totalItems} ${totalItems === 1 ? "artículo" : "artículos"}` : ""}`}
                        >
                            <ShoppingCart size="20" />
                        </ActionBtn>
                        <AnimatePresence>
                            {totalItems > 0 && (
                                <m.div
                                    key="badge"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: [1, 1.2, 1] }}
                                    exit={{ scale: 0 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 18,
                                    }}
                                    className="absolute top-0 right-0 min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-slate-900 pointer-events-none"
                                    aria-hidden="true"
                                >
                                    {totalItems > 9 ? "9+" : totalItems}
                                </m.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Mobile Hamburger — only on mobile */}
                    <div className="block md:hidden">
                        <ActionBtn
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
                        </ActionBtn>
                    </div>
                </div>
            </div>

            {/* ── Mobile Menu ── */}
            <AnimatePresence>
                {isMobileOpen && (
                    <m.nav
                        aria-label="Navegación móvil"
                        initial={
                            shouldReduceMotion
                                ? { opacity: 0 }
                                : { y: -12, opacity: 0 }
                        }
                        animate={{ y: 0, opacity: 1 }}
                        exit={
                            shouldReduceMotion
                                ? { opacity: 0 }
                                : { y: -12, opacity: 0 }
                        }
                        transition={
                            shouldReduceMotion
                                ? { duration: 0.05 }
                                : { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
                        }
                        className="overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 md:hidden"
                    >
                        {/* Mobile search bar */}
                        <div className="px-4 pt-3 pb-1">
                            <form
                                onSubmit={handleSearchSubmit}
                                role="search"
                                className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl px-3 h-10 border border-slate-200 dark:border-slate-700"
                            >
                                <Search size="15" className="text-slate-400 shrink-0" />
                                <input
                                    value={searchVal}
                                    onChange={(e) => setSearchVal(e.target.value)}
                                    placeholder="Buscar productos…"
                                    className="border-none bg-transparent outline-none text-sm text-slate-800 dark:text-slate-100 w-full placeholder:text-slate-400"
                                    aria-label="Buscar productos"
                                />
                                {searchVal && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchVal("")}
                                        aria-label="Limpiar búsqueda"
                                        className="flex items-center justify-center w-5 h-5 rounded-full border-none bg-slate-200 dark:bg-slate-700 cursor-pointer shrink-0"
                                    >
                                        <X size="11" className="text-slate-500 dark:text-slate-400" />
                                    </button>
                                )}
                            </form>
                        </div>

                        <div className="flex flex-col p-3 gap-0.5">
                            {/* Inicio link */}
                            <NavLink
                                to="/"
                                active={isHome}
                                onClick={() => setIsMobileOpen(false)}
                            >
                                Inicio
                            </NavLink>

                            {/* Categories section */}
                            <div className="mt-2">
                                <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-4 py-2">
                                    Categorías
                                </span>

                                <div className="flex flex-col gap-0.5 max-h-[240px] overflow-y-auto">
                                    <button
                                        type="button"
                                        onClick={() => handleCategorySelect(null)}
                                        className="text-left px-4 py-2.5 rounded-xl border-none bg-transparent cursor-pointer text-sm font-bold text-primary hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors flex items-center gap-2 min-h-[44px]"
                                    >
                                        <Home size={14} />
                                        Todas las categorías
                                    </button>

                                    <div className="h-px bg-slate-100 dark:bg-slate-800 mx-3 mb-1" />

                                    {isLoading ? (
                                        <span className="block px-4 py-2 text-slate-400 dark:text-slate-500 text-xs">
                                            Cargando categorías…
                                        </span>
                                    ) : (
                                        categories?.map((cat) => (
                                            <button
                                                key={cat.slug}
                                                type="button"
                                                onClick={() =>
                                                    handleCategorySelect(cat.slug)
                                                }
                                                className="text-left px-4 py-2.5 rounded-xl border-none bg-transparent cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 capitalize transition-colors min-h-[44px]"
                                            >
                                                {cat.name}
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </m.nav>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
