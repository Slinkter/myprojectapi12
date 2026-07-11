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
    useMemo,
    ReactNode,
} from "react";
import {
    getStoredTheme,
    saveTheme,
    applyThemeToDocument,
    Theme,
} from "@/features/theme/infrastructure/themeStorage";
import { useLogLifecycle } from "@/shared/hooks";

interface IThemeContextType {
    theme: Theme; /** El identificador del tema activo. */
    toggleDarkMode: () => void; /** Alterna entre los modos 'light' (claro) y 'dark' (oscuro). */
}
interface IThemeProviderProps {
    children: ReactNode; /** Componentes hijos que serán envueltos por el proveedor. */
}

const ThemeContext = createContext<IThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: IThemeProviderProps): ReactNode => {
    useLogLifecycle("ThemeContext");
    const [theme, setTheme] = useState<Theme>(getStoredTheme);

    // Efecto para aplicar cambios al DOM y persistir en localStorage
    useEffect(() => {
        applyThemeToDocument(theme);
        saveTheme(theme);
    }, [theme]);

    /**
     * Switches the theme between light mode and dark mode.
     * When called, it changes the current theme to the opposite one.
     * For example: if currently in light mode, it switches to dark mode.
     */
    const toggleDarkMode = useCallback(() => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    }, []);

    const value = useMemo(
        () => ({ theme, toggleDarkMode }),
        [theme, toggleDarkMode],
    );

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
};

/**
 * Custom hook to access the theme context.
 * This hook lets you read the current theme and switch between light/dark modes
 * from any component inside the ThemeProvider.
 *
 * @returns An object containing:
 *   - theme: The current theme value ('light' or 'dark')
 *   - toggleDarkMode: A function to switch between light and dark mode
 *
 * @throws Will throw an error if used outside of a ThemeProvider
 *
 * @example
 * const { theme, toggleDarkMode } = useTheme();
 *
 * // To check current theme
 * console.log(theme); // 'light' or 'dark'
 *
 * // To switch themes
 * toggleDarkMode();
 */
export const useTheme = (): IThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme debe usarse dentro de un ThemeProvider");
    }
    return context;
};

export { ThemeContext };
