import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let initialized = false;

export function initGsapReveals() {
  if (initialized || typeof window === "undefined") {
    return;
  }

  initialized = true;

  const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    nodes.forEach((node) => {
      node.style.opacity = "1";
      node.style.transform = "none";
    });
    return;
  }

  nodes.forEach((node, index) => {
    const delayAttr = Number(node.dataset.revealDelay ?? "0");
    const delay = Number.isFinite(delayAttr) ? delayAttr : index * 0.04;

    gsap.fromTo(
      node,
      {
        opacity: 0,
        y: 28
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: node,
          start: "top 88%",
          once: true
        }
      }
    );
  });
}
