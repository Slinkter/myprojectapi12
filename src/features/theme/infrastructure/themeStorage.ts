/**
 * @file themeStorage.ts
 * @description Servicio de infraestructura para la persistencia del tema.
 * Abstrae el acceso a localStorage y la detección de preferencias del sistema.
 * @architecture Capa de Infraestructura - Persistencia de Tema
 */

export type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "theme";

/**
 * Obtiene el tema almacenado o la preferencia del sistema.
 * @returns {Theme} El tema inicial ('light' o 'dark').
 */
export const getStoredTheme = (): Theme => {
    // 1. Intentar obtener de localStorage
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    if (storedTheme === "light" || storedTheme === "dark") {
        return storedTheme;
    }

    // 2. Verificar preferencia del sistema
    if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
        return "dark";
    }

    // 3. Fallback a light
    return "light";
};

/**
 * Guarda la preferencia de tema en localStorage.
 * @param {Theme} theme - El tema a guardar.
 */
export const saveTheme = (theme: Theme): void => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
};

/**
 * Aplica o remueve la clase 'dark' en el elemento root del documento.
 * @param {Theme} theme - El tema a aplicar.
 */
export const applyThemeToDocument = (theme: Theme): void => {
    const root = document.documentElement;
    if (theme === "dark") {
        root.classList.add("dark");
    } else {
        root.classList.remove("dark");
    }
};
