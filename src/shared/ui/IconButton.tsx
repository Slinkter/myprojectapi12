/**
 * @file IconButton.tsx
 * @description Botón iconográfico reutilizable con animaciones de hover y tap.
 * Centraliza el antiguo `ActionBtn` del Navbar para compartirlo entre todos los widgets.
 * @architecture Shared UI - Icon Button
 */

import { m } from "framer-motion";
import type { ReactNode } from "react";

/** Clases base del botón de icono (usadas también para estilos derivados). */
export const iconButtonClass =
    "flex items-center justify-center w-12 h-12 sm:w-10 sm:h-10 rounded-full border-none bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors duration-150 cursor-pointer text-slate-600 dark:text-slate-300 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/**
 * Props para el componente IconButton.
 * @interface IIconButtonProps
 */
interface IIconButtonProps {
    /** Callback opcional al hacer clic. */
    onClick?: () => void;
    /** Etiqueta ARIA para accesibilidad. */
    label: string;
    /** Contenido (icono o elementos animados). */
    children: ReactNode;
    /** Clases CSS adicionales. */
    className?: string;
}

/**
 * @component IconButton
 * @description Botón redondeado centrado en un icono, con animaciones de hover
 * (`scale 1.05`) y tap (`scale 0.95`) vía framer-motion.
 *
 * @param {IIconButtonProps} props - Props tipadas (ver {@link IIconButtonProps}).
 * @returns {JSX.Element} Botón animado con icono.
 *
 * @example
 * <IconButton onClick={openCart} label="Abrir carrito">
 *     <ShoppingCart size="20" />
 * </IconButton>
 */
export const IconButton = ({
    onClick,
    label,
    children,
    className,
}: IIconButtonProps) => (
    <m.button
        type="button"
        onClick={onClick}
        aria-label={label}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`${iconButtonClass} ${className ?? ""}`}
    >
        {children}
    </m.button>
);