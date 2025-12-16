import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { Button } from "@material-tailwind/react";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi2";

const ThemeSwitcher = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <Button
            onClick={toggleTheme}
            variant="gradient"
            className="theme-switcher"
        >
            {theme === "light" ? (
                <HiOutlineMoon className="theme-switcher__icon h-5 w-5" />
            ) : (
                <HiOutlineSun className="theme-switcher__icon h-5 w-5" />
            )}
        </Button>
    );
};

export default ThemeSwitcher;
