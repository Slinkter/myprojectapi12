/* eslint-disable react-refresh/only-export-components */
/**
 * @file ThemeContext.tsx
 * @description Contexto para el manejo del tema (claro/oscuro) de la aplicación.
 * Gestiona el estado y la persistencia del tema mediante servicios de infraestructura.
 * @architecture Application Layer - Theme Feature
 */
import {
    createContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
    useContext,
} from "react";
import {
    getStoredTheme,
    saveTheme,
    applyThemeToDocument,
    Theme,
} from "../infrastructure/themeStorage";

/**
 * @interface ThemeContextType
 * @description Interfaz del contexto del tema.
 * @property {Theme} theme - El tema actual ('light' | 'dark')
 * @property {Function} toggleTheme - Función para alternar entre temas
 */
interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

/**
 * @constant ThemeContext
 * @description Contexto de React para el estado del tema.
 * Inicializado como undefined para detectar uso fuera del proveedor.
 */
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * @function useTheme
 * @description Hook personalizado para consumir el contexto del tema.
 * @architecture Application Layer - Custom Hook
 * 
 * @returns {ThemeContextType} Objeto con el tema y la función toggle.
 * @throws {Error} Si se usa fuera de un ThemeProvider.
 */
export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};

/**
 * @interface ThemeProviderProps
 * @property {ReactNode} children - Componentes hijos envueltos.
 */
interface ThemeProviderProps {
    children: ReactNode;
}

/**
 * @component ThemeProvider
 * @description Proveedor del contexto del tema.
 * Gestiona el estado local del tema y sincroniza cambios con el almacenamiento y el DOM.
 * 
 * @param {ThemeProviderProps} props - Props del componente.
 * @returns {JSX.Element} El proveedor del contexto.
 */
export const ThemeProvider = ({ children }: ThemeProviderProps): JSX.Element => {
    const [theme, setTheme] = useState<Theme>(getStoredTheme);

    // Efecto para aplicar cambios al DOM y guardar en localStorage
    useEffect(() => {
        applyThemeToDocument(theme);
        saveTheme(theme);
    }, [theme]);

    /**
     * @function toggleTheme
     * @description Alterna el estado del tema entre 'light' y 'dark'.
     * Memoizado con useCallback.
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
