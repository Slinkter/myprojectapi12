/**
 * @file env.js
 * @description Archivo de configuración centralizado para variables de entorno y constantes de la aplicación.
 *   Proporciona una única fuente de verdad para varias configuraciones requeridas por la aplicación.
 * @architecture Sirve como una capa de configuración, abstrae los valores específicos del entorno y los hace
 *   fácilmente accesibles en toda la aplicación.
 * @sideeffects Lee las variables de entorno de `import.meta.env` en el momento de la carga del módulo.
 * @perf No se necesita una optimización específica en tiempo de ejecución, ya que proporciona un objeto de configuración estático.
 */

/**
 * @constant {object} config
 * @description Objeto de configuración global de la aplicación.
 *   Centraliza las variables de entorno y otras constantes de configuración,
 *   proporcionando acceso estructurado a configuraciones como las URLs base de la API.
 * @property {object} api - Configuración relacionada con la API.
 * @property {string} api.baseUrl - La URL base para las solicitudes de la API,
 *   utilizando "https://dummyjson.com" como valor predeterminado si `VITE_API_BASE_URL` no está definida.
 */
export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || "https://dummyjson.com",
  },
};
