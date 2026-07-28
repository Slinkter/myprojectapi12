/** Configuración global de la aplicación obtenida de variables de entorno. @remarks Usa `import.meta.env.VITE_API_URL` o la URL por defecto de DummyJSON. */
export const config = {
    api: {
        baseUrl: import.meta.env.VITE_API_URL || "https://dummyjson.com",
    },
} as const;
