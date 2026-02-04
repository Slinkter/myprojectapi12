import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

/**
 * Initial state configuration for theme.
 * Checks localStorage first, then system preference, defaults to 'light'.
 * 
 * @type {Object}
 * @property {Function} state - Function that returns the initial theme value
 */
const initState = {
  state: () => {
    const storedTheme = localStorage.getItem("theme");
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
  },
};

/**
 * Theme context for managing application-wide theme state.
 * Provides theme value ('light' or 'dark') and toggle function.
 * 
 * @type {React.Context<{theme: string, toggleTheme: Function}>}
 */
const ThemeContext = createContext();

/**
 * Theme provider component that manages theme state and persistence.
 * 
 * Features:
 * - Reads initial theme from localStorage or system preference
 * - Applies 'dark' class to document.documentElement when dark mode is active
 * - Persists theme preference to localStorage
 * - Provides toggleTheme function to switch between light/dark modes
 * 
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components that will have access to theme context
 * @returns {JSX.Element} Provider component wrapping children
 * 
 * @example
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 */
const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or system preference
  const [theme, setTheme] = useState(initState.state);

  /**
   * Effect that applies theme changes to the DOM and persists to localStorage.
   * Runs whenever the theme state changes.
   */
  useEffect(() => {
    if (theme === "dark") {
      // Add 'dark' class to <html> element for dark mode
      document.documentElement.classList.add("dark");
    } else {
      // Remove 'dark' class for light mode
      document.documentElement.classList.remove("dark");
    }
    // Persist theme preference for future visits
    localStorage.setItem("theme", theme);
  }, [theme]);

  /**
   * Toggles between light and dark theme.
   * Updates state which triggers useEffect to apply changes.
   */
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

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
