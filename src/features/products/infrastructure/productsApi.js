/**
 * @file productsApi
 * @architecture Capa de infraestructura - llamadas a la API para productos
 * @side-effects Solicitudes de red a la API de DummyJSON
 * @perf Paginación con 20 elementos por página para reducir el tamaño de la carga útil
 */
import { apiClient } from "@/app/api/apiClient";

const LIMIT = 20;

/**
 * Obtiene una lista paginada de productos de la API.
 * @param {number} page - El número de página a obtener, comenzando desde 1.
 * @returns {Promise<Object>} Un objeto que contiene la lista de productos y el recuento total.
 */
export const getProducts = async (page) => {
    const skip = (page - 1) * LIMIT;
    const endpoint = `/products?limit=${LIMIT}&skip=${skip}`;
    return apiClient(endpoint);
};