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

function setupHomeDoorSequence() {
  const hero = document.querySelector<HTMLElement>("[data-home-door-sequence]");
  if (!hero) return;

  const zoomLayer = hero.querySelector<HTMLElement>("[data-home-zoom-layer]");
  const image = hero.querySelector<HTMLImageElement>("[data-home-hero-image]");
  const stage = hero.querySelector<HTMLElement>("[data-door-sequence-stage]");
  const frame = hero.querySelector<HTMLCanvasElement>("[data-door-sequence-frame]");
  const blackout = hero.querySelector<HTMLElement>("[data-home-portal-blackout]");
  const actions = hero.querySelector<HTMLElement>(".home-photo-actions");
  const showroomContent = document.querySelector<HTMLElement>("[data-home-showroom-content]");

  if (!zoomLayer || !image || !stage || !frame || !blackout) return;

  const context = frame.getContext("2d");
  if (!context) return;

  const frames = Array.from({ length: 60 }, (_, index) => index + 1);
  const doorRect = {
    x: 608,
    y: 227,
    width: 158,
    height: 346
  };
  const renderDoorRect = {
    x: 846,
    y: 316,
    width: 225,
    height: 493
  };

  const frameUrl = (frameNumber: number) =>
    `/images/doorrrender/render${String(frameNumber).padStart(4, "0")}.png`;
  const sequenceProgressEnd = 0.58;
  const zoomProgressStart = sequenceProgressEnd;
  const blackoutProgressStart = 0.86;
  const contentRevealStart = 0.84;

  const loadedFrames = new Map<number, HTMLImageElement>();
  const pendingFrames = new Map<number, Promise<HTMLImageElement>>();
  const playhead = { progress: 0 };
  let currentFrameIndex = -1;
  let targetFrameIndex = 0;
  let portalHandoffComplete = false;
  let latestScrollEnd = 0;
  let latestScrollDirection = 1;
  let playheadTween: gsap.core.Tween | null = null;

  const loadFrame = (frameNumber: number) => {
    const loadedFrame = loadedFrames.get(frameNumber);
    if (loadedFrame) return Promise.resolve(loadedFrame);

    const pendingFrame = pendingFrames.get(frameNumber);
    if (pendingFrame) return pendingFrame;

    const preload = new Image();
    preload.decoding = "async";
    preload.src = frameUrl(frameNumber);

    const pending = (preload.decode ? preload.decode() : Promise.resolve(preload))
      .catch(
        () =>
          new Promise<HTMLImageElement>((resolve, reject) => {
            preload.onload = () => resolve(preload);
            preload.onerror = () => reject();
          })
      )
      .then(() => {
        loadedFrames.set(frameNumber, preload);
        return preload;
      })
      .finally(() => {
        pendingFrames.delete(frameNumber);
      });

    pendingFrames.set(frameNumber, pending);
    return pending;
  };

  const drawFrame = (source: HTMLImageElement) => {
    const displayWidth = Math.max(1, Math.round(stage.getBoundingClientRect().width));
    const displayHeight = Math.max(1, Math.round(stage.getBoundingClientRect().height));
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const canvasWidth = Math.max(1, Math.round(displayWidth * pixelRatio));
    const canvasHeight = Math.max(1, Math.round(displayHeight * pixelRatio));

    if (frame.width !== canvasWidth) frame.width = canvasWidth;
    if (frame.height !== canvasHeight) frame.height = canvasHeight;

    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.clearRect(0, 0, displayWidth, displayHeight);
    context.drawImage(
      source,
      renderDoorRect.x,
      renderDoorRect.y,
      renderDoorRect.width,
      renderDoorRect.height,
      0,
      0,
      displayWidth,
      displayHeight
    );
  };

  const updateStagePosition = () => {
    const naturalWidth = image.naturalWidth || 1376;
    const naturalHeight = image.naturalHeight || 768;
    const bounds = hero.getBoundingClientRect();
    const style = window.getComputedStyle(image);
    const [positionX = "50%", positionY = "0%"] = style.objectPosition.split(/\s+/);
    const xRatio = Number.parseFloat(positionX) / 100;
    const yRatio = Number.parseFloat(positionY) / 100;
    const scale = Math.max(bounds.width / naturalWidth, bounds.height / naturalHeight);
    const renderedWidth = naturalWidth * scale;
    const renderedHeight = naturalHeight * scale;
    const offsetX = (bounds.width - renderedWidth) * (Number.isFinite(xRatio) ? xRatio : 0.5);
    const offsetY = (bounds.height - renderedHeight) * (Number.isFinite(yRatio) ? yRatio : 0);

    const stageWidth = doorRect.width * scale;
    const stageHeight = doorRect.height * scale;

    stage.style.setProperty("--door-left", `${offsetX + doorRect.x * scale}px`);
    stage.style.setProperty("--door-top", `${offsetY + doorRect.y * scale}px`);
    stage.style.setProperty("--door-width", `${stageWidth}px`);
    stage.style.setProperty("--door-height", `${stageHeight}px`);
    const zoomOriginX = `${offsetX + (doorRect.x + doorRect.width / 2) * scale}px`;
    const zoomOriginY = `${offsetY + (doorRect.y + doorRect.height / 2) * scale}px`;

    hero.style.setProperty("--zoom-origin-x", zoomOriginX);
    hero.style.setProperty("--zoom-origin-y", zoomOriginY);
    zoomLayer.style.setProperty("--zoom-origin-x", zoomOriginX);
    zoomLayer.style.setProperty("--zoom-origin-y", zoomOriginY);

    const currentFrameNumber = frames[currentFrameIndex];
    const currentFrame = loadedFrames.get(currentFrameNumber);
    if (currentFrame) drawFrame(currentFrame);
  };

  const easeInOut = (value: number) => value * value * (3 - 2 * value);

  const updateZoom = (progress: number) => {
    const zoomProgress = easeInOut(Math.min(1, Math.max(0, progress)));
    const scale = 1 + zoomProgress * 6.4;
    const brightness = 1 - zoomProgress * 0.5;

    zoomLayer.style.setProperty("--hero-zoom-scale", `${scale}`);
    zoomLayer.style.setProperty("--hero-zoom-brightness", `${brightness}`);
    stage.style.opacity = `${1 - Math.max(0, zoomProgress - 0.72) / 0.28}`;
  };

  const updatePortalHandoff = (progress: number) => {
    const blackoutProgress = easeInOut(
      Math.min(1, Math.max(0, (progress - blackoutProgressStart) / (1 - blackoutProgressStart)))
    );
    const contentProgress = easeInOut(
      Math.min(1, Math.max(0, (progress - contentRevealStart) / (1 - contentRevealStart)))
    );

    hero.style.setProperty("--portal-blackout-opacity", `${blackoutProgress}`);
    if (actions) actions.style.opacity = `${1 - Math.min(1, progress / 0.2)}`;

    if (!showroomContent) return;

    if (progress >= contentRevealStart) {
      showroomContent.classList.add("is-visible");
      showroomContent.style.setProperty("--showroom-content-visibility", "visible");
      showroomContent.style.setProperty("--showroom-content-opacity", `${contentProgress}`);
    } else {
      showroomContent.classList.remove("is-visible");
      showroomContent.style.setProperty("--showroom-content-visibility", "hidden");
      showroomContent.style.setProperty("--showroom-content-opacity", "0");
    }
  };

  const releaseShowroomContent = () => {
    if (!showroomContent) return;

    showroomContent.classList.add("is-visible");
    showroomContent.style.setProperty("--showroom-content-visibility", "visible");
    showroomContent.style.setProperty("--showroom-content-opacity", "1");
    ScrollTrigger.refresh();
  };

  const completePortalHandoff = () => {
    if (
      latestScrollDirection > 0 &&
      playhead.progress >= 0.995 &&
      currentFrameIndex === frames.length - 1 &&
      !portalHandoffComplete
    ) {
      portalHandoffComplete = true;
      releaseShowroomContent();
      requestAnimationFrame(() => {
        window.scrollTo({ top: latestScrollEnd, behavior: "auto" });
      });
    } else if (playhead.progress < contentRevealStart) {
      portalHandoffComplete = false;
    }
  };

  const renderProgress = () => {
    const progress = Math.min(1, Math.max(0, playhead.progress));
    const sequenceProgress = Math.min(progress / sequenceProgressEnd, 1);
    const frameIndex = Math.min(
      frames.length - 1,
      Math.max(0, Math.floor(sequenceProgress * frames.length))
    );
    const frameNumber = frames[frameIndex];
    targetFrameIndex = frameIndex;

    if (currentFrameIndex !== frameIndex) {
      loadFrame(frameNumber).then((loadedFrame) => {
        if (targetFrameIndex !== frameIndex) return;
        currentFrameIndex = frameIndex;
        drawFrame(loadedFrame);
      });
    }

    const zoomProgress = Math.max(
      0,
      (progress - zoomProgressStart) / (blackoutProgressStart - zoomProgressStart)
    );

    updateZoom(zoomProgress);
    updatePortalHandoff(progress);
    completePortalHandoff();
  };

  const scrubToProgress = (progress: number) => {
    const targetProgress = Math.min(1, Math.max(0, progress));
    const remainingFrameCount = Math.abs(
      Math.floor(Math.min(targetProgress / sequenceProgressEnd, 1) * frames.length) -
        Math.floor(Math.min(playhead.progress / sequenceProgressEnd, 1) * frames.length)
    );
    const duration = Math.max(0.12, remainingFrameCount / 42, Math.abs(targetProgress - playhead.progress) * 0.85);

    playheadTween?.kill();
    playheadTween = gsap.to(playhead, {
      progress: targetProgress,
      duration,
      ease: "none",
      overwrite: true,
      onUpdate: renderProgress,
      onComplete: renderProgress
    });
  };

  const preloadFrames = () => {
    for (const frameNumber of frames) {
      loadFrame(frameNumber);
    }
  };

  updateStagePosition();
  renderProgress();
  preloadFrames();

  ScrollTrigger.create({
    trigger: hero,
    start: "top top",
    end: "+=210%",
    scrub: 0.55,
    pin: true,
    pinSpacing: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    onRefresh: updateStagePosition,
    onLeave: (self) => {
      latestScrollDirection = 1;
      latestScrollEnd = self.end;
      scrubToProgress(1);
    },
    onUpdate: (self) => {
      latestScrollDirection = self.direction;
      latestScrollEnd = self.end;
      scrubToProgress(self.progress);
    }
  });

  window.addEventListener("resize", updateStagePosition);
}

