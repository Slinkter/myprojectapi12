import { apiClient } from "@/app/api/apiClient";

const LIMIT = 20;

/**
 * Fetches a paginated list of products from the API.
 * @param {number} page - The page number to fetch, starting from 1.
 * @returns {Promise<Object>} An object containing the list of products and total count.
 */
export const getProducts = async (page) => {
    const skip = (page - 1) * LIMIT;
    const endpoint = `/products?limit=${LIMIT}&skip=${skip}`;
    return apiClient(endpoint);
};