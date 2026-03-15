/**
 * @file LoadMoreButton.tsx
 * @description Componente de botón diseñado específicamente para activar acciones de "cargar más"
 * con visualización integrada del estado de carga.
 * @architecture Capa de Presentación - Componente de UI
 */

import { memo } from "react";
import { useLogLifecycle } from "@/shared/hooks";
import { Button } from "@/components/ui/button";

/**
 * @interface ILoadMoreButtonProps
 * @description Propiedades para el componente LoadMoreButton.
 */
interface ILoadMoreButtonProps {
    /** Función a ejecutar cuando se hace clic en el botón */
    onClick: () => void;
    /** Indica si la acción está actualmente cargando */
    isLoading: boolean;
}

/**
 * @component LoadMoreButton
 * @description Renderiza un botón con un spinner de carga y atributos de accesibilidad.
 *
 * @param {ILoadMoreButtonProps} props - Las propiedades del componente.
 * @returns {JSX.Element} El botón de cargar más.
 */
const LoadMoreButton = memo(({ onClick, isLoading }: ILoadMoreButtonProps) => {
    useLogLifecycle("LoadMoreButton");
    return (
        <Button
            onClick={onClick}
            disabled={isLoading}
            variant="default"
            size="lg"
            className="mt-6"
            aria-label={isLoading ? "Cargando más items..." : "Cargar más items"}
        >
            {isLoading ? (
                <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
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
