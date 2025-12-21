const API_URL = "https://dummyjson.com/products";
const LIMIT = 20;

/**
 * Fetches a paginated list of products from the API.
 * @param {number} page - The page number to fetch, starting from 1.
 * @returns {Promise<Object>} An object containing the list of products and total count.
 * @throws {Error} If the network response is not ok.
 */
export const getProducts = async (page) => {
    const skip = (page - 1) * LIMIT;
    const url = `${API_URL}?limit=${LIMIT}&skip=${skip}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data; // Expected to be an object like { products: [], total: 100, ... }
};