/**
 * @file SearchComponent.tsx
 * @description Formulario de búsqueda expandible para el Navbar (desktop).
 * Componente presentacional: el estado (abierto/cerrado, valor) y el envío del
 * evento `SEARCH_TRIGGERED` los gestiona el padre vía useSearchTrigger.
 * @architecture Widget Layer - Search Bar
 */

import React, { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";
import { IconButton } from "@/shared/ui/IconButton";

/**
 * Props para el componente SearchComponent.
 * @interface ISearchComponentProps
 */
interface ISearchComponentProps {
    /** Indica si la búsqueda está expandida. */
    open: boolean;
    /** Valor actual del término de búsqueda. */
    searchVal: string;
    /** Callback al cambiar el término de búsqueda. */
    onSearchChange: (value: string) => void;
    /** Callback para abrir (expandir) la búsqueda. */
    onOpen: () => void;
    /** Callback para cerrar (colapsar) y limpiar la búsqueda. */
    onClose: () => void;
    /** Callback al enviar el formulario de búsqueda. */
    onSubmit: (e: React.FormEvent) => void;
}

/**
 * @component SearchComponent
 * @description Barra de búsqueda expandible del Navbar. En estado abierto muestra
 * el formulario con input y botón de cierre; en estado cerrado un botón de icono.
 *
 * @param {ISearchComponentProps} props - Props tipadas (ver {@link ISearchComponentProps}).
 * @returns {JSX.Element} Formulario de búsqueda animado.
 *
 * @example
 * <SearchComponent open={isOpen} searchVal={searchVal}
 *     onSearchChange={setSearchVal} onOpen={openSearch} onClose={closeSearch}
 *     onSubmit={handleSearchSubmit} />
 */
const SearchComponent = ({
    open,
    searchVal,
    onSearchChange,
    onOpen,
    onClose,
    onSubmit,
}: ISearchComponentProps) => {
    const shouldReduceMotion = useReducedMotion();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open) inputRef.current?.focus();
    }, [open]);

    return (
        <AnimatePresence mode="wait">
            {open ? (
                <m.form
                    key="search-open"
                    onSubmit={onSubmit}
                    initial={
                        shouldReduceMotion ? { opacity: 0 } : { scaleX: 0.2, opacity: 0 }
                    }
                    animate={{ scaleX: 1, opacity: 1 }}
                    exit={
                        shouldReduceMotion ? { opacity: 0 } : { scaleX: 0.2, opacity: 0 }
                    }
                    transition={
                        shouldReduceMotion
                            ? { duration: 0.05 }
                            : { duration: 0.25, ease: [0.16, 1, 0.3, 1] }
                    }
                    style={{ transformOrigin: "right center" }}
                    role="search"
                    className="flex items-center gap-2 w-64 bg-slate-100/90 dark:bg-slate-800/90 rounded-full border border-emerald-500/50 dark:border-emerald-500/40 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/30 px-3 overflow-hidden h-10 transition-colors"
                >
                    <Search size="16" className="text-primary shrink-0" />
                    <input
                        ref={inputRef}
                        value={searchVal}
                        onChange={(e) => onSearchChange(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Escape") {
                                onClose();
                            }
                        }}
                        placeholder="Buscar productos…"
                        className="border-none bg-transparent outline-none text-sm text-slate-800 dark:text-slate-100 w-full placeholder:text-slate-400"
                        aria-label="Buscar productos"
                    />
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Cerrar búsqueda"
                        className="flex items-center justify-center w-6 h-6 rounded-full bg-transparent border-none cursor-pointer text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
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
                    <IconButton onClick={onOpen} label="Buscar productos">
                        <Search size="20" />
                    </IconButton>
                </m.div>
            )}
        </AnimatePresence>
    );
};

export default SearchComponent;