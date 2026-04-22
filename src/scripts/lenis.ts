import Lenis from "lenis";

let initialized = false;

export function initLenis() {
  if (initialized || typeof window === "undefined") {
    return;
  }

  initialized = true;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    return;
  }

  const lenis = new Lenis({
    smoothWheel: true,
    duration: 1.05,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.1,
    infinite: false
  });

  const raf = (time: number) => {
    lenis.raf(time);
    window.requestAnimationFrame(raf);
  };

  window.requestAnimationFrame(raf);

  window.addEventListener("beforeunload", () => {
    lenis.destroy();
  });
}
