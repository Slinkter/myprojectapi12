/**
 * @file ThemeSwitcher.tsx
 * @description Botón para alternar el tema de la aplicación.
 * Muestra icono de Sol o Luna según el estado actual.
 * @architecture Capa de Presentación - Feature de Tema
 */
import { useTheme } from "@/features/theme/application/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * Componente de botón toggle para el tema.
 *
 * @component
 */
const ThemeSwitcher = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className={cn(
                "relative w-10 h-10 rounded-full transition-all duration-200",
                "hover:bg-(--bg-input) active:scale-95",
                "text-(--text-primary) hover:text-(--text-accent)"
            )}
            aria-label={`Cambiar a modo ${theme === "light" ? "oscuro" : "claro"}`}
        >
            {theme === "light" ? (
                <Moon className={cn("h-5 w-5 sm:h-6 sm:w-6")} strokeWidth={2} />
            ) : (
                <Sun className={cn("h-5 w-5 sm:h-6 sm:w-6")} strokeWidth={2} />
            )}
        </Button>
    );
};

export default ThemeSwitcher;
