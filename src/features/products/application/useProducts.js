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
    let didCancel = false;

    const fetchProducts = async () => {
      if (!hasMore && page > 1) return; // Don't fetch if no more, unless it's initial load where hasMore starts true

      setLoading(true);
      setError(null);
      try {
        const data = await getProducts(page);

        if (!didCancel) {
          setProducts((prevProducts) => {
            const existingIds = new Set(prevProducts.map((p) => p.id));
            const newProducts = data.products.filter(
              (p) => !existingIds.has(p.id)
            );

            const allProducts = [...prevProducts, ...newProducts];

            if (allProducts.length >= data.total) {
              setHasMore(false);
            }

            return allProducts;
          });
        }
      } catch (err) {
        if (!didCancel) {
          setError(err.message || "An unexpected error occurred");
        }
      } finally {
        if (!didCancel) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      didCancel = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [hasMore, loading]);

  return {
    products,
    error,
    loading,
    initialLoading: page === 1 && loading,
    hasMore,
    loadMore,
  };
};
