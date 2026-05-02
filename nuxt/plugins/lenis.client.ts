import Lenis from "lenis";

export default defineNuxtPlugin(() => {
  const lenis = new Lenis({
    duration: 1.05,
    smoothWheel: true,
    wheelMultiplier: 0.86
  });

  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  return {
    provide: {
      lenis
    }
  };
});
