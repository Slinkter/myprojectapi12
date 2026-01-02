import { useContext } from "react";
import { ThemeContext } from "@/features/theme/application/ThemeContext";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi2";

import { IconButton } from "@material-tailwind/react";

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <IconButton
      variant="text"
      color="blue-gray"
      onClick={toggleTheme}
      className="rounded-full hover:bg-blue-gray-50/50 dark:hover:bg-gray-800"
    >
      {theme === "light" ? (
        <HiOutlineMoon className="h-6 w-6" />
      ) : (
        <HiOutlineSun className="h-6 w-6" />
      )}
    </IconButton>
  );
};

export default ThemeSwitcher;
