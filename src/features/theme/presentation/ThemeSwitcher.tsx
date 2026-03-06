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
                "relative w-11 h-11 rounded-full transition-all duration-200",
                "hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95",
                "text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400"
            )}
            aria-label={`Cambiar a modo ${theme === "light" ? "oscuro" : "claro"}`}
        >
            {theme === "light" ? (
                <Moon className={cn("h-5 w-5")} strokeWidth={2} />
            ) : (
                <Sun className={cn("h-5 w-5")} strokeWidth={2} />
            )}
        </Button>
    );
};

export default ThemeSwitcher;
