/**
 * @file MobileMenu.tsx
 * @description Menú desplegable para dispositivos móviles: búsqueda, enlaces de
 * navegación y listado de categorías.
 * @architecture Widget Layer - Mobile Menu
 */

import React from "react";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";
import { Search, X, Home } from "lucide-react";
import { NavLink } from "@/widgets/NavLink";
import type { ICategory } from "@/features/products/infrastructure/productsApi";

/**
 * Props para el componente MobileMenu.
 * @interface IMobileMenuProps
 */
interface IMobileMenuProps {
    /** Indica si el menú está abierto. */
    open: boolean;
    /** Indica si la ruta actual es la página de inicio. */
    isHome: boolean;
    /** Ruta actual para resaltar el enlace activo. */
    pathname: string;
    /** Indica si el usuario autenticado es administrador. */
    isAdmin: boolean;
    /** Valor actual del campo de búsqueda. */
    searchVal: string;
    /** Callback para actualizar el valor de búsqueda. */
    onSearchChange: (value: string) => void;
    /** Callback al enviar el formulario de búsqueda. */
    onSearchSubmit: (e: React.FormEvent) => void;
    /** Callback al seleccionar una categoría (o null para "Todas"). */
    onCategorySelect: (slug: string | null) => void;
    /** Callback para cerrar el menú. */
    onClose: () => void;
    /** Categorías cargadas de la API. */
    categories?: ICategory[];
    /** Indica si las categorías están cargando. */
    isLoading: boolean;
}

/**
 * @component MobileMenu
 * @description Panel deslizante con la búsqueda simplificada, enlaces de
 * navegación y el listado de categorías. Solo visible en pantallas pequeñas.
 *
 * @param {IMobileMenuProps} props - Props tipadas (ver {@link IMobileMenuProps}).
 * @returns {JSX.Element} Menú móvil animado.
 *
 * @example
 * <MobileMenu open={isMobileOpen} isHome={isHome} pathname={location.pathname}
 *     isAdmin={user?.role === "admin"} searchVal={searchVal}
 *     onSearchChange={...} onSearchSubmit={...} onCategorySelect={...}
 *     onClose={...} categories={categories} isLoading={isLoading} />
 */
const MobileMenu = ({
    open,
    isHome,
    pathname,
    isAdmin,
    searchVal,
    onSearchChange,
    onSearchSubmit,
    onCategorySelect,
    onClose,
    categories,
    isLoading,
}: IMobileMenuProps) => {
    const shouldReduceMotion = useReducedMotion();

    return (
        <AnimatePresence>
            {open && (
                <m.nav
                    aria-label="Navegación móvil"
                    initial={shouldReduceMotion ? { opacity: 0 } : { y: -12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { y: -12, opacity: 0 }}
                    transition={
                        shouldReduceMotion
                            ? { duration: 0.05 }
                            : { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
                    }
                    className="overflow-hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 md:hidden"
                >
                    <div className="px-4 pt-3 pb-1">
                        <form
                            onSubmit={onSearchSubmit}
                            role="search"
                            className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl px-3 h-10 border border-slate-200/80 dark:border-slate-700/80"
                        >
                            <Search
                                size="15"
                                className="text-slate-400 shrink-0"
                            />
                            <input
                                value={searchVal}
                                onChange={(e) => onSearchChange(e.target.value)}
                                placeholder="Buscar productos…"
                                className="border-none bg-transparent outline-none text-sm text-slate-800 dark:text-slate-100 w-full placeholder:text-slate-400"
                                aria-label="Buscar productos"
                            />
                            {searchVal && (
                                <button
                                    type="button"
                                    onClick={() => onSearchChange("")}
                                    aria-label="Limpiar búsqueda"
                                    className="flex items-center justify-center w-5 h-5 rounded-full border-none bg-slate-200 dark:bg-slate-700 cursor-pointer shrink-0"
                                >
                                    <X
                                        size="11"
                                        className="text-slate-500 dark:text-slate-400"
                                    />
                                </button>
                            )}
                        </form>
                    </div>

                    <div className="flex flex-col p-3 gap-0.5">
                        <NavLink to="/" active={isHome} onClick={onClose}>
                            Inicio
                        </NavLink>

                        {isAdmin && (
                            <NavLink
                                to="/admin"
                                active={pathname === "/admin"}
                                onClick={onClose}
                            >
                                Panel Admin
                            </NavLink>
                        )}

                        <div className="mt-2">
                            <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-4 py-2">
                                Categorías
                            </span>

                            <div className="flex flex-col gap-0.5 max-h-[240px] overflow-y-auto">
                                <button
                                    type="button"
                                    onClick={() => onCategorySelect(null)}
                                    className="text-left px-4 py-2.5 rounded-xl border-none bg-transparent cursor-pointer text-sm font-bold text-primary hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors flex items-center gap-2 min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
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
                                                onCategorySelect(cat.slug)
                                            }
                                            className="text-left px-4 py-2.5 rounded-xl border-none bg-transparent cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 capitalize transition-colors min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
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
    );
};

export default MobileMenu;