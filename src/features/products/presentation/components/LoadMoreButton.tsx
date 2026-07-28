import { memo } from "react";
import { useLogLifecycle } from "@/shared/hooks";
import { Button } from "@/shared/ui/Button";
import { Loader2 } from "lucide-react";

/**
 * @interface ILoadMoreButtonProps
 * @description Propiedades del componente LoadMoreButton.
 */
export interface ILoadMoreButtonProps {
    /** Callback ejecutado al hacer clic en el botón. */
    onClick: () => void;
    /** Indica si hay una carga en progreso (deshabilita el botón y muestra spinner). */
    isLoading: boolean;
}

/**
 * Botón "Cargar más productos" para paginación manual.
 *
 * @remarks
 * Componente memoizado con `React.memo`. Cuando `isLoading` es true,
 * se deshabilita y muestra un spinner `Loader2` animado junto al texto "Cargando...".
 * Incluye aria-label dinámico según el estado de carga.
 *
 * @component
 * @param props.onClick - Callback al presionar el botón.
 * @param props.isLoading - Estado de carga que deshabilita el botón.
 * @returns Elemento JSX con el botón de carga.
 */
const LoadMoreButton = memo(({ onClick, isLoading }: ILoadMoreButtonProps) => {
    useLogLifecycle("LoadMoreButton");
    return (
        <Button
            onClick={onClick}
            disabled={isLoading}
            variant="default"
            size="lg"
            className="mt-4"
            aria-label={isLoading ? "Cargando más items..." : "Cargar más items"}
        >
            {isLoading ? (
                <>
                    <Loader2 size={16} className="animate-spin mr-2" />
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
