<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

const heroRef = ref<HTMLElement | null>(null);
const zoomLayerRef = ref<HTMLElement | null>(null);
const imageRef = ref<HTMLImageElement | null>(null);
const stageRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const blackoutRef = ref<HTMLElement | null>(null);

let cleanup: (() => void) | undefined;

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
  let isDoorOpen = false;

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
    const offsetX = (bounds.width - renderedWidth) * (Number.isFinite(xRatio) ? xRatio : 0.5);
    const offsetY = (bounds.height - renderedHeight) * (Number.isFinite(yRatio) ? yRatio : 0);
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

  const renderProgress = () => {
    const progress = Math.min(1, Math.max(0, playhead.progress));
    const sequenceProgress = Math.min(progress / sequenceProgressEnd, 1);
    const frameIndex = Math.min(frames.length - 1, Math.max(0, Math.floor(sequenceProgress * frames.length)));
    const frameNumber = frames[frameIndex] ?? 1;
    targetFrameIndex = frameIndex;

    if (currentFrameIndex !== frameIndex) {
      loadFrame(frameNumber).then((loadedFrame) => {
        if (targetFrameIndex !== frameIndex) return;
        currentFrameIndex = frameIndex;
        drawFrame(loadedFrame);
      });
    }

    const zoomProgress = Math.max(0, (progress - zoomProgressStart) / (blackoutProgressStart - zoomProgressStart));
    const blackoutProgress = easeInOut(
      Math.min(1, Math.max(0, (progress - blackoutProgressStart) / (1 - blackoutProgressStart)))
    );

    updateZoom(zoomProgress);
    hero.style.setProperty("--portal-blackout-opacity", `${blackoutProgress}`);
    setDoorOpen(progress >= sequenceProgressEnd);
  };

  const scrubToProgress = (progress: number) => {
    const targetProgress = Math.min(1, Math.max(0, progress));
    const duration = Math.max(0.1, Math.abs(targetProgress - playhead.progress) * 0.7);

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

  const trigger = ScrollTrigger.create({
    trigger: hero,
    start: "top top",
    end: "+=210%",
    scrub: 0.55,
    pin: true,
    pinSpacing: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    onRefresh: updateStagePosition,
    onUpdate: (self) => scrubToProgress(self.progress),
    onLeave: () => scrubToProgress(1)
  });

  const onResize = () => updateStagePosition();

  for (const frameNumber of frames) loadFrame(frameNumber);
  if (image.complete) updateStagePosition();
  else image.addEventListener("load", updateStagePosition, { once: true });
  renderProgress();
  window.addEventListener("resize", onResize);

  cleanup = () => {
    playheadTween?.kill();
    trigger.kill();
    setDoorOpen(false);
    window.removeEventListener("resize", onResize);
  };
});

onBeforeUnmount(() => cleanup?.());
</script>

<template>
  <section ref="heroRef" class="entrance-door" aria-label="Kardoor entrance sequence">
    <div ref="zoomLayerRef" class="entrance-door__zoom-layer">
      <img
        ref="imageRef"
        src="/images/Gemini_Generated_Image_k7lt3wk7lt3wk7lt.png"
        alt="Modern villa entrance with Kardoor steel door"
        class="entrance-door__image"
        decoding="async"
        loading="eager"
      />

      <div ref="stageRef" class="entrance-door__sequence" aria-hidden="true">
        <canvas ref="canvasRef" class="entrance-door__frame" />
      </div>
    </div>

    <div class="entrance-door__copy">
      <p class="eyebrow">Manufactured in Turkiye · Supplied globally</p>
      <h1>Enter the Kardoor showroom.</h1>
      <p>Step through the door into a product-led steel door experience for global buyers.</p>
    </div>

    <div class="entrance-door__actions" aria-label="Entrance actions">
      <a href="#showroom-dive">Enter Showroom</a>
      <NuxtLink to="/request-quote">Request Quote</NuxtLink>
    </div>

    <div ref="blackoutRef" class="entrance-door__blackout" aria-hidden="true" />
  </section>
</template>
