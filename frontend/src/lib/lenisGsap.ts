import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;
let tickerCallback: ((time: number) => void) | null = null;

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Initializes Lenis synced to GSAP's single ticker clock.
 * Respects prefers-reduced-motion automatically.
 */
export function initLenisGsap(): () => void {
  if (prefersReducedMotion()) {
    return () => {};
  }

  const lenis = new Lenis({
    duration: 1.15,
    smoothWheel: true,
    touchMultiplier: 1.5,
  });

  lenisInstance = lenis;
  lenis.on('scroll', ScrollTrigger.update);

  tickerCallback = (time: number) => {
    lenis.raf(time * 1000);
  };

  gsap.ticker.add(tickerCallback);
  gsap.ticker.lagSmoothing(0);

  return () => {
    if (tickerCallback) {
      gsap.ticker.remove(tickerCallback);
      tickerCallback = null;
    }
    lenis.destroy();
    lenisInstance = null;
  };
}

export function setScrollLocked(locked: boolean): void {
  if (!lenisInstance) return;
  if (locked) lenisInstance.stop();
  else lenisInstance.start();
}

export function scrollToSection(selector: string): void {
  if (lenisInstance) {
    lenisInstance.scrollTo(selector, { offset: -88, duration: 1.1 });
  } else {
    document.querySelector(selector)?.scrollIntoView({ behavior: 'auto' });
  }
}