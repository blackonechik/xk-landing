import type { Variants } from 'motion/react'

export const viewportReveal = {
  once: true,
  amount: 0.24,
  margin: '0px 0px -12% 0px',
}

export const sectionReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 42,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.74,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export const staggerReveal: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
}

export const cardReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 46,
    scale: 0.96,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.68,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export const trailerReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 52,
    scale: 0.985,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.82,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}
