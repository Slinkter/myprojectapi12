
import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

/**
 * Configuración de estado inicial para el tema.
 * Verifica primero el localStorage, luego la preferencia del sistema, por defecto 'light'.
 *
 * @type {Object}
 * @property {Function} state - Función que devuelve el valor inicial del tema
 */const initState = {
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
 * Proporciona el valor del tema ('light' o 'dark') y la función de alternancia.
 * @type {Context<{theme: string, toggleTheme: Function}>}
 */
const ThemeContext = createContext();

/**
 * Componente proveedor de tema que gestiona el estado y la persistencia del tema.
 *
 * Características:
 * - Lee el tema inicial de localStorage o de la preferencia del sistema
 * - Aplica la clase 'dark' a document.documentElement cuando el modo oscuro está activo
 * - Persiste la preferencia de tema en localStorage
 * - Proporciona la función toggleTheme para alternar entre los modos claro/oscuro
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes hijos que tendrán acceso al contexto del tema
 * @returns {JSX.Element} Componente proveedor que envuelve a los hijos
 *
 * @example
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 */const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or system preference
  const [theme, setTheme] = useState(initState.state);

  /**
   * Efecto que aplica los cambios de tema al DOM y persiste en localStorage.
   * Se ejecuta cada vez que cambia el estado del tema.
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
   * Alterna entre el tema claro y oscuro.
   * Actualiza el estado lo que activa el useEffect para aplicar los cambios.
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
