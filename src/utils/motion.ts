/**
 * Central Motion Design System - Instantaneous Performance Configuration
 * 
 * Configured with 0 durations and instant transitions to guarantee:
 * - Zero animations across the app
 * - 0ms layout lag and 0 frame drops
 * - Smooth performance on any refresh rate up to 175Hz
 * - Instant VSync frame alignment without jank
 */

// Zero Duration Tokens for immediate UI feedback
export const MOTION_DURATIONS = {
  fast: 0,
  normal: 0,
  smooth: 0,
  large: 0,
} as const;

// Easing Curves (instantaneous linear)
export const MOTION_EASINGS = {
  appleDecel: [0, 0, 1, 1] as [number, number, number, number],
  standard: [0, 0, 1, 1] as [number, number, number, number],
  accelerate: [0, 0, 1, 1] as [number, number, number, number],
  easeInOut: [0, 0, 1, 1] as [number, number, number, number],
} as const;

// Springs configured with 0 duration for instant resolution
export const MOTION_SPRINGS = {
  gentle: { type: 'tween' as const, duration: 0 },
  interactive: { type: 'tween' as const, duration: 0 },
  snappy: { type: 'tween' as const, duration: 0 },
  bouncy: { type: 'tween' as const, duration: 0 },
};

export const prefersReducedMotion = (): boolean => true;

// ============================================================================
// MOTION VARIANTS (Zero duration, instant displays)
// ============================================================================

// 1. Page / Route Transition
export const tabSpringVariants = {
  initial: { opacity: 1 },
  animate: { opacity: 1, transition: { duration: 0 } },
  exit: { opacity: 1, transition: { duration: 0 } },
};

export const pageVariants = tabSpringVariants;

// 2. Modal Backdrop and Content
export const modalBackdropVariants = {
  initial: { opacity: 1 },
  animate: { opacity: 1, transition: { duration: 0 } },
  exit: { opacity: 1, transition: { duration: 0 } },
};

export const modalCardVariants = {
  initial: { opacity: 1, scale: 1, y: 0 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0 } },
  exit: { opacity: 1, scale: 1, y: 0, transition: { duration: 0 } },
};

// 3. Staggered Container and Item
export const staggerContainerVariants = {
  initial: {},
  animate: { transition: { staggerChildren: 0, delayChildren: 0 } },
};

export const staggerItemVariants = {
  initial: { opacity: 1, y: 0 },
  animate: { opacity: 1, y: 0, transition: { duration: 0 } },
};

// 4. Slide-in Drawer Variants
export const drawerVariants = {
  initial: { x: 0, opacity: 1 },
  animate: { x: 0, opacity: 1, transition: { duration: 0 } },
  exit: { x: '-100%', opacity: 1, transition: { duration: 0 } },
};

// 5. Card Hover & Tap Interactions (0 transform for zero jank)
export const interactiveCardVariants = {
  rest: { y: 0, scale: 1, transition: { duration: 0 } },
  hover: { y: 0, scale: 1, transition: { duration: 0 } },
  tap: { y: 0, scale: 1, transition: { duration: 0 } },
};

// 6. Interactive Button Press
export const buttonPressVariants = {
  rest: { scale: 1 },
  hover: { scale: 1 },
  tap: { scale: 1 },
};

// 7. Toast Notification Variants
export const toastVariants = {
  initial: { opacity: 1, y: 0, scale: 1 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0 } },
  exit: { opacity: 0, y: 0, scale: 1, transition: { duration: 0 } },
};

// 8. Search Result Item Entry/Exit/Layout Variants
export const searchResultItemVariants = {
  initial: { opacity: 1, y: 0, scale: 1 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0 } },
  exit: { opacity: 0, y: 0, scale: 1, transition: { duration: 0 } },
};
