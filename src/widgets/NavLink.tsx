/**
 * @file NavLink.tsx
 * @description Enlace de navegación con indicador animado de ruta activa.
 * Compartido entre el Navbar (menú desktop) y el menu móvil.
 * @architecture Widget Layer - Nav Link
 */

import { Link } from "react-router-dom";
import { m } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Props para el componente NavLink.
 * @interface INavLinkProps
 */
interface INavLinkProps {
    /** Ruta de destino. */
    to: string;
    /** Indica si la ruta actual coincide. */
    active: boolean;
    /** Contenido del enlace. */
    children: ReactNode;
    /** Callback al hacer clic. */
    onClick?: () => void;
}

/**
 * @component NavLink
 * @description Enlace de React Router con indicador animado (`layoutId`) cuando
 * la ruta esta activa. Se usa en la navegación principal y en el menú móvil.
 *
 * @param {INavLinkProps} props - Props tipadas (ver {@link INavLinkProps}).
 * @returns {JSX.Element} Elemento Link estilizado.
 *
 * @example
 * <NavLink to="/faq" active={false}>Ayuda & FAQ</NavLink>
 */
export const NavLink = ({
    to,
    active,
    children,
    onClick,
}: INavLinkProps) => (
    <Link
        to={to}
        className="no-underline rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        onClick={onClick}
    >
        <div
            className={`px-4 py-2 rounded-full text-sm font-semibold tracking-wide transition-colors cursor-pointer relative flex items-center min-h-[48px] md:min-h-[44px] ${
                active
                    ? "bg-primary/10 text-primary dark:bg-primary/20 hover:bg-primary/15 dark:hover:bg-primary/25"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
            }`}
        >
            {children}
            {active && (
                <m.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-[20%] right-[20%] h-0.5 rounded-t-full bg-primary"
                />
            )}
        </div>
    </Link>
);