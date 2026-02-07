import { Product } from "../application/types";
import ProductGrid from "./ProductGrid";
import ErrorMessage from "@/components/common/ErrorMessage";

interface ProductListProps {
    products: Product[];
    loading: boolean;
    error: string | null;
    hasMore: boolean;
    loadMore: () => void;
}

const ProductList = ({
    products,
    loading,
    error,
    hasMore,
    loadMore
}: ProductListProps) => {
    if (error) {
        return (
            <ErrorMessage
                message={error}
                title="Failed to load products"
                action={{
                    label: "Try again",
                    onClick: loadMore
                }}
            />
        );
    }

    if (products.length === 0) {
        return <p className="page-home__info-message">No products found.</p>;
    }

    return (
        <>
            <ProductGrid products={products} />

            <div className="page-home__pagination">
                {hasMore && (
                    <button
                        onClick={loadMore}
                        disabled={loading}
                        className="page-home__load-more-button flex items-center justify-center gap-2"
                        aria-label="Load more products"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                                <span>Loading...</span>
                            </>
                        ) : (
                            "Load More"
                        )}
                    </button>
                )}

                {!hasMore && (
                    <p className="page-home__info-message">
                        You have reached the end of the list.
                    </p>
                )}
            </div>
        </>
    );
};

export default ProductList;
