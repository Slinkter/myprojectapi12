/**
 * @file animations.ts
 * @description Definiciones de constantes para animaciones con Framer Motion.
 * Centraliza las variantes reutilizables de animación.
 * @architecture Presentation Layer - Animation Constants
 */
import { Variants } from "framer-motion";

/**
 * Product grid entrance animations.
 *
 * @remarks
 * Uses a "stagger" effect where each child element animates with a slight delay
 * after the previous one. This improves perceived performance and creates
 * a more professional, "flowing" user experience.
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
 * Page-level fade-in transition.
 *
 * @remarks
 * A subtle 0.3s duration is chosen to be fast enough not to hinder
 * navigation speed but slow enough to be visually pleasant.
 */
export const PAGE_FADE_IN: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.3 },
    },
};

/**
 * Modal slide-up and entry animation.
 *
 * @remarks
 * Uses a "spring" transition instead of a linear curve.
 * Spring physics (`stiffness: 300`, `damping: 30`) provide a more
 * organic, "iOS-like" feel that responds naturally to user interaction.
 */
export const MODAL_SLIDE_UP: Variants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    exit: {
        y: 50,
        opacity: 0,
        transition: { duration: 0.2 },
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
