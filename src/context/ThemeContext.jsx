import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const initState = {
    state: () => {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme) {
            return storedTheme;
        }
        // Verificar preferencia del sistema:
        // Si el navegador soporta matchMedia Y el sistema operativo está en modo oscuro.
        if (
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
        ) {
            return "dark";
        }
        return "light"; //  Valor por defecto si no hay nada guardado ni preferencia del sistema.
    },
};

// 1. Crear el Contexto
const ThemeContext = createContext();
// 2. Crear el Componente Proveedor (Provider)
const ThemeProvider = ({ children }) => {
    // 3. Pregunta el theme en localstorage,ejecuta initState.state
    const [theme, setTheme] = useState(initState.state);
    // 4. Usar useEffect para aplicar cambios cuando el tema se actualiza.
    useEffect(() => {
        // Este efecto se ejecuta cada vez que el valor de 'theme' cambia.
        if (theme === "dark") {
            // Si el tema es oscuro, añade la clase 'dark' al elemento <html>.
            document.documentElement.classList.add("dark");
        } else {
            // Si no, remueve la clase 'dark'.
            document.documentElement.classList.remove("dark");
        }
        // Guarda la preferencia actual del tema en el almacenamiento local para futuras visitas.
        localStorage.setItem("theme", theme);
    }, [theme]);

    // 5. Crear una función para cambiar el tema.
    // Actualiza el estado del tema al valor opuesto del actual.
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    // 6. Proveer el estado del tema y la función para cambiarlo a los componentes hijos.
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export { ThemeContext, ThemeProvider };

// Define los tipos de las props para el componente ThemeProvider.
ThemeProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
