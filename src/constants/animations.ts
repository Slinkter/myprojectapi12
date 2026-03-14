/**
 * @file animations.ts
 * @description Definiciones de constantes para animaciones con Framer Motion.
 * Centraliza las variantes reutilizables de animación.
 * @architecture Presentation Layer - Animation Constants
 */
import { Variants } from "framer-motion";

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
