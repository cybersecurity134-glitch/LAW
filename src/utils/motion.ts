/**
 * NyayaSetu India - Central Motion Design System
 * 
 * Provides unified timings, easings, spring configurations, and Framer/Motion variants
 * to ensure 60 FPS, GPU-accelerated, and consistent animations across the application.
 */

// Centralized Timing Tokens (seconds)
export const MOTION_DURATIONS = {
  fast: 0.15,      // 150ms - micro-interactions, toggles, icon clicks
  normal: 0.28,    // 280ms - dropdowns, button states, card hover
  smooth: 0.36,    // 360ms - page transitions, drawer slides, modal open
  large: 0.48,     // 480ms - complex view expansion, large dialogs
} as const;

// Easing Curves
export const MOTION_EASINGS = {
  // Apple/iOS-inspired smooth deceleration curve
  appleDecel: [0.16, 1, 0.3, 1] as [number, number, number, number],
  // Standard smooth cubic-bezier
  standard: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
  // Acceleration for exiting elements
  accelerate: [0.4, 0, 1, 1] as [number, number, number, number],
  // Gentle ease in and out
  easeInOut: [0.42, 0, 0.58, 1] as [number, number, number, number],
} as const;

// Spring Configurations
export const MOTION_SPRINGS = {
  gentle: { type: 'spring' as const, stiffness: 280, damping: 28 },
  interactive: { type: 'spring' as const, stiffness: 420, damping: 30 },
  snappy: { type: 'spring' as const, stiffness: 500, damping: 32 },
  bouncy: { type: 'spring' as const, stiffness: 400, damping: 22 },
};

// Check if user prefers reduced motion
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// ============================================================================
// MOTION VARIANTS
// ============================================================================

// 1. Page / Route Transition
export const pageVariants = {
  initial: {
    opacity: 0,
    y: 12,
    scale: 0.985,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: MOTION_DURATIONS.smooth,
      ease: MOTION_EASINGS.appleDecel,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.99,
    transition: {
      duration: MOTION_DURATIONS.normal,
      ease: MOTION_EASINGS.accelerate,
    },
  },
};

// 2. Modal Backdrop and Content
export const modalBackdropVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: MOTION_DURATIONS.normal,
      ease: MOTION_EASINGS.appleDecel,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: MOTION_DURATIONS.fast,
      ease: MOTION_EASINGS.accelerate,
    },
  },
};

export const modalCardVariants = {
  initial: {
    opacity: 0,
    scale: 0.96,
    y: 10,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: MOTION_DURATIONS.smooth,
      ease: MOTION_EASINGS.appleDecel,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 8,
    transition: {
      duration: MOTION_DURATIONS.fast,
      ease: MOTION_EASINGS.accelerate,
    },
  },
};

// 3. Staggered Container and Item (for Hero, Card Grids, Search Results)
export const staggerContainerVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02,
    },
  },
};

export const staggerItemVariants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_DURATIONS.normal,
      ease: MOTION_EASINGS.appleDecel,
    },
  },
};

// 4. Slide-in Drawer Variants (Mobile Sidebar)
export const drawerVariants = {
  initial: {
    x: '-100%',
    opacity: 0.5,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      damping: 32,
      stiffness: 340,
    },
  },
  exit: {
    x: '-100%',
    opacity: 0,
    transition: {
      duration: MOTION_DURATIONS.normal,
      ease: MOTION_EASINGS.accelerate,
    },
  },
};

// 5. Card Hover & Tap Interactions
export const interactiveCardVariants = {
  rest: {
    y: 0,
    scale: 1,
    transition: {
      duration: MOTION_DURATIONS.fast,
      ease: MOTION_EASINGS.standard,
    },
  },
  hover: {
    y: -3,
    scale: 1.01,
    transition: {
      duration: MOTION_DURATIONS.fast,
      ease: MOTION_EASINGS.appleDecel,
    },
  },
  tap: {
    y: 0,
    scale: 0.98,
    transition: {
      duration: 0.1,
      ease: MOTION_EASINGS.standard,
    },
  },
};

// 6. Interactive Button Press
export const buttonPressVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.97 },
};

// 7. Toast Notification Variants
export const toastVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: MOTION_DURATIONS.normal,
      ease: MOTION_EASINGS.appleDecel,
    },
  },
  exit: {
    opacity: 0,
    y: 16,
    scale: 0.95,
    transition: {
      duration: MOTION_DURATIONS.fast,
      ease: MOTION_EASINGS.accelerate,
    },
  },
};
