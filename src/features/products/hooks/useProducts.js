import { useState, useEffect, useCallback } from "react";

const API_URL = "https://dummyjson.com/products";
const LIMIT = 20;

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchProducts = useCallback(async () => {
    console.group(`fetchProducts - Página: ${page}`);
    setLoading(true);
    setError(null);
    try {
      const skip = (page - 1) * LIMIT;
      console.log(
        `Obteniendo datos de: ${API_URL}?limit=${LIMIT}&skip=${skip}`
      );
      const response = await fetch(`${API_URL}?limit=${LIMIT}&skip=${skip}`);
      const data = await response.json();
      console.log("Respuesta de la API:", data);

      if (
        data.products.length === 0 ||
        products.length + data.products.length >= data.total
      ) {
        console.log(
          "No hay más productos para cargar, estableciendo hasMore a false."
        );
        setHasMore(false);
      }

      setProducts((prevProducts) => {
        console.group("Actualizando estado de productos");
        console.log("Cantidad de productos anterior:", prevProducts.length);
        const existingIds = new Set(prevProducts.map((p) => p.id));
        const newProducts = data.products.filter((p) => !existingIds.has(p.id));
        console.log("Nuevos productos para agregar:", newProducts.length);
        const updatedProducts = [...prevProducts, ...newProducts];
        console.log(
          "Cantidad de productos actualizada:",
          updatedProducts.length
        );
        console.groupEnd();
        return updatedProducts;
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      if (initialLoading) setInitialLoading(false);
    }
    console.groupEnd();
  }, [page, initialLoading, products.length]);

  useEffect(() => {
    fetchProducts();
  }, [page, fetchProducts]);

  const loadMore = () => {
    if (hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return { products, initialLoading, loading, error, loadMore, hasMore };
};
