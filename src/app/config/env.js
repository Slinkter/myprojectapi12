/**
 * @file env
 * @architecture Configuration layer - centralizes environment variables
 * @side-effects Reads from import.meta.env at module load time
 * @perf No optimization needed - static config object
 */

/**
 * Application configuration.
 * Centralizes environment variables and configuration constants.
 */
export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || "https://dummyjson.com",
  },
};
