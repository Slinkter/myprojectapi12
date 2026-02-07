import { Variants } from "framer-motion";

/**
 * Animaciones para el grid de productos.
 * Usa stagger para animar los items secuencialmente.
 */
export const PRODUCT_GRID_ANIMATIONS = {
    container: {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    } as Variants,

    item: {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
        },
    } as Variants,
} as const;

/**
 * Animación de fade in para páginas.
 */
export const PAGE_FADE_IN: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.3 }
    },
};

/**
 * Animación de slide up para modales.
 */
export const MODAL_SLIDE_UP: Variants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    exit: {
        y: 50,
        opacity: 0,
        transition: { duration: 0.2 }
    },
};

/**
 * Animación de backdrop para modales y overlays.
 */
export const BACKDROP_FADE: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
};
