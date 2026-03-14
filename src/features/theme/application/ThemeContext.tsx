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
} from "@/features/theme/infrastructure/themeStorage";

interface IThemeContextType {
    theme: Theme; /** El identificador del tema activo. */
    toggleTheme: () => void; /** Alterna entre los modos 'light' (claro) y 'dark' (oscuro). */
}
interface IThemeProviderProps {
    children: ReactNode; /** Componentes hijos que serán envueltos por el proveedor. */
}

const ThemeContext = createContext<IThemeContextType | undefined>(undefined);

export const ThemeProvider = ({
    children,
}: IThemeProviderProps): JSX.Element => {
    const [theme, setTheme] = useState<Theme>(getStoredTheme);

    // Efecto para aplicar cambios al DOM y persistir en localStorage
    useEffect(() => {
        applyThemeToDocument(theme);
        saveTheme(theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

/**
 * Hook para consumir el Contexto de Tema.
 */
export const useTheme = (): IThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme debe usarse dentro de un ThemeProvider");
    }
    return context;
};

export { ThemeContext };
