import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let initialized = false;

function revealSplitText() {
  const splitNodes = gsap.utils.toArray<HTMLElement>("[data-split]");

  splitNodes.forEach((node) => {
    if (node.dataset.splitReady === "true") {
      return;
    }

    const text = node.textContent?.trim();
    if (!text) {
      return;
    }

    const words = text.split(/\s+/);
    node.innerHTML = words.map((word) => `<span class=\"split-word\">${word}</span>`).join(" ");
    node.dataset.splitReady = "true";

    const wordNodes = node.querySelectorAll<HTMLElement>(".split-word");
    gsap.fromTo(
      wordNodes,
      { yPercent: 120, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.05,
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

function revealStandardBlocks() {
  gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((node, index) => {
    const delay = Number(node.dataset.revealDelay ?? index * 0.02);

    gsap.fromTo(
      node,
      { opacity: 0, y: 36 },
      {
        opacity: 1,
        y: 0,
        delay,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: node,
          start: "top 89%",
          once: true
        }
      }
    );
  });
}

function setupDoorOpeningTransition() {
  const section = document.querySelector<HTMLElement>("[data-door-transition]");
  const camera = document.querySelector<HTMLElement>("[data-door-camera]");
  const leaf = document.querySelector<HTMLElement>("[data-door-leaf]");
  const backlight = document.querySelector<HTMLElement>("[data-door-backlight]");
  const interior = document.querySelector<HTMLElement>("[data-door-interior]");
  const overlay = document.querySelector<HTMLElement>("[data-door-overlay]");

  if (!section || !camera || !leaf || !backlight || !interior || !overlay) {
    return;
  }

  gsap.set(leaf, {
    transformOrigin: "left center",
    transformPerspective: 1800,
    rotateY: 0
  });

  const mm = gsap.matchMedia();

  mm.add("(min-width: 768px)", () => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=180%",
        scrub: 1,
        pin: true,
        anticipatePin: 1
      }
    });

    timeline.to(camera, { scale: 1.42, y: -36, duration: 1, ease: "none" }, 0);
    timeline.to(leaf, { rotateY: -112, x: -44, duration: 1, ease: "none" }, 0.22);
    timeline.to(backlight, { opacity: 1, scale: 1.45, duration: 0.85, ease: "none" }, 0.3);
    timeline.to(interior, { opacity: 1, scale: 1.08, duration: 0.9, ease: "none" }, 0.35);
    timeline.to(overlay, { opacity: 0, y: -26, duration: 0.35, ease: "none" }, 0.58);
  });

  mm.add("(max-width: 767px)", () => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "bottom top",
        scrub: 1
      }
    });

    timeline.to(leaf, { rotateY: -66, x: -18, duration: 1, ease: "none" }, 0);
    timeline.to(backlight, { opacity: 0.9, duration: 0.8, ease: "none" }, 0.15);
    timeline.to(interior, { opacity: 0.95, duration: 0.9, ease: "none" }, 0.25);
    timeline.to(overlay, { opacity: 0.12, duration: 0.6, ease: "none" }, 0.2);
  });
}

function setupCollectionWalk() {
  const section = document.querySelector<HTMLElement>("[data-collection-walk]");
  const track = document.querySelector<HTMLElement>("[data-collection-track]");

  if (!section || !track) {
    return;
  }

  const rooms = gsap.utils.toArray<HTMLElement>("[data-collection-room]");
  const mm = gsap.matchMedia();

  mm.add("(min-width: 1024px)", () => {
    const tween = gsap.to(track, {
      xPercent: -100 * (rooms.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${window.innerWidth * rooms.length}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    rooms.forEach((room) => {
      const callouts = room.querySelectorAll<HTMLElement>("[data-callout]");

      gsap.fromTo(
        callouts,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.05,
          ease: "power2.out",
          scrollTrigger: {
            trigger: room,
            containerAnimation: tween,
            start: "left center",
            once: true
          }
        }
      );
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  });

  mm.add("(max-width: 1023px)", () => {
    rooms.forEach((room) => {
      gsap.fromTo(
        room,
        { opacity: 0, y: 44 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: room,
            start: "top 88%",
            once: true
          }
        }
      );
    });

    gsap.utils.toArray<HTMLElement>("[data-callout]").forEach((callout) => {
      gsap.fromTo(
        callout,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: callout,
            start: "top 94%",
            once: true
          }
        }
      );
    });
  });
}

function setupProductSpotlights() {
  gsap.utils.toArray<HTMLElement>("[data-product-stage]").forEach((stage) => {
    gsap.fromTo(
      stage,
      { opacity: 0, y: 54 },
      {
        opacity: 1,
        y: 0,
        duration: 0.95,
        ease: "power3.out",
        scrollTrigger: {
          trigger: stage,
          start: "top 84%",
          once: true
        }
      }
    );
  });
}

function forceVisibleOnReducedMotion() {
  const nodes = gsap.utils.toArray<HTMLElement>(
    "[data-reveal], [data-callout], [data-product-stage], [data-door-overlay], [data-door-interior]"
  );

  nodes.forEach((node) => {
    node.style.opacity = "1";
    node.style.transform = "none";
  });
}

export function initGsapReveals() {
  if (initialized || typeof window === "undefined") {
    return;
  }

  initialized = true;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    forceVisibleOnReducedMotion();
    return;
  }

  revealSplitText();
  revealStandardBlocks();
  setupDoorOpeningTransition();
  setupCollectionWalk();
  setupProductSpotlights();

  requestAnimationFrame(() => ScrollTrigger.refresh());
}
