/**
 * @file CategoriesDropdown.tsx
 * @description Selector de categorías con dropdown animado, usado en la navegación
 * desktop del Navbar. Extraído para reducir el tamaño del Navbar.
 * @architecture Widget Layer - Categories Dropdown
 */

import { m, AnimatePresence } from "framer-motion";
import { ChevronDown, Home } from "lucide-react";
import { useCategories } from "@/features/products/application/useCategories";

/**
 * Props para el componente CategoriesDropdown.
 * @interface ICategoriesDropdownProps
 */
interface ICategoriesDropdownProps {
    /** Indica si la ruta actual muestra categorías activas (query `?category=`). */
    active: boolean;
    /** Indica si el dropdown está abierto. */
    open: boolean;
    /** Callback para alternar la apertura del dropdown. */
    onToggle: () => void;
    /** Callback para cerrar el dropdown. */
    onClose: () => void;
    /** Callback al seleccionar una categoría (o null para "Todas"). */
    onSelect: (slug: string | null) => void;
}

/**
 * @component CategoriesDropdown
 * @description Botón "Categorías" con panel desplegable animado que lista las
 * categorías de la API. El estado se controla desde el Navbar para permitir
 * cerrarlo con la tecla Escape.
 *
 * @param {ICategoriesDropdownProps} props - Props tipadas (ver {@link ICategoriesDropdownProps}).
 * @returns {JSX.Element} Botón y panel de categorías.
 *
 * @example
 * <CategoriesDropdown active={isCatActive} open={isCatOpen} onToggle={...} onClose={...} onSelect={...} />
 */
const CategoriesDropdown = ({
    active,
    open,
    onToggle,
    onClose,
    onSelect,
}: ICategoriesDropdownProps) => {
    const { data: categories, isLoading } = useCategories();

    return (
        <div className="relative">
            <m.button
                type="button"
                onClick={onToggle}
                whileTap={{ scale: 0.98 }}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold tracking-wide border-none cursor-pointer transition-colors min-h-[48px] md:min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                    active
                        ? "bg-primary/10 text-primary dark:bg-primary/20 hover:bg-primary/15 dark:hover:bg-primary/25"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                }`}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label="Menú de categorías"
            >
                Categorías
                <m.span
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown size="14" />
                </m.span>
            </m.button>

            <AnimatePresence>
                {open && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={onClose}
                            aria-hidden="true"
                        />
                        <m.div
                            initial={{ opacity: 0, y: -8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.96 }}
                            transition={{
                                duration: 0.18,
                                ease: [0.4, 0, 0.2, 1],
                            }}
                            className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-xl p-2 min-w-[220px] max-h-[360px] overflow-y-auto"
                            role="listbox"
                            aria-label="Categorías de productos"
                        >
                            <button
                                type="button"
                                onClick={() => onSelect(null)}
                                className="w-full text-left px-4 py-2.5 rounded-xl border-none bg-transparent cursor-pointer text-sm font-bold text-primary hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
                            >
                                <Home size={15} />
                                Todas las categorías
                            </button>
                            <div className="h-px bg-slate-200/80 dark:bg-slate-700/60 my-1 mx-2" />
                            {isLoading ? (
                                <span className="block px-4 py-2.5 text-slate-500 dark:text-slate-400 text-xs">
                                    Cargando…
                                </span>
                            ) : (
                                categories?.map((cat) => (
                                    <button
                                        key={cat.slug}
                                        type="button"
                                        onClick={() => onSelect(cat.slug)}
                                        className="w-full text-left px-4 py-2.5 rounded-xl border-none bg-transparent cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
                                    >
                                        {cat.name}
                                    </button>
                                ))
                            )}
                        </m.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CategoriesDropdown;