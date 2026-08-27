/**
 * @file ThemeToggle.tsx
 * @description Botón de cambio de tema claro/oscuro con animación de icono.
 * @architecture Widget Layer - Theme Toggle
 */

import { m, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { IconButton } from "@/shared/ui/IconButton";
import { useTheme } from "@/features/theme/application/ThemeContext";

/**
 * @component ThemeToggle
 * @description Alterna el tema de la aplicación y anima la transición
 * entre los iconos de sol y luna.
 *
 * @returns {JSX.Element} Botón de cambio de tema.
 */
const ThemeToggle = () => {
    const { theme, toggleDarkMode } = useTheme();

    return (
        <IconButton
            onClick={toggleDarkMode}
            label={theme === "dark" ? "Activar modo claro" : "Activar modo oscuro"}
        >
            <AnimatePresence mode="wait">
                {theme === "dark" ? (
                    <m.span
                        key="sun"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Sun size="20" className="text-amber-500" />
                    </m.span>
                ) : (
                    <m.span
                        key="moon"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Moon size="20" />
                    </m.span>
                )}
            </AnimatePresence>
        </IconButton>
    );
};

export default ThemeToggle;