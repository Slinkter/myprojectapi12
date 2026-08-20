import type { Variants } from 'framer-motion'

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
}

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
}

export const slideInFromRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35 } },
  exit: { opacity: 0, x: 60, transition: { duration: 0.25 } },
}

export const modalSlideUp: Variants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  exit: {
    y: 50,
    opacity: 0,
    transition: { duration: 0.2 },
  },
}

export const backdropFade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

export const pageFadeIn: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
  },
}

export const scrollReveal: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.19, 1, 0.22, 1] },
  },
}

export const flyToCart: Variants = {
  initial: { opacity: 1, scale: 1 },
  animate: {
    opacity: 0,
    scale: 0.3,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
}

/**
 * Easing "emphasized" de Material Design 3 (`motion/easing.md3`) para transiciones
 * de entrada/salida de componentes móviles (bottom sheets, FABs).
 */
export const md3EmphasizedEase: [number, number, number, number] = [0.2, 0, 0, 1]

/**
 * Variantes de Modal Bottom Sheet de Material Design 3.
 * Entrada y salida deslizando desde el borde inferior con física de resorte suave.
 */
export const bottomSheet: Variants = {
  hidden: { y: '100%' },
  visible: {
    y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 32, mass: 1 },
  },
  exit: {
    y: '100%',
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
  },
}
