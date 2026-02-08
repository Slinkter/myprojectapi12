/**
 * @file ThemeContext.tsx
 * @description Contexto para el manejo del tema (claro/oscuro) de la aplicación.
 * Persiste la preferencia en localStorage y detecta preferencia del sistema.
 * @architecture Application Layer - Theme Feature
 */
import {
    createContext,
    useState,
    useEffect,
    ReactNode,
    useContext,
} from "react";

type Theme = "light" | "dark";

/**
 * @interface ThemeContextType
 * @property {Theme} theme - El tema actual ('light' | 'dark')
 * @property {function} toggleTheme - Función para alternar entre temas
 */
interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

/**
 * Obtiene el tema inicial.
 * Prioridad: 1. localStorage, 2. Preferencia del sistema, 3. 'light'
 * @returns {Theme} El tema inicial
 */
const getInitialTheme = (): Theme => {
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    if (storedTheme) {
        return storedTheme;
    }

    if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
        return "dark";
    }
    return "light";
};

// Valor predeterminado para el contexto. Usamos 'undefined' inicialmente,
// y el proveedor garantizará que el valor real nunca sea 'undefined'
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Hook personalizado para consumir el ThemeContext
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};

interface ThemeProviderProps {
    children: ReactNode;
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const [theme, setTheme] = useState<Theme>(getInitialTheme);

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export { ThemeContext, ThemeProvider };
