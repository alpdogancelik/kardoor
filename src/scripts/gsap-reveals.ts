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

function setupHeroParallax() {
  const hero = document.querySelector<HTMLElement>(".hero-portal");
  if (!hero) return;

  const stage = hero.querySelector<HTMLElement>(".hero-stage");
  const door = hero.querySelector<HTMLElement>(".hero-door-object");
  const halo = hero.querySelector<HTMLElement>(".hero-door-halo");
  const frame = hero.querySelector<HTMLElement>(".hero-door-frame");
  const callouts = hero.querySelectorAll<HTMLElement>(".hero-callout, .hero-stage-label");

  if (!stage || !door) return;

  const timeline = gsap.timeline({
    defaults: {
      ease: "none"
    },
    scrollTrigger: {
      trigger: hero,
      start: "top top",
      end: "bottom top",
      scrub: 0.8,
      invalidateOnRefresh: true
    }
  });

  timeline.to(stage, { y: 42, scale: 0.98, duration: 1 }, 0);
  timeline.to(door, { y: -26, scale: 1.035, duration: 1 }, 0);
  timeline.to(halo, { scale: 1.12, opacity: 0.72, duration: 1 }, 0);
  timeline.to(frame, { scale: 1.025, opacity: 0.86, duration: 1 }, 0);

  if (callouts.length) {
    timeline.to(callouts, { y: -18, opacity: 0.72, duration: 1 }, 0);
  }
}

function setupCorridorMicroAnimations() {
  const dot = document.querySelector<HTMLElement>(".corridor-wayfinding-dot");

  if (dot) {
    gsap.to(dot, {
      scale: 1.28,
      opacity: 0.68,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });
  }

  const visual = document.querySelector<HTMLElement>(".corridor-visual");
  if (!visual) return;

  const door = visual.querySelector<HTMLElement>(".corridor-vanishing-door");
  const floor = visual.querySelector<HTMLElement>(".corridor-floor-plane");
  const displays = visual.querySelectorAll<HTMLElement>(".corridor-display-zone");

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: visual,
      start: "top 82%",
      once: true
    }
  });

  timeline.fromTo(
    visual,
    { opacity: 0, y: 34 },
    { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
    0
  );

  if (door) {
    timeline.fromTo(
      door,
      { opacity: 0, scale: 0.72 },
      { opacity: 1, scale: 0.88, duration: 0.8, ease: "power3.out" },
      0.18
    );
  }

  if (floor) {
    timeline.fromTo(
      floor,
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: "power2.out" },
      0.24
    );
  }

  if (displays.length) {
    timeline.fromTo(
      displays,
      { opacity: 0, y: 18 },
      { opacity: 0.72, y: 0, duration: 0.65, stagger: 0.08, ease: "power2.out" },
      0.34
    );
  }
}

function setupCollectionRoomAnimations() {
  const rooms = gsap.utils.toArray<HTMLElement>(".collection-room-scene");

  rooms.forEach((room) => {
    const door = room.querySelector<HTMLElement>(".room-door-object");
    const light = room.querySelector<HTMLElement>(".room-light");
    const panel = room.querySelector<HTMLElement>(".room-back-panel");
    const chips = room.querySelectorAll<HTMLElement>(".room-model-codes li");
    const labels = room.querySelectorAll<HTMLElement>(".room-stage-label");
    const callouts = room.querySelectorAll<HTMLElement>(".technical-callouts span");

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: room,
        start: "top 72%",
        once: true
      }
    });

    if (panel) {
      timeline.fromTo(
        panel,
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1, duration: 0.75, ease: "power3.out" },
        0
      );
    }

    if (light) {
      timeline.fromTo(
        light,
        { opacity: 0, scale: 0.82 },
        { opacity: 0.9, scale: 1, duration: 0.9, ease: "power3.out" },
        0.05
      );
    }

    if (door) {
      timeline.fromTo(
        door,
        { opacity: 0, y: 42, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: "power3.out" },
        0.15
      );
    }

    if (chips.length) {
      timeline.fromTo(
        chips,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.05, ease: "power2.out" },
        0.28
      );
    }

    if (labels.length) {
      timeline.fromTo(
        labels,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.06, ease: "power2.out" },
        0.34
      );
    }

    if (callouts.length) {
      timeline.fromTo(
        callouts,
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1, duration: 0.45, stagger: 0.06, ease: "power2.out" },
        0.42
      );
    }
  });
}

function setupModelStageAnimations() {
  const stages = gsap.utils.toArray<HTMLElement>(".model-stage");

  stages.forEach((stage) => {
    const door = stage.querySelector<HTMLElement>(".model-stage-door");
    const halo = stage.querySelector<HTMLElement>(".model-stage-halo");
    const chips = stage.querySelectorAll<HTMLElement>(".model-stage-chip");

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: stage,
        start: "top 78%",
        once: true
      }
    });

    if (halo) {
      timeline.fromTo(
        halo,
        { opacity: 0, scale: 0.78 },
        { opacity: 1, scale: 1, duration: 0.85, ease: "power3.out" },
        0
      );
    }

    if (door) {
      timeline.fromTo(
        door,
        { opacity: 0, y: 34, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: "power3.out" },
        0.12
      );
    }

    if (chips.length) {
      timeline.fromTo(
        chips,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.08, ease: "power2.out" },
        0.28
      );
    }
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

  setupHeroParallax();
  setupDoorEntryAnimation();
  setupCorridorMicroAnimations();
  setupCollectionRoomAnimations();
  setupModelStageAnimations();

  window.addEventListener(
    "load",
    () => {
      ScrollTrigger.refresh();
    },
    { once: true }
  );
}