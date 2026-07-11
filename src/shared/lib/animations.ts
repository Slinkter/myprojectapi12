import type { Variants } from 'framer-motion'

/** Variante de Framer Motion para una animación de aparición gradual (fade in). @remarks Oculta con opacidad 0, visible con opacidad 1 en 0.3s. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
}

/** Variante para animación de deslizamiento hacia arriba con opacidad. @remarks Oculta opaco con desplazamiento +20px, visible opaco 1 en Y=0 durante 0.4s. */
export const slideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

/** Variante para contenedor que aplica un retraso escalonado a sus hijos animados. @remarks Cada hijo se anima con 0.1s de retraso respecto al anterior. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

/** Variante para animación de escalado con opacidad. @remarks Oculta con escala 0.95 y opacidad 0, visible con escala 1 y opacidad 1 en 0.2s. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
}

/** Variante para animación de deslizamiento desde la derecha con entrada y salida. @remarks Entrada desde X=60, salida hacia X=60 con opacidad 0. */
export const slideInFromRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35 } },
  exit: { opacity: 0, x: 60, transition: { duration: 0.25 } },
}

/** Variante para animación tipo modal que se desliza hacia arriba con efecto spring. @remarks Transición spring con stiffness 300 y damping 30 para una sensación orgánica. */
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

/** Variante para animación de fade del backdrop (fondo oscuro) de modales y overlays. */
export const backdropFade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

/** Variante para animación de fade al navegar entre páginas. @remarks Opacidad 0 a 1 con duración de 0.3s. */
export const pageFadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
}
