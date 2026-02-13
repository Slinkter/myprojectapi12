/**
 * @file env.ts
 * @description Archivo de configuración centralizado para variables de entorno.
 * Proporciona acceso tipado a las variables de entorno de Vite.
 * @architecture Capa de Infraestructura - Configuración
 */

/**
 * Objeto de configuración global de la aplicación.
 *
 * @remarks
 * Este objeto centraliza todas las variables dependientes del entorno y las constantes estáticas.
 * El uso de un objeto de configuración centralizado en lugar de llamadas directas a `import.meta.env`
 * en toda la aplicación proporciona:
 * 1. Seguridad de tipos para la configuración.
 * 2. Facilidad para realizar mocks durante las pruebas.
 * 3. Un único punto de cambio para las actualizaciones de infraestructura.
 */
export const config = {
    /**
     * Configuraciones relacionadas con la API.
     */
    api: {
        /**
         * La URL base para la API de DummyJSON.
         *
         * @remarks
         * Utilizamos DummyJSON ya que proporciona un conjunto estable y completo de
         * datos de prueba para comercio electrónico (productos, usuarios, carritos).
         * Por defecto utiliza la URL de producción si la variable de entorno no está establecida.
         */
        baseUrl: import.meta.env.VITE_API_BASE_URL || "https://dummyjson.com",
    },
} as const;
