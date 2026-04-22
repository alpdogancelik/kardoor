import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let initialized = false;

function splitTextReveals() {
  const splitNodes = gsap.utils.toArray<HTMLElement>("[data-split]");

  splitNodes.forEach((node) => {
    if (node.dataset.splitReady === "true") return;

    const text = node.textContent?.trim();
    if (!text) return;

    node.innerHTML = text
      .split(/\s+/)
      .map((word) => `<span class="split-word">${word}</span>`)
      .join(" ");

    node.dataset.splitReady = "true";

    const words = node.querySelectorAll<HTMLElement>(".split-word");

    gsap.fromTo(
      words,
      { y: 28, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.75,
        stagger: 0.035,
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

function blockReveals() {
  gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((node) => {
    gsap.fromTo(
      node,
      { opacity: 0, y: 32 },
      {
        opacity: 1,
        y: 0,
        duration: 0.75,
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

function calloutReveals() {
  gsap.utils.toArray<HTMLElement>("[data-callout]").forEach((node) => {
    gsap.fromTo(
      node,
      { opacity: 0, scale: 0.94 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.45,
        ease: "power2.out",
        scrollTrigger: {
          trigger: node,
          start: "top 92%",
          once: true
        }
      }
    );
  });
}

function productStageReveals() {
  gsap.utils.toArray<HTMLElement>("[data-product-stage]").forEach((node) => {
    gsap.fromTo(
      node,
      { opacity: 0, y: 36 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: node,
          start: "top 86%",
          once: true
        }
      }
    );
  });
}

function setupDoorEntryAnimation() {
  const section = document.querySelector<HTMLElement>("[data-door-entry]");
  if (!section) return;

  const stage = section.querySelector<HTMLElement>("[data-door-stage]");
  const leaf = section.querySelector<HTMLElement>("[data-door-leaf]");
  const light = section.querySelector<HTMLElement>("[data-door-light]");
  const depth = section.querySelector<HTMLElement>("[data-door-depth]");
  const interior = section.querySelector<HTMLElement>("[data-door-interior]");
  const copy = section.querySelector<HTMLElement>("[data-door-copy]");
  const frame = section.querySelector<HTMLElement>("[data-door-frame]");

  if (!stage || !leaf || !light || !depth || !interior || !copy || !frame) return;

  const mm = gsap.matchMedia();

  mm.add("(min-width: 900px)", () => {
    gsap.set(stage, {
      scale: 1,
      transformOrigin: "center center"
    });

    gsap.set(leaf, {
      rotateY: 0,
      x: 0,
      transformOrigin: "left center",
      transformPerspective: 1400
    });

    gsap.set([depth, interior], {
      opacity: 0
    });

    const timeline = gsap.timeline({
      defaults: {
        ease: "none"
      },
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=120%",
        scrub: 0.8,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    timeline.to(stage, { scale: 1.12, y: -12, duration: 1 }, 0);
    timeline.to(copy, { opacity: 0.08, y: -24, duration: 0.38 }, 0.32);

    timeline.to(light, { opacity: 1, scale: 1.18, duration: 0.8 }, 0.12);
    timeline.to(depth, { opacity: 1, scale: 1.04, duration: 0.75 }, 0.18);
    timeline.to(interior, { opacity: 1, scale: 1.04, duration: 0.75 }, 0.22);

    timeline.to(frame, { x: 22, scale: 1.04, duration: 0.7 }, 0.26);
    timeline.to(leaf, { rotateY: -72, x: -18, duration: 0.82 }, 0.26);

    return () => {
      timeline.scrollTrigger?.kill();
      timeline.kill();
    };
  });

  mm.add("(max-width: 899px)", () => {
    gsap.set(leaf, {
      rotateY: -8,
      transformOrigin: "left center",
      transformPerspective: 1200
    });

    const timeline = gsap.timeline({
      defaults: {
        ease: "none"
      },
      scrollTrigger: {
        trigger: section,
        start: "top 70%",
        end: "bottom 35%",
        scrub: 0.8,
        invalidateOnRefresh: true
      }
    });

    timeline.to(leaf, { rotateY: -42, x: -8, duration: 1 }, 0);
    timeline.to(light, { opacity: 1, scale: 1.12, duration: 1 }, 0);
    timeline.to(depth, { opacity: 0.85, scale: 1, duration: 1 }, 0.15);
    timeline.to(interior, { opacity: 0.8, duration: 1 }, 0.18);

    return () => {
      timeline.scrollTrigger?.kill();
      timeline.kill();
    };
  });
}

function forceVisible() {
  const nodes = gsap.utils.toArray<HTMLElement>(
    "[data-reveal], [data-split], [data-callout], [data-product-stage]"
  );

  nodes.forEach((node) => {
    node.style.opacity = "1";
    node.style.transform = "none";
  });
}

export function initGsapReveals() {
  if (initialized || typeof window === "undefined") return;

  initialized = true;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    forceVisible();
    return;
  }

  splitTextReveals();
  blockReveals();
  calloutReveals();
  productStageReveals();
  setupDoorEntryAnimation();

  window.addEventListener(
    "load",
    () => {
      ScrollTrigger.refresh();
    },
    { once: true }
  );
}