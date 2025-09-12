export const SIDEBAR_DIMENSIONS = {
  DEFAULT_WIDTH: 400,
  MIN_WIDTH: 300,
  MAX_WIDTH: 600,
  WIDTH_STEP: 50,
} as const;

export const EASINGS = {
  EASE_OUT: [0.4, 0, 0.2, 1] as [number, number, number, number],
  EASE_IN: [0.4, 0, 1, 1] as [number, number, number, number],
} as const;

export const sidebarVariants = {
  open: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 40,
    },
  },
  closed: {
    x: "100%",
    opacity: 0,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 40,
    },
  },
} as const;

export const backdropVariants = {
  open: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: EASINGS.EASE_OUT,
    },
  },
  closed: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: EASINGS.EASE_IN,
    },
  },
} as const;

export const contentVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
      duration: 0.4,
      ease: EASINGS.EASE_OUT,
    },
  },
  closed: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.3,
      ease: EASINGS.EASE_IN,
    },
  },
} as const;

export const itemVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: EASINGS.EASE_OUT,
    },
  },
  closed: {
    opacity: 0,
    y: 10,
    transition: {
      duration: 0.3,
      ease: EASINGS.EASE_IN,
    },
  },
} as const;
