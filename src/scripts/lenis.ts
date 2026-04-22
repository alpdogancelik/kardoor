import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
    duration: 1.1,
    wheelMultiplier: 0.95,
    touchMultiplier: 1.05,
    lerp: 0.1
  });

  lenis.on("scroll", () => {
    ScrollTrigger.update();
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
