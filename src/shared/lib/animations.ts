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
  visible: { transition: { staggerChildren: 0.1 } },
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
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
}
