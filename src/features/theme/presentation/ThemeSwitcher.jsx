/**
 * @file ThemeSwitcher
 * @architecture Capa de presentación - botón para alternar el tema
 * @side-effects Activa el cambio de tema a través del contexto (localStorage + DOM)
 * @perf No se necesita optimización - componente de botón simple
 */
import { useContext } from "react";
import { ThemeContext } from "@/features/theme/application/ThemeContext";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi2";

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <HiOutlineMoon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 dark:text-gray-300" />
      ) : (
        <HiOutlineSun className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 dark:text-gray-300" />
      )}
    </button>
  );
};

export default ThemeSwitcher;
