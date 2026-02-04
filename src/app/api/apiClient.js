/**
 * @file apiClient.js
 * @description Core HTTP client for making requests to the configured API base URL.
 *   This utility centralizes fetch requests, applying default headers and error handling.
 * @architecture Functions as the foundational layer for all API interactions within the application's
 *   infrastructure, ensuring consistent communication with external services.
 * @sideeffects Initiates network requests to the external API (e.g., DummyJSON) as defined by the
 *   `VITE_API_BASE_URL` environment variable.
 * @perf Designed as a stateless utility function; memoization is not applicable as its primary
 *   role is to perform distinct network operations.
 */
import { config } from "@/app/config/env";

const BASE_URL = config.api.baseUrl;

/**
 * @function apiClient
 * @description A generic asynchronous function to handle fetch requests to the API.
 *   It constructs the full URL, applies default JSON headers, and handles network response status.
 * @param {string} endpoint - The specific API endpoint path (e.g., "/products", "/users").
 * @param {object} [options={}] - Optional configuration object for the `fetch` request.
 * @param {object} [options.headers={}] - Custom headers to be merged with default "Content-Type: application/json".
 * @returns {Promise<object>} A promise that resolves to the JSON response data from the API.
 * @throws {Error} Throws an `Error` if the network response status is not `ok` (i.e., `response.ok` is false).
 */
export const apiClient = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;

  const requestConfig = { // Renamed 'config' to 'requestConfig' to avoid conflict with imported 'config'
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  const response = await fetch(url, requestConfig);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};
