import { useState, useEffect, useCallback } from "react";

const API_URL = "https://dummyjson.com/products";
const LIMIT = 20;

export const useProducts = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [products, setProducts] = useState([]);
    /*  */
    const [initialLoading, setInitialLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    /*  */
    const fetchProducts = useCallback(async () => {
        console.group(`fetchProducts - Página: ${page}`);
        setLoading(true);
        setError(null);
        try {
            const skip = (page - 1) * LIMIT;
            const url = `${API_URL}?limit=${LIMIT}&skip=${skip}`;
            const response = await fetch(url);
            const data = await response.json();
            console.log("url:", url);
            console.log("response:", response);
            console.log("data:", data);
            if (
                data.products.length === 0 ||
                products.length + data.products.length >= data.total
            ) {
                setHasMore(false);
            }

            setProducts((prevProducts) => {
                console.group("Actualizando estado de productos");
                console.log("Cantidad anterior:", prevProducts.length);
                const existingIds = new Set(prevProducts.map((p) => p.id));
                const newProducts = data.products.filter(
                    (p) => !existingIds.has(p.id)
                );
                console.log("Nuevos productos ", newProducts.length);
                const updatedProducts = [...prevProducts, ...newProducts];
                console.log("Cantidad actualizada:", updatedProducts.length);
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

/* 
El hook `useProducts` gestiona la obtención de productos de una API, con paginación y carga bajo demanda.

Así es como funciona la obtención de datos:

1.  **Carga Inicial (al montar el componente):**
    *   Cuando el componente que usa `useProducts` se monta por primera vez, `page` se inicializa en `1`.
    *   El `useEffect` al final del hook tiene `page` y `fetchProducts` como dependencias. Como `page` tiene su valor inicial (`1`), `fetchProducts` se ejecuta automáticamente.
    *   `fetchProducts` realiza la primera llamada a la API (`https://dummyjson.com/products?limit=20&skip=0`) para obtener los primeros 20 productos.
    *   Durante esta fase, `initialLoading` es `true` y `loading` se establece en `true`. Una vez que los datos se han cargado (o hay un error), `loading` vuelve a `false` y `initialLoading` también se establece en `false`.

2.  **Carga de Más Productos (al hacer "click" o llamar a `loadMore`):**
    *   La función `loadMore` se encarga de solicitar la siguiente página de productos.
    *   Cuando `loadMore` es invocada (por ejemplo, por un botón "Cargar más" o al hacer scroll), primero verifica dos condiciones:
        *   `hasMore`: Asegura que todavía hay más productos disponibles en la API para cargar.
        *   `!loading`: Evita hacer múltiples solicitudes mientras una ya está en progreso.
    *   Si ambas condiciones son verdaderas, `setPage((prevPage) => prevPage + 1)` se ejecuta, incrementando el valor de `page`.
    *   Dado que `page` es una dependencia del `useEffect` (y del `useCallback` de `fetchProducts`), cambiar su valor provoca que `fetchProducts` se ejecute de nuevo.
    *   `fetchProducts` calcula un nuevo `skip` basado en el nuevo `page` (por ejemplo, si `page` es `2`, `skip` será `20`), y realiza una nueva llamada a la API para obtener el siguiente lote de productos.
    *   Los nuevos productos se añaden a la lista existente de `products` usando `setProducts((prevProducts) => [...prevProducts, ...newProducts])`.
    *   `loading` se establece en `true` durante la llamada y vuelve a `false` cuando termina.
    *   Si la respuesta de la API indica que no hay más productos o que ya se han cargado todos (`data.products.length === 0` o `products.length + data.products.length >= data.total`), `setHasMore(false)` se establece para deshabilitar futuras llamadas a `loadMore`.





*/
