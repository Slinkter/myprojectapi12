
import { useState, useEffect, useCallback } from 'react';
import { getProducts as getProductsService } from '../services/products';

/**
 * @typedef {Object} Product
 * @property {number} id - The ID of the product.
 * @property {string} title - The title of the product.
 * @property {string} description - The description of the product.
 * @property {number} price - The price of the product.
 * @property {string} thumbnail - The URL of the product's thumbnail.
 * @property {number} stock - The available stock of the product.
 */

/**
 * @typedef {Object} UseProductsReturn
 * @property {Product[]} products - The list of products.
 * @property {boolean} loading - The loading state for subsequent loads.
 * @property {boolean} initialLoading - The loading state for the initial load.
 * @property {string|null} error - The error message.
 * @property {() => void} loadMore - The function to load more products.
 * @property {boolean} hasMore - Indicates if there are more products to load.
 */

/**
 * Custom hook to fetch and manage products from the API.
 * @returns {UseProductsReturn} The products, loading states, error state, and a function to load more.
 */
export const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const getProducts = useCallback(async () => {
        if (page === 0) {
            setInitialLoading(true);
        } else {
            setLoading(true);
        }
        setError(null);
        try {
            const data = await getProductsService(page);
            if (data.products.length === 0) {
                setHasMore(false);
            } else {
                try {
                    if (typeof window !== 'undefined' && window.localStorage) {
                        const stockData = JSON.parse(localStorage.getItem('stock')) || {};
                        const productsWithStock = data.products.map(product => {
                            if (stockData[product.id] === undefined) {
                                stockData[product.id] = 100;
                            }
                            return { ...product, stock: stockData[product.id] };
                        });
                        localStorage.setItem('stock', JSON.stringify(stockData));
                        setProducts(prevProducts => [...prevProducts, ...productsWithStock]);
                    } else {
                        setProducts(prevProducts => [...prevProducts, ...data.products]);
                    }
                } catch (e) {
                    console.error('Failed to access localStorage', e);
                    setProducts(prevProducts => [...prevProducts, ...data.products]);
                }
            }
        } catch (e) {
            setError(e.message);
        } finally {
            if (page === 0) {
                setInitialLoading(false);
            } else {
                setLoading(false);
            }
        }
    }, [page]);

    useEffect(() => {
        getProducts();
    }, [getProducts]);

    const loadMore = () => {
        if (hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    };

    return { products, initialLoading, loading, error, loadMore, hasMore };
};
