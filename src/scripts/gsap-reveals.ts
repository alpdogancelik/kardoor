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

    gsap.fromTo(
      node.querySelectorAll<HTMLElement>(".split-word"),
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
    if (node.closest("[data-showroom-journey]")) return;
    if (node.closest("[data-collection-carousel]")) return;

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

function setupHeroParallax() {
  const hero = document.querySelector<HTMLElement>(".hero-portal");
  if (!hero) return;

  const stage = hero.querySelector<HTMLElement>(".hero-stage");
  const door = hero.querySelector<HTMLElement>(".hero-door-object");
  const halo = hero.querySelector<HTMLElement>(".hero-door-halo");
  const frame = hero.querySelector<HTMLElement>(".hero-door-frame");
  const callouts = hero.querySelectorAll<HTMLElement>(
    ".hero-callout, .hero-stage-label"
  );

  if (!stage || !door) return;

  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: hero,
      start: "top top",
      end: "bottom top",
      scrub: 0.75,
      invalidateOnRefresh: true
    }
  });

  timeline.to(stage, { y: 30, scale: 0.985, duration: 1 }, 0);
  timeline.to(door, { y: -16, scale: 1.018, duration: 1 }, 0);

  if (halo) timeline.to(halo, { scale: 1.07, opacity: 0.72, duration: 1 }, 0);
  if (frame) timeline.to(frame, { scale: 1.012, opacity: 0.86, duration: 1 }, 0);
  if (callouts.length) timeline.to(callouts, { y: -10, opacity: 0.7, duration: 1 }, 0);
}

function setupShowroomJourney() {
  const journey = document.querySelector<HTMLElement>("[data-showroom-journey]");
  if (!journey) return;

  const fixed = journey.querySelector<HTMLElement>("[data-journey-fixed]");
  const copy = journey.querySelector<HTMLElement>("[data-journey-copy]");
  const portal = journey.querySelector<HTMLElement>("[data-journey-portal]");
  const leaf = journey.querySelector<HTMLElement>("[data-door-leaf]");
  const light = journey.querySelector<HTMLElement>("[data-door-light]");
  const depth = journey.querySelector<HTMLElement>("[data-door-depth]");
  const frame = journey.querySelector<HTMLElement>("[data-door-frame]");
  const blackout = journey.querySelector<HTMLElement>("[data-journey-blackout]");
  const labels = journey.querySelectorAll<HTMLElement>(".journey-label");

  if (!fixed || !copy || !portal || !leaf || !light || !depth || !frame || !blackout) {
    return;
  }

  const mm = gsap.matchMedia();

  mm.add("(min-width: 901px)", () => {
    const originalHeight = journey.style.height;

    journey.style.height = "100svh";

    gsap.set(fixed, { opacity: 1 });
    gsap.set(copy, { opacity: 1, x: 0, y: 0, scale: 1 });
    gsap.set(portal, {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      rotate: 0,
      transformOrigin: "center center"
    });
    gsap.set(leaf, {
      opacity: 1,
      rotateY: 0,
      x: 0,
      z: 0,
      scale: 1,
      transformOrigin: "left center",
      transformPerspective: 1850
    });
    gsap.set(frame, { opacity: 1, scale: 1, x: 0, y: 0 });
    gsap.set(light, { opacity: 0.42, scale: 0.92 });
    gsap.set(depth, { opacity: 0, scale: 0.9, x: 0, y: 0 });
    gsap.set(blackout, { opacity: 0 });
    if (labels.length) gsap.set(labels, { opacity: 1, y: 0 });

    const timeline = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: journey,
        start: "top top",
        end: "+=125%",
        scrub: 0.8,
        pin: fixed,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    timeline.to(copy, { opacity: 0.76, y: -8, duration: 0.1 }, 0);
    timeline.to(portal, { scale: 1.04, y: -6, duration: 0.12 }, 0);
    timeline.to(light, { opacity: 0.76, scale: 1.06, duration: 0.12 }, 0.02);
    timeline.to(depth, { opacity: 0.32, scale: 0.96, duration: 0.12 }, 0.04);

    timeline.to(
      leaf,
      { rotateY: -30, x: -8, z: 42, scale: 1.012, duration: 0.16 },
      0.08
    );
    timeline.to(frame, { scale: 1.02, opacity: 0.94, duration: 0.16 }, 0.08);

    timeline.to(copy, { opacity: 0.22, y: -32, scale: 0.98, duration: 0.18 }, 0.22);
    timeline.to(light, { opacity: 1, scale: 1.18, duration: 0.2 }, 0.2);
    timeline.to(depth, { opacity: 1, scale: 1.05, duration: 0.22 }, 0.22);
    timeline.to(
      leaf,
      { rotateY: -66, x: -44, z: 128, scale: 1.04, duration: 0.24 },
      0.24
    );
    timeline.to(frame, { scale: 1.1, x: 14, opacity: 0.65, duration: 0.22 }, 0.26);
    timeline.to(portal, { scale: 1.17, y: -10, duration: 0.24 }, 0.28);

    if (labels.length) timeline.to(labels, { opacity: 0, y: -10, duration: 0.1 }, 0.32);

    timeline.to(copy, { opacity: 0, y: -54, duration: 0.16 }, 0.38);
    timeline.to(
      leaf,
      {
        rotateY: -85,
        x: -138,
        z: 260,
        scale: 1.14,
        opacity: 0.16,
        duration: 0.26
      },
      0.42
    );
    timeline.to(frame, { opacity: 0.1, scale: 1.22, duration: 0.18 }, 0.46);
    timeline.to(depth, { scale: 1.3, opacity: 0.78, duration: 0.22 }, 0.46);
    timeline.to(light, { opacity: 0.78, scale: 1.34, duration: 0.22 }, 0.48);
    timeline.to(
      portal,
      { scale: 1.72, x: -92, y: -18, opacity: 0.26, duration: 0.28 },
      0.54
    );

    timeline.to(blackout, { opacity: 0.98, duration: 0.22 }, 0.72);
    timeline.to(portal, { opacity: 0, scale: 1.9, duration: 0.16 }, 0.78);
    timeline.to(fixed, { opacity: 1, duration: 0.1 }, 0.9);

    return () => {
      journey.style.height = originalHeight;
      timeline.scrollTrigger?.kill();
      timeline.kill();
    };
  });

  mm.add("(max-width: 900px)", () => {
    gsap.set([copy, portal], { opacity: 1, clearProps: "transform" });
    gsap.set(blackout, { opacity: 0 });
    gsap.set(leaf, {
      rotateY: -8,
      transformOrigin: "left center",
      transformPerspective: 1200
    });
    gsap.set(depth, { opacity: 0.78, scale: 1 });

    const timeline = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: portal,
        start: "top 70%",
        end: "bottom 35%",
        scrub: 0.8,
        invalidateOnRefresh: true
      }
    });

    timeline.to(leaf, { rotateY: -38, x: -10, scale: 1.015, duration: 1 }, 0);
    timeline.to(light, { opacity: 0.92, scale: 1.08, duration: 1 }, 0);
    timeline.to(depth, { opacity: 0.9, scale: 1.02, duration: 1 }, 0.12);

    return () => {
      timeline.scrollTrigger?.kill();
      timeline.kill();
    };
  });
}

