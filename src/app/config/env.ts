/**
 * @file env.ts
 * @description Archivo de configuración centralizado para variables de entorno.
 * Proporciona acceso tipado a las variables de entorno de Vite.
 * @architecture Infrastructure Layer - Configuration
 */

/**
 * Objeto de configuración global de la aplicación.
 * Centraliza las variables de entorno y otras constantes de configuración,
 * proporcionando acceso estructurado a configuraciones como las URLs base de la API.
 */
export const config = {
    api: {
        baseUrl: import.meta.env.VITE_API_BASE_URL || "https://dummyjson.com",
    },
};
