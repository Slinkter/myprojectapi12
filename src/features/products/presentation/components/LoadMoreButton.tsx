/**
 * @file LoadMoreButton.tsx
 * @description Componente de botón diseñado específicamente para activar acciones de "cargar más"
 * con visualización integrada del estado de carga.
 * @architecture Capa de Presentación - Componente de UI
 */

import { memo } from "react";
import { cn } from "@/lib/utils";

/**
 * @interface LoadMoreButtonProps
 * @description Propiedades para el componente LoadMoreButton.
 */
interface LoadMoreButtonProps {
    /** Función a ejecutar cuando se hace clic en el botón */
    onClick: () => void;
    /** Indica si la acción está actualmente cargando */
    loading: boolean;
    /** Nombre de clase personalizado opcional */
    className?: string;
}

/**
 * @component LoadMoreButton
 * @description Renderiza un botón con un spinner de carga y atributos de accesibilidad.
 * 
 * @param {LoadMoreButtonProps} props - Las propiedades del componente.
 * @returns {JSX.Element} El botón de cargar más.
 */
const LoadMoreButton = memo(({ onClick, loading, className }: LoadMoreButtonProps) => {
    return (
        <button
            onClick={onClick}
            disabled={loading}
            className={cn(
                "page-home__load-more-button flex items-center justify-center gap-2",
                loading && "opacity-70 cursor-not-allowed",
                className
            )}
            aria-label={loading ? "Cargando más items..." : "Cargar más items"}
        >
            {loading ? (
                <>
                    <div className={cn("animate-spin rounded-full h-5 w-5 border-b-2 border-white")} />
                    <span>Cargando...</span>
                </>
            ) : (
                "Cargar más"
            )}
        </button>
    );
});

LoadMoreButton.displayName = "LoadMoreButton";

export default LoadMoreButton;
