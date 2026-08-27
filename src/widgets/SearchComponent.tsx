/**
 * @file SearchComponent.tsx
 * @description Componente dedicado a la interfaz y la lógica de la búsqueda.
 * Encapsula el estado de búsqueda, el evento de submit y la interacción del usuario.
 * @architecture Widget Layer - Search Bar
 */

import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { eventBus, DomainEvents } from "@/shared/infrastructure/eventBus";
import { m, AnimatePresence } from "framer-motion";

/**
 * @component SearchComponent
 * @description Muestra el formulario de búsqueda expandible. 
 * Dispara el evento `SEARCH_TRIGGERED` al enviar la consulta.
 * @param {Object} props - Propiedades del componente.
 * @param {boolean} props.initialOpen - Si debe estar abierto inicialmente.
 * @returns {JSX.Element} Elemento de formulario de búsqueda.
 */
const SearchComponent = ({ initialOpen }: { initialOpen: boolean }) => {
    const [searchVal, setSearchVal] = useState("");
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(initialOpen);
    
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = searchVal.trim();
        if (!trimmed) return;
        navigate("/");
        // Publicar evento de búsqueda desacoplado mediante Domain EventBus (Observer Pattern)
        eventBus.emit(DomainEvents.SEARCH_TRIGGERED, { query: trimmed });
        setIsOpen(false);
    };

    const closeSearch = () => {
        setSearchVal("");
        setIsOpen(false);
    };

    return (
        <AnimatePresence mode="wait">
            {isOpen ? (
                <m.form
                    key="search-open"
                    onSubmit={handleSearchSubmit}
                    // Se mantiene la animación de entrada/salida de Navbar.tsx
                    role="search"
                    className="flex items-center gap-2 w-64 bg-slate-100/90 dark:bg-slate-800/90 rounded-full border border-emerald-500/50 dark:border-emerald-500/40 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/30 px-3 overflow-hidden h-10 transition-colors"
                >
                    <Search size="16" className="text-primary shrink-0" />
                    <input
                        value={searchVal}
                        onChange={(e) => setSearchVal(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Escape") {
                                closeSearch();
                            }
                        }}
                        placeholder="Buscar productos…"
                        className="border-none bg-transparent outline-none text-sm text-slate-800 dark:text-slate-100 w-full placeholder:text-slate-400"
                        aria-label="Buscar productos"
                    />
                    <button
                        type="button"
                        onClick={closeSearch}
                        aria-label="Cerrar búsqueda"
                        className="flex items-center justify-center w-6 h-6 rounded-full bg-transparent border-none cursor-pointer text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
                    >
                        <X size="14" />
                    </button>
                </m.form>
            ) : (
                <m.div
                    key="search-closed"
                    // Animación de entrada/salida
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <button
                        type="button"
                        // NOTA: El onClick ahora debe ser manejado por el componente padre (Navbar)
                        onClick={() => alert("Abrir SearchComponent directamente es peligroso. Debe ser manejado por el padre.")}
                        className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-none bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all duration-150 cursor-pointer text-slate-600 dark:text-slate-300 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                        <Search size="20" />
                    </button>
                </m.div>
            )}
        </AnimatePresence>
    );
};

export default SearchComponent;