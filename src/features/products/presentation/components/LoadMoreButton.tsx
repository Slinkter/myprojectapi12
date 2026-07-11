import { memo } from "react";
import { useLogLifecycle } from "@/shared/hooks";
import { Button } from "@/shared/ui/Button";
import { Loader2 } from "lucide-react";

interface ILoadMoreButtonProps {
    onClick: () => void;
    isLoading: boolean;
}

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
