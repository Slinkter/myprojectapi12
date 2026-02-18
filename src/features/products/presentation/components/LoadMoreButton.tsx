/**
 * @file LoadMoreButton.tsx
 * @description Componente de botón diseñado específicamente para activar acciones de "cargar más"
 * con visualización integrada del estado de carga.
 * @architecture Capa de Presentación - Componente de UI
 */

import { memo } from "react";
import { Button } from "@/components/ui/button";

/**
 * @interface LoadMoreButtonProps
 * @description Propiedades para el componente LoadMoreButton.
 */
interface LoadMoreButtonProps {
    /** Función a ejecutar cuando se hace clic en el botón */
    onClick: () => void;
    /** Indica si la acción está actualmente cargando */
    loading: boolean;
}

/**
 * @component LoadMoreButton
 * @description Renderiza un botón con un spinner de carga y atributos de accesibilidad.
 *
 * @param {LoadMoreButtonProps} props - Las propiedades del componente.
 * @returns {JSX.Element} El botón de cargar más.
 */
const LoadMoreButton = memo(({ onClick, loading }: LoadMoreButtonProps) => {
    return (
        <Button
            onClick={onClick}
            disabled={loading}
            variant="secondary"
            size="lg"
            aria-label={loading ? "Cargando más items..." : "Cargar más items"}
        >
            {loading ? (
                <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-amber-600 border-t-transparent" />
                    <span>Cargando...</span>
                </>
            ) : (
                "Cargar más productos"
            )}
        </Button>
    );
});

LoadMoreButton.displayName = "LoadMoreButton";

export default LoadMoreButton;
