/**
 * @file useSearchTrigger.ts
 * @description Hook de aplicación para encapsular la lógica de la búsqueda global.
 * Incluye el estado del término de búsqueda, la apertura/cierre de la vista y la
 * emisión del evento de Dominio al enviar una consulta.
 * @architecture Application Layer - Hook
 */

import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { eventBus, DomainEvents } from "@/shared/infrastructure/eventBus";

/**
 * @hook useSearchTrigger
 * @description Gestiona el estado, el foco y la emisión de eventos para la funcionalidad de búsqueda de productos.
 * @returns {{ searchVal: string, setSearchVal: (query: string) => void, isSearching: boolean, triggerSearch: (query: string) => void, openSearch: () => void, closeSearch: () => void, isOpen: boolean }}
 */
export const useSearchTrigger = () => {
    const [searchVal, setSearchVal] = useState("");
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    // Función que activa la búsqueda y emite el evento
    const triggerSearch = useCallback((query: string) => {
        const trimmed = query.trim();
        if (!trimmed) return;

        // 1. Navegar a la ruta raíz (la búsqueda filtra en la Home)
        navigate("/");

        // 2. Publicar evento de búsqueda desacoplado mediante Domain EventBus (Observer Pattern)
        eventBus.emit(DomainEvents.SEARCH_TRIGGERED, { query: trimmed });

        // 3. Cerrar la vista de búsqueda
        setIsOpen(false);
    }, [navigate]);

    // Función para abrir la vista de búsqueda (el foco lo gestiona SearchComponent)
    const openSearch = useCallback(() => {
        setIsOpen(true);
    }, []);

    // Función para cerrar la búsqueda
    const closeSearch = useCallback(() => {
        setSearchVal("");
        setIsOpen(false);
    }, []);

    return {
        searchVal,
        setSearchVal: setSearchVal,
        isOpen,
        isSearching: isOpen, // Usamos 'isOpen' como indicador de que el componente está activo
        triggerSearch: triggerSearch,
        openSearch: openSearch,
        closeSearch: closeSearch,
    };
};