function setupShowroomJourney() {
  const journey = document.querySelector<HTMLElement>("[data-showroom-journey]");
  if (!journey) return;

  const fixed = journey.querySelector<HTMLElement>("[data-journey-fixed]");
  const copy = journey.querySelector<HTMLElement>("[data-journey-copy]");
  const portal = journey.querySelector<HTMLElement>("[data-journey-portal]");
  const leaf = journey.querySelector<HTMLElement>("[data-door-leaf]");
  const depth = journey.querySelector<HTMLElement>("[data-door-depth]");
  const frame = journey.querySelector<HTMLElement>("[data-door-frame]");
  const blackout = journey.querySelector<HTMLElement>("[data-journey-blackout]");
  const cue = journey.querySelector<HTMLElement>("[data-journey-cue]");

  if (!fixed || !copy || !portal || !leaf || !depth || !frame || !blackout) {
    return;
  }

  const mm = gsap.matchMedia();

  mm.add("(min-width: 901px)", () => {
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
    gsap.set(depth, { opacity: 0, scale: 0.86, x: 0, y: 0 });
    gsap.set(blackout, { opacity: 0 });
    if (cue) gsap.set(cue, { opacity: 1, y: 0 });

    const timeline = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: journey,
        start: "top top",
        end: "+=220%",
        scrub: 0.8,
        pin: fixed,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    timeline.to(cue, { opacity: 0, y: 18, duration: 0.08 }, 0);
    timeline.to(portal, { scale: 1.08, y: -8, duration: 0.18 }, 0);
    timeline.to(copy, { opacity: 0.72, y: -10, duration: 0.16 }, 0.04);
    timeline.to(depth, { opacity: 0.52, scale: 0.98, duration: 0.2 }, 0.12);

    timeline.to(
      leaf,
      { rotateY: -58, x: -56, z: 120, scale: 1.035, duration: 0.32 },
      0.18
    );
    timeline.to(frame, { scale: 1.08, opacity: 0.58, duration: 0.28 }, 0.2);
    timeline.to(copy, { opacity: 0.18, y: -34, scale: 0.98, duration: 0.22 }, 0.28);
    timeline.to(depth, { opacity: 1, scale: 1.16, duration: 0.28 }, 0.34);

    timeline.to(
      leaf,
      {
        rotateY: -86,
        x: -210,
        z: 340,
        scale: 1.16,
        opacity: 0.08,
        duration: 0.34
      },
      0.48
    );
    timeline.to(copy, { opacity: 0, y: -56, duration: 0.16 }, 0.5);
    timeline.to(frame, { opacity: 0.04, scale: 1.26, duration: 0.24 }, 0.52);
    timeline.to(
      portal,
      { scale: 1.72, y: -20, opacity: 0.2, duration: 0.3 },
      0.58
    );
    timeline.to(depth, { scale: 1.55, opacity: 0.7, duration: 0.3 }, 0.58);

    timeline.to(blackout, { opacity: 0.98, duration: 0.2 }, 0.78);
    timeline.to(portal, { opacity: 0, scale: 1.95, duration: 0.16 }, 0.82);

    return () => {
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
    gsap.set(depth, { opacity: 0.42, scale: 0.96 });

    const timeline = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: journey,
        start: "top top",
        end: "+=140%",
        scrub: 0.8,
        pin: fixed,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    timeline.to(cue, { opacity: 0, y: 12, duration: 0.12 }, 0);
    timeline.to(copy, { opacity: 0.12, y: -28, duration: 0.36 }, 0.08);
    timeline.to(depth, { opacity: 0.95, scale: 1.12, duration: 0.5 }, 0.12);
    timeline.to(leaf, { rotateY: -72, x: -76, z: 120, scale: 1.08, opacity: 0.18, duration: 0.58 }, 0.18);
    timeline.to(portal, { scale: 1.42, opacity: 0.22, duration: 0.45 }, 0.42);
    timeline.to(blackout, { opacity: 0.96, duration: 0.22 }, 0.72);

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
  setupHomeDoorSequence();
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