function setupCollectionCarousel() {
  const carousel = document.querySelector<HTMLElement>("[data-collection-carousel]");
  if (!carousel) return;

  const stage = carousel.querySelector<HTMLElement>("[data-carousel-stage]");
  const track = carousel.querySelector<HTMLElement>("[data-carousel-track]");
  const progress = carousel.querySelector<HTMLElement>("[data-carousel-progress]");
  const slides = Array.from(carousel.querySelectorAll<HTMLElement>("[data-carousel-slide]"));

  if (!stage || !track || slides.length < 2) return;

  const setActiveSlide = (activeIndex: number) => {
    slides.forEach((slide, index) => {
      const isActive = index === activeIndex;
      slide.classList.toggle("is-active", isActive);

      const title = slide.querySelector<HTMLElement>(".showcase-title");
      const door = slide.querySelector<HTMLElement>(".showcase-door-stage");
      const info = slide.querySelector<HTMLElement>(".showcase-info");
      const actions = slide.querySelector<HTMLElement>(".showcase-actions");
      const lamp = slide.querySelector<HTMLElement>(".showcase-lamp");
      const sideDoors = slide.querySelectorAll<HTMLElement>(".showcase-side-door");
      const ghosts = slide.querySelectorAll<HTMLElement>(".showcase-ghost");

      gsap.to(title, {
        opacity: isActive ? 1 : 0.18,
        y: isActive ? 0 : 18,
        scale: isActive ? 1 : 0.98,
        duration: 0.28,
        overwrite: true,
        ease: "power2.out"
      });

      gsap.to(door, {
        opacity: isActive ? 1 : 0.45,
        scale: isActive ? 1 : 0.92,
        duration: 0.28,
        overwrite: true,
        ease: "power2.out"
      });

      gsap.to([info, actions], {
        opacity: isActive ? 1 : 0.12,
        y: isActive ? 0 : 12,
        duration: 0.28,
        overwrite: true,
        ease: "power2.out"
      });

      gsap.to(lamp, {
        opacity: isActive ? 1 : 0.25,
        duration: 0.28,
        overwrite: true,
        ease: "power2.out"
      });

      gsap.to(sideDoors, {
        opacity: isActive ? 0.4 : 0.12,
        x: isActive ? 0 : 26,
        duration: 0.28,
        overwrite: true,
        ease: "power2.out"
      });

      gsap.to(ghosts, {
        opacity: isActive ? 1 : 0.22,
        duration: 0.28,
        overwrite: true,
        ease: "power2.out"
      });
    });
  };

  const mm = gsap.matchMedia();

  mm.add("(min-width: 1101px)", () => {
    setActiveSlide(0);
    gsap.set(track, { x: 0 });
    if (progress) progress.style.transform = "scaleY(0)";

    const getDistance = () => Math.max(1, track.scrollWidth - window.innerWidth);

    const tween = gsap.to(track, {
      x: () => -getDistance(),
      ease: "none",
      scrollTrigger: {
        trigger: carousel,
        start: "top top",
        end: () => `+=${getDistance()}`,
        scrub: 0.9,
        pin: stage,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const activeIndex = Math.min(
            slides.length - 1,
            Math.max(0, Math.round(self.progress * (slides.length - 1)))
          );

          setActiveSlide(activeIndex);

          if (progress) {
            progress.style.transform = `scaleY(${self.progress})`;
          }
        }
      }
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(track, { clearProps: "transform" });
    };
  });

  mm.add("(max-width: 1100px)", () => {
    gsap.set(track, { clearProps: "transform" });
    slides.forEach((slide) => slide.classList.add("is-active"));
    if (progress) progress.style.transform = "scaleY(1)";
  });
}

