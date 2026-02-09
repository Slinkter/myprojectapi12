/**
 * @file ThemeSwitcher.tsx
 * @description Botón para alternar el tema de la aplicación.
 * Muestra icono de Sol o Luna según el estado actual.
 * @architecture Presentation Layer - Theme Feature
 */
import { useTheme } from "@/features/theme/application/ThemeContext";
import { Sun, Moon } from "lucide-react";
import clsx from 'clsx';

/**
 * Componente de botón toggle para el tema.
 *
 * @component
 */
const ThemeSwitcher = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={clsx("p-1.5 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center")}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
            {theme === "light" ? (
                <Moon className={clsx("h-4 w-4 sm:h-5 sm:w-5 text-gray-700 dark:text-gray-300")} />
            ) : (
                <Sun className={clsx("h-4 w-4 sm:h-5 sm:w-5 text-gray-700 dark:text-gray-300")} />
            )}
        </button>
    );
};

export default ThemeSwitcher;
