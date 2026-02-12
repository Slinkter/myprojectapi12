/**
 * @file ThemeSwitcher.tsx
 * @description Botón para alternar el tema de la aplicación.
 * Muestra icono de Sol o Luna según el estado actual.
 * @architecture Presentation Layer - Theme Feature
 */
import { useTheme } from "@/features/theme/application/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

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
            className={cn(
                "p-2 rounded-full transition-all duration-200",
                "hover:bg-(--bg-input) active:scale-95",
                "text-(--text-primary) hover:text-(--text-accent)"
            )}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
            {theme === "light" ? (
                <Moon className={cn("h-5 w-5")} strokeWidth={2.5} />
            ) : (
                <Sun className={cn("h-5 w-5")} strokeWidth={2.5} />
            )}
        </button>
    );
};

export default ThemeSwitcher;