function setupCorridorMicroAnimations() {
  const dots = gsap.utils.toArray<HTMLElement>(
    ".corridor-dot, .corridor-wayfinding-dot"
  );

  dots.forEach((dot) => {
    gsap.to(dot, {
      scale: 1.22,
      opacity: 0.68,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });
  });
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
        start: "top 74%",
        once: true
      }
    });

    if (panel) {
      timeline.fromTo(
        panel,
        { opacity: 0, scale: 0.94 },
        { opacity: 1, scale: 1, duration: 0.72, ease: "power3.out" },
        0
      );
    }

    if (light) {
      timeline.fromTo(
        light,
        { opacity: 0, scale: 0.84 },
        { opacity: 0.9, scale: 1, duration: 0.82, ease: "power3.out" },
        0.05
      );
    }

    if (door) {
      timeline.fromTo(
        door,
        { opacity: 0, y: 34, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.78, ease: "power3.out" },
        0.12
      );
    }

    if (chips.length) {
      timeline.fromTo(
        chips,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.42, stagger: 0.05, ease: "power2.out" },
        0.26
      );
    }

    if (labels.length) {
      timeline.fromTo(
        labels,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.42, stagger: 0.06, ease: "power2.out" },
        0.32
      );
    }

    if (callouts.length) {
      timeline.fromTo(
        callouts,
        { opacity: 0, scale: 0.94 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.42,
          stagger: 0.06,
          ease: "power2.out"
        },
        0.38
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
        start: "top 80%",
        once: true
      }
    });

    if (halo) {
      timeline.fromTo(
        halo,
        { opacity: 0, scale: 0.82 },
        { opacity: 1, scale: 1, duration: 0.76, ease: "power3.out" },
        0
      );
    }

    if (door) {
      timeline.fromTo(
        door,
        { opacity: 0, y: 28, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.78, ease: "power3.out" },
        0.1
      );
    }

    if (chips.length) {
      timeline.fromTo(
        chips,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.42, stagger: 0.08, ease: "power2.out" },
        0.24
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

  const journey = document.querySelector<HTMLElement>("[data-showroom-journey]");
  const portal = document.querySelector<HTMLElement>("[data-journey-portal]");
  const blackout = document.querySelector<HTMLElement>("[data-journey-blackout]");
  const track = document.querySelector<HTMLElement>("[data-carousel-track]");
  const progress = document.querySelector<HTMLElement>("[data-carousel-progress]");
  const slides = document.querySelectorAll<HTMLElement>("[data-carousel-slide]");

  if (journey) journey.style.height = "auto";
  if (portal) portal.style.opacity = "1";
  if (blackout) blackout.style.opacity = "0";
  if (track) track.style.transform = "none";
  if (progress) progress.style.transform = "scaleY(1)";
  slides.forEach((slide) => slide.classList.add("is-active"));
}

export function initGsapReveals() {
  if (initialized || typeof window === "undefined") return;

  initialized = true;

  ScrollTrigger.config({
    ignoreMobileResize: true
  });

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    forceVisible();
    return;
  }

  splitTextReveals();
  blockReveals();
  calloutReveals();
  productStageReveals();

  setupHeroParallax();
  setupShowroomJourney();
  setupCollectionCarousel();
  setupCorridorMicroAnimations();
  setupCollectionRoomAnimations();
  setupModelStageAnimations();

  window.addEventListener(
    "load",
    () => {
      ScrollTrigger.refresh();
      requestAnimationFrame(() => ScrollTrigger.refresh());
    },
    { once: true }
  );
}
