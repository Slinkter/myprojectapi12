import { useState, useEffect, useCallback } from "react";
import { getProducts } from "../infrastructure/productsApi";

/**
 * Custom hook to manage fetching and paginating products.
 * @returns {{
 *  products: Array<Object>,
 *  error: string | null,
 *  loading: boolean,
 *  initialLoading: boolean,
 *  hasMore: boolean,
 *  loadMore: () => void
 * }}
 */
export const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getProducts(page);

                setProducts((prevProducts) => {
                    // Use a Set for efficient lookup of existing product IDs
                    const existingIds = new Set(prevProducts.map((p) => p.id));
                    const newProducts = data.products.filter(
                        (p) => !existingIds.has(p.id)
                    );
                    return [...prevProducts, ...newProducts];
                });

                // Determine if there are more products to load
                if (products.length + data.products.length >= data.total) {
                    setHasMore(false);
                }
            } catch (err) {
                setError(err.message || "An unexpected error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
        // The effect should run only when the page number changes.
    }, [page, products.length]);

    const loadMore = useCallback(() => {
        if (hasMore && !loading) {
            setPage((prevPage) => prevPage + 1);
        }
    }, [hasMore, loading]);

    return {
        products,
        error,
        loading,
        // Derived state: initialLoading is true only on the first page load.
        initialLoading: page === 1 && loading,
        hasMore,
        loadMore,
    };
};