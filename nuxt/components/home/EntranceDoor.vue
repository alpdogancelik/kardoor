<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";

const nuxtApp = useNuxtApp();

const heroRef = ref<HTMLElement | null>(null);
const zoomLayerRef = ref<HTMLElement | null>(null);
const imageRef = ref<HTMLImageElement | null>(null);
const stageRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const blackoutRef = ref<HTMLElement | null>(null);

let cleanup: (() => void) | undefined;
let startPortalFromCta: (() => void) | undefined;

const enterShowroomFromCta = (event: MouseEvent) => {
  event.preventDefault();

  if (startPortalFromCta) {
    startPortalFromCta();
    return;
  }

  document.getElementById("showroom-dive")?.scrollIntoView({
    block: "start",
    behavior: "auto"
  });
};

onMounted(async () => {
  const hero = heroRef.value;
  const zoomLayer = zoomLayerRef.value;
  const image = imageRef.value;
  const stage = stageRef.value;
  const canvas = canvasRef.value;
  const blackout = blackoutRef.value;

  if (!hero || !zoomLayer || !image || !stage || !canvas || !blackout) return;

  const { gsap } = await import("gsap");
  const { ScrollTrigger } = await import("gsap/ScrollTrigger");

  gsap.registerPlugin(ScrollTrigger);

  const context = canvas.getContext("2d");
  if (!context) return;

  const frames = Array.from({ length: 60 }, (_, index) => index + 1);
  const loadedFrames = new Map<number, HTMLImageElement>();
  const pendingFrames = new Map<number, Promise<HTMLImageElement>>();

  const playhead = { progress: 0 };

  const doorRect = { x: 608, y: 227, width: 158, height: 346 };
  const renderDoorRect = { x: 0, y: 0, width: 225, height: 493 };

  const sequenceProgressEnd = 0.8;
  const zoomProgressStart = 0.84;
  const blackoutProgressStart = 0.93;

  let currentFrameIndex = -1;
  let targetFrameIndex = 0;
  let playheadTween: ReturnType<typeof gsap.to> | null = null;
  let trigger: ReturnType<typeof ScrollTrigger.create> | null = null;

  let isDoorOpen = false;
  let hasEnteredShowroom = false;
  let isEnteringShowroom = false;
  let scrollDirection = 1;

  const setEntranceExited = (nextState: boolean) => {
    hero.classList.toggle("entrance-door--exited", nextState);
  };

  const setDoorOpen = (nextState: boolean) => {
    if (isDoorOpen === nextState) return;

    isDoorOpen = nextState;

    window.dispatchEvent(
      new CustomEvent("kardoor:entrance-door-state", {
        detail: { isOpen: nextState }
      })
    );
  };

  const frameUrl = (frameNumber: number) =>
    `/images/doorrrender/render${String(frameNumber).padStart(4, "0")}.png`;

  const loadFrame = (frameNumber: number) => {
    const loaded = loadedFrames.get(frameNumber);
    if (loaded) return Promise.resolve(loaded);

    const pending = pendingFrames.get(frameNumber);
    if (pending) return pending;

    const preload = new Image();
    preload.decoding = "async";
    preload.src = frameUrl(frameNumber);

    const request = (preload.decode ? preload.decode() : Promise.resolve())
      .catch(
        () =>
          new Promise<void>((resolve, reject) => {
            preload.onload = () => resolve();
            preload.onerror = () => reject();
          })
      )
      .then(() => {
        loadedFrames.set(frameNumber, preload);
        return preload;
      })
      .finally(() => pendingFrames.delete(frameNumber));

    pendingFrames.set(frameNumber, request);
    return request;
  };

  const drawFrame = (source: HTMLImageElement) => {
    const displayWidth = Math.max(1, Math.round(stage.getBoundingClientRect().width));
    const displayHeight = Math.max(1, Math.round(stage.getBoundingClientRect().height));
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    const canvasWidth = Math.max(1, Math.round(displayWidth * pixelRatio));
    const canvasHeight = Math.max(1, Math.round(displayHeight * pixelRatio));

    if (canvas.width !== canvasWidth) canvas.width = canvasWidth;
    if (canvas.height !== canvasHeight) canvas.height = canvasHeight;

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

    const [positionX = "50%", positionY = "0%"] = window
      .getComputedStyle(image)
      .objectPosition.split(/\s+/);

    const xRatio = Number.parseFloat(positionX) / 100;
    const yRatio = Number.parseFloat(positionY) / 100;

    const scale = Math.max(bounds.width / naturalWidth, bounds.height / naturalHeight);
    const renderedWidth = naturalWidth * scale;
    const renderedHeight = naturalHeight * scale;

    const offsetX =
      (bounds.width - renderedWidth) * (Number.isFinite(xRatio) ? xRatio : 0.5);

    const offsetY =
      (bounds.height - renderedHeight) * (Number.isFinite(yRatio) ? yRatio : 0);

    const stageWidth = doorRect.width * scale;
    const stageHeight = doorRect.height * scale;

    const zoomOriginX = `${offsetX + (doorRect.x + doorRect.width * 0.72) * scale}px`;
    const zoomOriginY = `${offsetY + (doorRect.y + doorRect.height * 0.54) * scale}px`;

    stage.style.setProperty("--door-left", `${offsetX + doorRect.x * scale}px`);
    stage.style.setProperty("--door-top", `${offsetY + doorRect.y * scale}px`);
    stage.style.setProperty("--door-width", `${stageWidth}px`);
    stage.style.setProperty("--door-height", `${stageHeight}px`);

    zoomLayer.style.setProperty("--zoom-origin-x", zoomOriginX);
    zoomLayer.style.setProperty("--zoom-origin-y", zoomOriginY);

    hero.style.setProperty("--zoom-origin-x", zoomOriginX);
    hero.style.setProperty("--zoom-origin-y", zoomOriginY);

    const currentFrame = loadedFrames.get(frames[currentFrameIndex] ?? 1);
    if (currentFrame) drawFrame(currentFrame);
  };

  const easeInOut = (value: number) => value * value * (3 - 2 * value);

  const updateZoom = (progress: number) => {
    const eased = easeInOut(Math.min(1, Math.max(0, progress)));

    zoomLayer.style.setProperty("--hero-zoom-scale", `${1 + eased * 6.4}`);
    zoomLayer.style.setProperty("--hero-zoom-brightness", `${1 - eased * 0.5}`);

    stage.style.opacity = `${1 - Math.max(0, eased - 0.72) / 0.28}`;
  };

  const updateContentState = (progress: number) => {
    const copyFade = easeInOut(Math.min(1, Math.max(0, (progress - 0.08) / 0.28)));
    const cueFade = easeInOut(Math.min(1, Math.max(0, progress / 0.22)));

    hero.style.setProperty("--entrance-copy-opacity", `${1 - copyFade}`);
    hero.style.setProperty("--entrance-copy-y", `${copyFade * -24}px`);
    hero.style.setProperty("--entrance-cue-opacity", `${1 - cueFade}`);
  };

  const getLenis = () =>
    (
      nuxtApp as unknown as {
        $lenis?: {
          scrollTo?: (
            target: Element | number,
            options?: Record<string, unknown>
          ) => void;
        };
      }
    ).$lenis;

  const moveToShowroom = () => {
    const showroom = document.getElementById("showroom-dive");
    if (!showroom) return;

    const targetY = Math.max(
      0,
      Math.round(showroom.getBoundingClientRect().top + window.scrollY)
    );

    const lenis = getLenis();

    lenis?.scrollTo?.(targetY, {
      immediate: true,
      force: true,
      duration: 0,
      lock: false
    });

    window.scrollTo({
      top: targetY,
      left: 0,
      behavior: "auto"
    });
  };

  const resetPortalVisuals = () => {
    playheadTween?.kill();
    playheadTween = null;

    playhead.progress = 0;
    targetFrameIndex = 0;
    currentFrameIndex = -1;

    updateZoom(0);
    updateContentState(0);

    hero.style.setProperty("--portal-blackout-opacity", "0");
    stage.style.opacity = "1";

    setEntranceExited(false);
    setDoorOpen(false);

    loadFrame(1).then((loadedFrame) => {
      targetFrameIndex = 0;
      currentFrameIndex = 0;
      drawFrame(loadedFrame);
    });
  };

  const renderProgress = (allowEnter = true, direction = scrollDirection) => {
    const progress = Math.min(1, Math.max(0, playhead.progress));

    const sequenceProgress = Math.min(progress / sequenceProgressEnd, 1);

    const frameIndex = Math.min(
      frames.length - 1,
      Math.max(0, Math.floor(sequenceProgress * frames.length))
    );

    const frameNumber = frames[frameIndex] ?? 1;
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

    const blackoutProgress = easeInOut(
      Math.min(
        1,
        Math.max(0, (progress - blackoutProgressStart) / (1 - blackoutProgressStart))
      )
    );

    updateZoom(zoomProgress);
    updateContentState(progress);

    hero.style.setProperty("--portal-blackout-opacity", `${blackoutProgress}`);

    setDoorOpen(progress >= sequenceProgressEnd);

    if (direction < 0 || progress < 0.985) {
      hasEnteredShowroom = false;
      isEnteringShowroom = false;
      setEntranceExited(false);
    }

    if (allowEnter && direction > 0 && progress >= 0.995) {
      window.requestAnimationFrame(() => enterShowroom(true));
    }
  };

  const scrubToProgress = (progress: number, direction = scrollDirection) => {
    const targetProgress = Math.min(1, Math.max(0, progress));
    const duration = Math.max(0.08, Math.abs(targetProgress - playhead.progress) * 0.55);

    playheadTween?.kill();

    playheadTween = gsap.to(playhead, {
      progress: targetProgress,
      duration,
      ease: "none",
      overwrite: true,
      onUpdate: () => renderProgress(true, direction),
      onComplete: () => renderProgress(true, direction)
    });
  };

  const enterShowroom = async (shouldJump = true) => {
    if (isEnteringShowroom || hasEnteredShowroom) return;

    isEnteringShowroom = true;
    hasEnteredShowroom = true;

    playheadTween?.kill();
    playheadTween = null;

    playhead.progress = 1;
    renderProgress(false, 1);

    await nextTick();

    if (shouldJump) {
      moveToShowroom();

      window.requestAnimationFrame(() => {
        moveToShowroom();
        setEntranceExited(true);
        isEnteringShowroom = false;
      });

      return;
    }

    setEntranceExited(true);
    isEnteringShowroom = false;
  };

  const createEntranceTrigger = () => {
    if (trigger) return;

    trigger = ScrollTrigger.create({
      trigger: hero,
      start: "top top",
      end: "+=165%",
      scrub: 0.45,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,

      onRefresh: updateStagePosition,

      onUpdate: (self) => {
        scrollDirection = self.direction;

        if (self.direction < 0) {
          hasEnteredShowroom = false;
          isEnteringShowroom = false;
          setEntranceExited(false);
        }

        scrubToProgress(self.progress, self.direction);
      },

      onLeave: () => {
        enterShowroom(true);
      },

      onEnterBack: () => {
        scrollDirection = -1;
        hasEnteredShowroom = false;
        isEnteringShowroom = false;
        setEntranceExited(false);

        playhead.progress = 1;
        renderProgress(false, -1);
      },

      onLeaveBack: () => {
        scrollDirection = -1;
        hasEnteredShowroom = false;
        isEnteringShowroom = false;

        resetPortalVisuals();
      }
    });
  };

  startPortalFromCta = () => {
    scrollDirection = 1;

    playheadTween?.kill();

    playheadTween = gsap.to(playhead, {
      progress: 1,
      duration: 1.1,
      ease: "power2.inOut",
      overwrite: true,
      onUpdate: () => renderProgress(false, 1),
      onComplete: () => enterShowroom(true)
    });
  };

  const onResize = () => {
    updateStagePosition();
    ScrollTrigger.refresh();
  };

  for (const frameNumber of frames) {
    loadFrame(frameNumber);
  }

  if (image.complete) updateStagePosition();
  else image.addEventListener("load", updateStagePosition, { once: true });

  resetPortalVisuals();
  createEntranceTrigger();

  window.addEventListener("resize", onResize);

  cleanup = () => {
    startPortalFromCta = undefined;

    playheadTween?.kill();
    trigger?.kill(true);

    setEntranceExited(false);
    setDoorOpen(false);

    window.removeEventListener("resize", onResize);
  };
});

