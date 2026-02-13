/* eslint-disable react-refresh/only-export-components */
/**
 * @file ThemeContext.tsx
 * @description Context for application theme management (light/dark).
 * @architecture Application Layer - Theme Feature
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
 * Interface for the Theme Context value.
 */
interface ThemeContextType {
    /** The active theme identifier. */
    theme: Theme;
    /** Toggles between 'light' and 'dark' modes. */
    toggleTheme: () => void;
}

/**
 * Props for the ThemeProvider component.
 */
interface ThemeProviderProps {
    /** Child components to be wrapped by the provider. */
    children: ReactNode;
}

/**
 * React context for theme management.
 *
 * @remarks
 * We use Context for the theme because it is a global UI state that affects
 * almost every component in the app. Using a provider ensures that theme changes
 * trigger re-renders only where needed while keeping the state centralized.
 */
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Hook to consume the Theme Context.
 *
 * @remarks
 * Throws an error if the consumer is outside of a `ThemeProvider`, ensuring
 * type safety and correct architecture usage.
 */
export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};

/**
 * Provider component for Theme Context.
 *
 * @remarks
 * This component handles the synchronization between the React state,
 * the `localStorage` (for persistence), and the DOM (adding/removing the `.dark` class).
 *
 * By applying the theme to the document root, we allow Tailwind's `dark:`
 * variants to work across the entire application.
 *
 * @param props - Component properties.
 * @returns The provider element wrapping the children.
 */
export const ThemeProvider = ({ children }: ThemeProviderProps): JSX.Element => {
    const [theme, setTheme] = useState<Theme>(getStoredTheme);

    // Effect to apply changes to the DOM and persist in localStorage
    useEffect(() => {
        applyThemeToDocument(theme);
        saveTheme(theme);
    }, [theme]);

    /**
     * Toggles the theme state between 'light' and 'dark'.
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
