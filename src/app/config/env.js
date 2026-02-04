/**
 * @file env.js
 * @description Centralized configuration file for environment variables and application constants.
 *   It provides a single source of truth for various settings required by the application.
 * @architecture Serves as a configuration layer, abstracting environment-specific values and making them
 *   easily accessible throughout the application.
 * @sideeffects Reads environment variables from `import.meta.env` at module load time.
 * @perf No specific runtime optimization is needed as it provides a static configuration object.
 */

/**
 * @constant {object} config
 * @description Global application configuration object.
 *   It centralizes environment variables and other configuration constants,
 *   providing structured access to settings like API base URLs.
 * @property {object} api - API related configuration.
 * @property {string} api.baseUrl - The base URL for API requests,
 *   falling back to "https://dummyjson.com" if `VITE_API_BASE_URL` is not defined.
 */
export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || "https://dummyjson.com",
  },
};
