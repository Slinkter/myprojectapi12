import { config } from "@/app/config/env";

const BASE_URL = config.api.baseUrl;

/**
 * A simple API client to handle fetch requests.
 *
 * @param {string} endpoint - The API endpoint to call.
 * @param {object} [options={}] - The options for the fetch request.
 * @returns {Promise<any>} The JSON response from the API.
 * @throws {Error} If the network response is not ok.
 */
export const apiClient = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};