onBeforeUnmount(() => {
  cleanup?.();
});
</script>

<template>
  <section ref="heroRef" class="entrance-door" aria-label="Kardoor entrance sequence">
    <div ref="zoomLayerRef" class="entrance-door__zoom-layer">
      <img
        ref="imageRef"
        src="/images/homelight.png"
        alt="Modern villa entrance with Kardoor steel door"
        class="entrance-door__image entrance-door__image--day"
        decoding="async"
        loading="eager"
      >

      <img
        src="/images/homenight.jpeg"
        alt=""
        class="entrance-door__image entrance-door__image--night"
        aria-hidden="true"
        decoding="async"
        loading="eager"
      >

      <div ref="stageRef" class="entrance-door__sequence" aria-hidden="true">
        <canvas ref="canvasRef" class="entrance-door__frame" />
      </div>
    </div>

    <div class="entrance-door__copy">
      <p class="entrance-door__eyebrow">
        Manufactured in Türkiye · Supplied Globally
      </p>

      <h1>
        <span>Steel doors</span>
        <span>with architectural</span>
        <span>presence.</span>
      </h1>

      <div class="entrance-door__copy-bottom">
        <p>
          Premium steel entrance doors for villas, residential projects, dealers
          and global supply partners.
        </p>

        <div class="entrance-door__actions" aria-label="Entrance actions">
          <a href="#showroom-dive" @click="enterShowroomFromCta">
            Explore Doors
          </a>

          <NuxtLink to="/request-quote">
            Request Project Quote
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="entrance-door__specs" aria-label="Kardoor highlights">
      <span>01 / Steel Security Doors</span>
      <span>02 / Villa & Project Supply</span>
      <span>03 / Export-Ready Production</span>
    </div>

    <div class="entrance-door__scroll-cue" aria-hidden="true">
      <span>Scroll</span>
      <i />
      <strong>to open</strong>
    </div>

    <div ref="blackoutRef" class="entrance-door__blackout" aria-hidden="true" />
  </section>
</template>
