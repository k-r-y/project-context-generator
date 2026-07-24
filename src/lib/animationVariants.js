// Centralized Framer Motion animation variants
// Per interaction-design skill: keep animations under 300ms, use physics-based easing

export const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
    scale: 0.97,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction) => ({
    x: direction < 0 ? 80 : -80,
    opacity: 0,
    scale: 0.97,
  }),
}

export const slideTransition = {
  duration: 0.28,
  ease: [0.4, 0, 0.2, 1],
}

export const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
  },
}

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
}

export const staggerItem = {
  hidden: { opacity: 0, y: 16, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.25, ease: [0.34, 1.56, 0.64, 1] },
  },
}

export const scalePopVariants = {
  initial: { scale: 1 },
  tap: { scale: 0.94 },
  hover: { scale: 1.04 },
}

export const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } },
}

export const chipVariants = {
  initial: { scale: 1, boxShadow: 'none' },
  hover: { scale: 1.04, transition: { duration: 0.15 } },
  tap: { scale: 0.94, transition: { duration: 0.08 } },
  active: {
    scale: 1,
    boxShadow: '0 0 0 1px rgba(99,102,241,0.5), 0 0 16px rgba(99,102,241,0.25)',
    transition: { duration: 0.2 },
  },
}

export const checkmarkVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
}

export const glowPulse = {
  animate: {
    boxShadow: [
      '0 0 16px rgba(99,102,241,0.2)',
      '0 0 32px rgba(99,102,241,0.5)',
      '0 0 16px rgba(99,102,241,0.2)',
    ],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
}
