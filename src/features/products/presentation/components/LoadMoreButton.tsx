import { memo } from "react";
import { useLogLifecycle } from "@/shared/hooks";
import { Button } from "@/shared/ui/Button";
import { Spinner } from "@radix-ui/themes";

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
            style={{ marginTop: "var(--space-4)" }}
            aria-label={isLoading ? "Cargando más items..." : "Cargar más items"}
        >
            {isLoading ? (
                <>
                    <Spinner size="1" />
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
