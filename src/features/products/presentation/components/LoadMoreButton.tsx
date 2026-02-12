/**
 * @file LoadMoreButton.tsx
 * @description Button component specifically designed for triggering "load more" actions
 * with built-in loading state visualization.
 * @architecture Presentation Layer - UI Component
 */

import { memo } from "react";
import { cn } from "@/lib/utils";

/**
 * @interface LoadMoreButtonProps
 * @description Props for the LoadMoreButton component.
 */
interface LoadMoreButtonProps {
    /** Function to execute when the button is clicked */
    onClick: () => void;
    /** Whether the action is currently loading */
    loading: boolean;
    /** Optional custom class name */
    className?: string;
}

/**
 * @component LoadMoreButton
 * @description Renders a button with loading spinner and accessibility attributes.
 * 
 * @param {LoadMoreButtonProps} props - The component props.
 * @returns {JSX.Element} The load more button.
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
            aria-label={loading ? "Loading more items..." : "Load more items"}
        >
            {loading ? (
                <>
                    <div className={cn("animate-spin rounded-full h-5 w-5 border-b-2 border-white")} />
                    <span>Loading...</span>
                </>
            ) : (
                "Load More"
            )}
        </button>
    );
});

LoadMoreButton.displayName = "LoadMoreButton";

export default LoadMoreButton;
