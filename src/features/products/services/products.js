
/**
 * Fetches products from the API.
 * @param {number} page - The page number to fetch.
 * @returns {Promise<Object>} The response from the API.
 */
export const getProducts = async (page) => {
    const response = await fetch(`https://dummyjson.com/products?limit=20&skip=${page * 20}`);
    const data = await response.json();
    return data;
};
