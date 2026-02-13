/* eslint-disable react-refresh/only-export-components */
/**
 * @file ThemeContext.tsx
 * @description Contexto para la gestión del tema de la aplicación (claro/oscuro).
 * @architecture Capa de Aplicación - Feature de Tema
 */
import {
    createContext,
    useState,
    useEffect,
    useCallback,
    useContext,
    ReactNode,
} from "react";
import {
    getStoredTheme,
    saveTheme,
    applyThemeToDocument,
    Theme,
} from "../infrastructure/themeStorage";

/**
 * Interfaz para el valor del Contexto de Tema.
 */
interface ThemeContextType {
    /** El identificador del tema activo. */
    theme: Theme;
    /** Alterna entre los modos 'light' (claro) y 'dark' (oscuro). */
    toggleTheme: () => void;
}

/**
 * Propiedades para el componente ThemeProvider.
 */
interface ThemeProviderProps {
    /** Componentes hijos que serán envueltos por el proveedor. */
    children: ReactNode;
}

/**
 * Contexto de React para la gestión del tema.
 *
 * @remarks
 * Utilizamos Context para el tema porque es un estado global de la UI que afecta
 * a casi todos los componentes de la aplicación. El uso de un proveedor asegura que los cambios
 * de tema disparen re-renderizados solo donde sea necesario mientras se mantiene el estado centralizado.
 */
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Hook para consumir el Contexto de Tema.
 *
 * @remarks
 * Lanza un error si el consumidor está fuera de un `ThemeProvider`, asegurando
 * la seguridad de tipos y el uso correcto de la arquitectura.
 */
export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme debe usarse dentro de un ThemeProvider");
    }
    return context;
};

/**
 * Componente Proveedor para el Contexto de Tema.
 *
 * @remarks
 * Este componente maneja la sincronización entre el estado de React,
 * el `localStorage` (para persistencia) y el DOM (añadiendo/eliminando la clase `.dark`).
 *
 * Al aplicar el tema a la raíz del documento, permitimos que las variantes `dark:`
 * de Tailwind funcionen en toda la aplicación.
 *
 * @param props - Propiedades del componente.
 * @returns El elemento proveedor que envuelve a los hijos.
 */
export const ThemeProvider = ({ children }: ThemeProviderProps): JSX.Element => {
    const [theme, setTheme] = useState<Theme>(getStoredTheme);

    // Efecto para aplicar cambios al DOM y persistir en localStorage
    useEffect(() => {
        applyThemeToDocument(theme);
        saveTheme(theme);
    }, [theme]);

    /**
     * Alterna el estado del tema entre 'light' y 'dark'.
     */
    const toggleTheme = useCallback(() => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export { ThemeContext };
