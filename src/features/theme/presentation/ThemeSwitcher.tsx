/**
 * @file ThemeSwitcher.tsx
 * @description Botón para alternar el tema de la aplicación.
 * Muestra icono de Sol o Luna según el estado actual con animación de transición.
 * @architecture Capa de Presentación - Feature de Tema
 */

import { useTheme } from "@/features/theme/application/ThemeContext";
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi2";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/Button";
import { useLogLifecycle } from "@/shared/hooks";

/**
 * Componente de botón toggle para el tema.
 * Incluye animación de transición entre sol y luna.
 *
 * @component
 */
const ThemeSwitcher = () => {
    useLogLifecycle("ThemeSwitcher");
    const { theme, toggleDarkMode } = useTheme();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className={cn(
                "relative w-11 h-11 rounded-full transition-all duration-200 overflow-hidden",
                "hover:bg-accent active:scale-95",
                "text-muted-foreground hover:text-primary"
            )}
            aria-label={`Cambiar a modo ${theme === "light" ? "oscuro" : "claro"}`}
        >
            {/* Sun Icon */}
            <span
                className={cn(
                    "absolute inset-0 flex items-center justify-center transition-all duration-300",
                    theme === "light" 
                        ? "opacity-100 rotate-0 scale-100" 
                        : "opacity-0 rotate-90 scale-50"
                )}
            >
                <HiOutlineMoon className="h-6 w-6" />
            </span>
            
            {/* Moon Icon */}
            <span
                className={cn(
                    "absolute inset-0 flex items-center justify-center transition-all duration-300",
                    theme === "dark" 
                        ? "opacity-100 rotate-0 scale-100" 
                        : "opacity-0 -rotate-90 scale-50"
                )}
            >
                <HiOutlineSun className="h-6 w-6" />
            </span>
        </Button>
    );
};

export default ThemeSwitcher;

