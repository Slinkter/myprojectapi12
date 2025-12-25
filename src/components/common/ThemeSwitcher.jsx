import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi2";

const ThemeSwitcher = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <button
            onClick={toggleTheme}
            className="neumo-button theme-switcher"
        >
            {theme === "light" ? (
                <HiOutlineMoon className="theme-switcher__icon" />
            ) : (
                <HiOutlineSun className="theme-switcher__icon" />
            )}
        </button>
    );
};

export default ThemeSwitcher;
