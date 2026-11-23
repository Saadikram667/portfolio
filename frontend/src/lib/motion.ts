/**
 * Section 4.3 Motion Tokens
 * Single easing curve and duration scale shared across GSAP and Motion.
 */
export const MOTION_EASE = [0.22, 1, 0.36, 1] as const;
export const GSAP_EASE = 'power3.out';

export const DURATION = {
  fast: 0.15,
  base: 0.3,
  slow: 0.6,
} as const;