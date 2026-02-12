/**
 * @file env.ts
 * @description Archivo de configuración centralizado para variables de entorno.
 * Proporciona acceso tipado a las variables de entorno de Vite.
 * @architecture Infrastructure Layer - Configuration
 */

/**
 * Global application configuration object.
 *
 * @remarks
 * This object centralizes all environment-dependent variables and static constants.
 * Using a centralized config object instead of direct `import.meta.env` calls
 * throughout the app provides:
 * 1. Type safety for configuration.
 * 2. Easier mocking during tests.
 * 3. A single point of change for infrastructure updates.
 */
export const config = {
    /**
     * API related configurations.
     */
    api: {
        /**
         * The base URL for the DummyJSON API.
         *
         * @remarks
         * We use DummyJSON as it provides a stable and comprehensive set of
         * mock data for e-commerce (products, users, carts).
         * Defaults to the production URL if the environment variable is not set.
         */
        baseUrl: import.meta.env.VITE_API_BASE_URL || "https://dummyjson.com",
    },
} as const;
