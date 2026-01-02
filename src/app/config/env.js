/**
 * Application configuration.
 * Centralizes environment variables and configuration constants.
 */
export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || "https://dummyjson.com",
  },
};
