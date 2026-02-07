// src/features/theme/presentation/ThemeSwitcher.tsx
import { useTheme } from "@/features/theme/application/ThemeContext";
import { Sun, Moon } from "lucide-react";

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 dark:text-gray-300" />
      ) : (
        <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 dark:text-gray-300" />
      )}
    </button>
  );
};

export default ThemeSwitcher;