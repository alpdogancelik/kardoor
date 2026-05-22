<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useKardoorLocale } from "~/composables/useKardoorLocale";

type ShowroomDoor = {
  id: string;
  name: string;
  series: string;
  image: string;
  fallbackImage: string;
};

const { locale } = useKardoorLocale();
const nuxtApp = useNuxtApp();

const frameCount = 120;
const croppedRenderDoorRect = { x: 0, y: 0, width: 225, height: 493 };
const fullRenderDoorRect = { x: 846, y: 316, width: 225, height: 493 };
const imageKitBaseUrl = "https://ik.imagekit.io/kardoor";
const imageKitSeriesImages = {
  emeraldLine: `${imageKitBaseUrl}/series/4.png?updatedAt=1778762645568`,
  monoGraphite: `${imageKitBaseUrl}/series/5.png?updatedAt=1778762645583`,
  ivoryLine: `${imageKitBaseUrl}/series/1.png?updatedAt=1778762643897`,
  graphiteOak: `${imageKitBaseUrl}/series/2.png?updatedAt=1778762645386`,
  classicSand: `${imageKitBaseUrl}/series/3.png?updatedAt=1778762644382`
} as const;
const imageKitHomeImages = {
  day: `${imageKitBaseUrl}/homelight.png?updatedAt=1779402057000`,
  night: `${imageKitBaseUrl}/homenight.png?updatedAt=1779402057000`
} as const;
const doorRenderUpdatedAt = "1778792850469";

const heroRef = ref<HTMLElement | null>(null);
const zoomLayerRef = ref<HTMLElement | null>(null);
const imageRef = ref<HTMLImageElement | null>(null);
const stageRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const blackoutRef = ref<HTMLElement | null>(null);
const showroomTrackRef = ref<HTMLElement | null>(null);

let cleanup: (() => void) | undefined;

const showroomDoors = computed<ShowroomDoor[]>(() => [
  {
    id: "emerald-line",
    name: "Emerald Line",
    series: locale.value === "tr" ? "Atelier Serisi" : "Atelier Series",
    image: imageKitSeriesImages.emeraldLine,
    fallbackImage: imageKitSeriesImages.emeraldLine
  },
  {
    id: "mono-graphite",
    name: "Mono Graphite",
    series: locale.value === "tr" ? "Atelier Serisi" : "Atelier Series",
    image: imageKitSeriesImages.monoGraphite,
    fallbackImage: imageKitSeriesImages.monoGraphite
  },
  {
    id: "ivory-line",
    name: "Ivory Line",
    series: locale.value === "tr" ? "Atelier Serisi" : "Atelier Series",
    image: imageKitSeriesImages.ivoryLine,
    fallbackImage: imageKitSeriesImages.ivoryLine
  },
  {
    id: "graphite-oak",
    name: "Graphite Oak",
    series: locale.value === "tr" ? "Atelier Serisi" : "Atelier Series",
    image: imageKitSeriesImages.graphiteOak,
    fallbackImage: imageKitSeriesImages.graphiteOak
  },
  {
    id: "classic-sand",
    name: "Classic Sand",
    series: locale.value === "tr" ? "Atelier Serisi" : "Atelier Series",
    image: imageKitSeriesImages.classicSand,
    fallbackImage: imageKitSeriesImages.classicSand
  }
]);

const firstShowroomDoor = computed(() => showroomDoors.value[0]);

const useLocalImageFallback = (event: Event) => {
  const image = event.currentTarget as HTMLImageElement | null;
  const fallback = image?.dataset.fallbackSrc;

  if (!image || !fallback || image.src.endsWith(fallback)) return;

  image.src = fallback;
};

const copy = computed(() =>
  locale.value === "tr"
    ? {
        sectionLabel: "Kardoor giris ve showroom animasyonu",
        imageAlt: "Kardoor celik kapili modern villa girisi",
        titleLine: "Hayallerinize",
        accent: "Açılan",
        suffix: "Kapı",
        scroll: "Kaydır",
        ctaTitle: "Güvenle açılan kapılar"
      }
    : {
        sectionLabel: "Kardoor entrance and showroom sequence",
        imageAlt: "Modern villa entrance with Kardoor steel door",
        titleLine: "The Door",
        accent: "to Your",
        suffix: "Dreams",
        scroll: "Scroll",
        ctaTitle: "See more models"
      }
);

onMounted(() => {
  const hero = heroRef.value;
  const zoomLayer = zoomLayerRef.value;
  const image = imageRef.value;
  const stage = stageRef.value;
  const canvas = canvasRef.value;
  const blackout = blackoutRef.value;
  const showroomTrack = showroomTrackRef.value;

  if (!hero || !zoomLayer || !image || !stage || !canvas || !blackout || !showroomTrack) return;

  gsap.registerPlugin(ScrollTrigger);

  const context = canvas.getContext("2d");
  if (!context) return;

  const frames = Array.from({ length: frameCount }, (_, index) => index + 1);
  const loadedFrames = new Map<number, HTMLImageElement>();
  const pendingFrames = new Map<number, Promise<HTMLImageElement>>();
  const playhead = { progress: 0 };
  const doorRect = { x: 729, y: 270, width: 195, height: 426 };

  const portalDuration = 0.4;
  const introPortion = portalDuration;
  const sequenceProgressEnd = 0.5;
  const zoomProgressStart = 0.0;
  const blackoutProgressStart = 1.0;
  const sequenceEndMaster = introPortion * sequenceProgressEnd;
  const expandEndMaster = introPortion;
  const horizontalStart = expandEndMaster;

  let currentFrameIndex = -1;
  let targetFrameIndex = 0;
  let playheadTween: ReturnType<typeof gsap.to> | null = null;
  let trigger: ReturnType<typeof ScrollTrigger.create> | null = null;
  let preloadTimer: number | null = null;
  let fallbackScanTimer: number | null = null;
  let isDoorOpen = false;
  let isShowroomReady = false;
  let pageShowCleanup: (() => void) | null = null;

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
    `${imageKitBaseUrl}/doorrender1/${String(frameNumber).padStart(4, "0")}.png?updatedAt=${doorRenderUpdatedAt}`;

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

  const getRenderDoorRect = (source: HTMLImageElement) => {
    const canUseFullRenderCrop =
      source.naturalWidth >= fullRenderDoorRect.x + fullRenderDoorRect.width &&
      source.naturalHeight >= fullRenderDoorRect.y + fullRenderDoorRect.height;

    return canUseFullRenderCrop ? fullRenderDoorRect : croppedRenderDoorRect;
  };

  const preloadAdjacentFrames = (frameIndex: number) => {
    for (const offset of [-2, -1, 1, 2]) {
      const nearbyFrameNumber = frames[frameIndex + offset];
      if (nearbyFrameNumber) loadFrame(nearbyFrameNumber).catch(() => undefined);
    }
  };

  const warmFrameCache = () => {
    const priorityFrames = [
      1,
      Math.round(frames.length * 0.25),
      Math.round(frames.length * 0.5),
      Math.round(frames.length * 0.75),
      frames.length
    ];

    const preloadQueue = Array.from(new Set([...priorityFrames, ...frames]));
    let queueIndex = 0;

    const preloadNext = () => {
      const frameNumber = preloadQueue[queueIndex];
      queueIndex += 1;

      if (!frameNumber) {
        preloadTimer = null;
        return;
      }

      loadFrame(frameNumber).catch(() => undefined);
      preloadTimer = window.setTimeout(preloadNext, 45);
    };

    preloadNext();
  };

  const preloadFirstShowroomDoor = () => {
    const firstDoor = showroomDoors.value[0];
    if (!firstDoor) {
      isShowroomReady = true;
      return;
    }

    const preload = new Image();
    preload.decoding = "async";
    preload.src = firstDoor.image;

    const markReady = () => {
      isShowroomReady = true;
      updateMasterProgress(playhead.progress);
    };

    if (preload.complete) {
      markReady();
      return;
    }

    (preload.decode ? preload.decode() : Promise.resolve())
      .then(markReady)
      .catch(() => {
        preload.onload = markReady;
        preload.onerror = markReady;
      });
  };

  const drawFrame = (source: HTMLImageElement) => {
    const displayWidth = Math.max(1, Math.round(stage.clientWidth));
    const displayHeight = Math.max(1, Math.round(stage.clientHeight));
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const canvasWidth = Math.max(1, Math.round(displayWidth * pixelRatio));
    const canvasHeight = Math.max(1, Math.round(displayHeight * pixelRatio));

    if (canvas.width !== canvasWidth) canvas.width = canvasWidth;
    if (canvas.height !== canvasHeight) canvas.height = canvasHeight;

    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.clearRect(0, 0, displayWidth, displayHeight);

    const renderDoorRect = getRenderDoorRect(source);

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
    const zoomOriginXPx = offsetX + (doorRect.x + doorRect.width * 0.5) * scale;
    const zoomOriginYPx = offsetY + (doorRect.y + doorRect.height * 0.5) * scale;
    const zoomOriginX = `${zoomOriginXPx}px`;
    const zoomOriginY = `${zoomOriginYPx}px`;
    const doorCenterX = zoomOriginX;
    const doorCenterY = zoomOriginY;

    const doorLeftPx = offsetX + doorRect.x * scale;
    const doorTopPx = offsetY + doorRect.y * scale;

    stage.style.setProperty("--door-left", `${doorLeftPx}px`);
    stage.style.setProperty("--door-top", `${doorTopPx}px`);
    stage.style.setProperty("--door-width", `${stageWidth}px`);
    stage.style.setProperty("--door-height", `${stageHeight}px`);
    zoomLayer.style.setProperty("--zoom-origin-x", zoomOriginX);
    zoomLayer.style.setProperty("--zoom-origin-y", zoomOriginY);
    hero.style.setProperty("--zoom-origin-x", zoomOriginX);
    hero.style.setProperty("--zoom-origin-y", zoomOriginY);
    hero.style.setProperty("--door-center-x", doorCenterX);
    hero.style.setProperty("--door-center-y", doorCenterY);

    const currentFrame = loadedFrames.get(frames[currentFrameIndex] ?? 1);
    if (currentFrame) drawFrame(currentFrame);
  };

  const easeInOut = (value: number) => value * value * (3 - 2 * value);

  const updateZoom = (progress: number) => {
    const clamped = Math.min(1, Math.max(0, progress));
    const eased = clamped * clamped;

    zoomLayer.style.setProperty("--hero-zoom-scale", `${1 + eased * 1.1}`);
    zoomLayer.style.setProperty("--hero-zoom-brightness", `${1 - eased * 0.12}`);
    stage.style.opacity = `${1 - Math.max(0, clamped - 0.92) / 0.08}`;
  };

  const updateContentState = (progress: number) => {
    const copyFade = easeInOut(Math.min(1, Math.max(0, (progress - 0.08) / 0.28)));
    const cueFade = easeInOut(Math.min(1, Math.max(0, progress / 0.22)));

    hero.style.setProperty("--entrance-copy-opacity", `${1 - copyFade}`);
    hero.style.setProperty("--entrance-copy-y", `${copyFade * -24}px`);
    hero.style.setProperty("--entrance-cue-opacity", `${1 - cueFade}`);
  };

  const updateEntranceProgress = (progress: number) => {
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
        preloadAdjacentFrames(frameIndex);
      });
    }

    const zoomProgress = Math.max(
      0,
      (progress - zoomProgressStart) / (blackoutProgressStart - zoomProgressStart)
    );
    const blackoutProgress = easeInOut(
      Math.min(1, Math.max(0, (progress - blackoutProgressStart) / (1 - blackoutProgressStart)))
    );

    updateZoom(zoomProgress);
    updateContentState(progress);
    hero.style.setProperty("--portal-blackout-opacity", `${blackoutProgress}`);
    hero.style.setProperty("--doorway-opacity", "1");
    hero.style.setProperty("--frame-fade", "1");
    setDoorOpen(progress >= sequenceProgressEnd);
  };

  const updateMasterProgress = (masterProgress: number) => {
    const progress = Math.min(1, Math.max(0, masterProgress));

    // First play the full 120-frame door opening, then zoom into the doorway.
    const entranceProgress = Math.min(1, progress / introPortion);
    const showroomProgress = Math.min(
      1,
      Math.max(0, (progress - horizontalStart) / (1 - horizontalStart))
    );

    const portalProgress = easeInOut(
      Math.min(1, Math.max(0, (progress - sequenceEndMaster) / (expandEndMaster - sequenceEndMaster)))
    );
    const showroomContentProgress = easeInOut(
      Math.min(1, Math.max(0, (portalProgress - 0.82) / 0.18))
    );
    const frameZoomEased = portalProgress * 24;
    const overlayFade = 1 - easeInOut(Math.min(1, Math.max(0, (portalProgress - 0.08) / 0.34)));

    const distance = Math.max(0, showroomTrack.scrollWidth - window.innerWidth);

    hero.style.removeProperty("--showroom-clip");

    updateEntranceProgress(entranceProgress);

    // Override updateZoom's hero-zoom-scale with our phased value
    zoomLayer.style.setProperty("--hero-zoom-scale", `${1 + frameZoomEased}`);
    zoomLayer.style.setProperty("--hero-zoom-brightness", `${1 - portalProgress * 0.18}`);

    showroomTrack.style.setProperty("--track-x", `${-distance * showroomProgress}px`);
    hero.style.setProperty("--showroom-opacity", `${portalProgress}`);
    hero.style.setProperty("--showroom-backdrop-opacity", `${portalProgress}`);
    hero.style.setProperty("--showroom-content-opacity", `${showroomContentProgress}`);
    hero.style.setProperty("--showroom-reveal", `${portalProgress}`);
    hero.style.setProperty(
      "--showroom-scale",
      `${0.15 + portalProgress * 0.85}`
    );
    hero.style.setProperty("--showroom-blur", "0px");
    hero.style.setProperty("--entrance-overlay-opacity", `${overlayFade}`);
    const introFade = portalProgress < 0.72 ? 1 : 1 - (portalProgress - 0.72) / 0.28;
    hero.style.setProperty("--intro-opacity", `${introFade}`);
    hero.style.setProperty("--portal-blackout-opacity", "0");
    hero.classList.toggle("entrance-door--showroom", portalProgress >= 0.99);
  };

  const scrubToMasterProgress = (progress: number) => {
    const targetProgress = Math.min(1, Math.max(0, progress));
    const duration = Math.max(0.08, Math.abs(targetProgress - playhead.progress) * 0.5);

    playheadTween?.kill();
    playheadTween = gsap.to(playhead, {
      progress: targetProgress,
      duration,
      ease: "none",
      overwrite: true,
      onUpdate: () => updateMasterProgress(playhead.progress),
      onComplete: () => updateMasterProgress(playhead.progress)
    });
  };

  const resetPortalVisuals = () => {
    playheadTween?.kill();
    playheadTween = null;
    playhead.progress = 0;
    targetFrameIndex = 0;
    currentFrameIndex = -1;
    showroomTrack.style.setProperty("--track-x", "0px");
    hero.classList.remove("entrance-door--showroom");
    hero.style.setProperty("--showroom-opacity", "0");
    hero.style.setProperty("--showroom-backdrop-opacity", "0");
    hero.style.setProperty("--showroom-content-opacity", "0");
    hero.style.setProperty("--intro-opacity", "1");
    hero.style.setProperty("--entrance-overlay-opacity", "1");
    updateZoom(0);
    updateContentState(0);
    hero.style.setProperty("--portal-blackout-opacity", "0");
    hero.style.setProperty("--showroom-reveal", "0");
    hero.style.setProperty("--showroom-scale", "0.15");
    hero.style.setProperty("--showroom-blur", "0px");
    hero.style.removeProperty("--showroom-clip");
    hero.style.setProperty("--doorway-opacity", "0");
    hero.style.setProperty("--frame-fade", "1");
    stage.style.opacity = "1";
    setDoorOpen(false);

    loadFrame(1).then((loadedFrame) => {
      targetFrameIndex = 0;
      currentFrameIndex = 0;
      drawFrame(loadedFrame);
    });
  };

  const resetEntranceScroll = () => {
    window.history.scrollRestoration = "manual";
    nuxtApp.$lenis?.scrollTo?.(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    trigger?.scroll(0);
    trigger?.refresh();
    ScrollTrigger.refresh();
    ScrollTrigger.update();
  };

  const createEntranceTrigger = () => {
    if (trigger) return;

    trigger = ScrollTrigger.create({
      trigger: hero,
      start: "top top",
      end: () => `+=${Math.max(window.innerHeight * 5.2, showroomTrack.scrollWidth + 1400)}`,
      scrub: 0.55,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onRefresh: () => {
        updateStagePosition();
        updateMasterProgress(playhead.progress);
      },
      onUpdate: (self) => {
        playheadTween?.kill();
        playheadTween = null;
        playhead.progress = self.progress;
        updateMasterProgress(playhead.progress);
      },
      onLeaveBack: () => {
        resetPortalVisuals();
      }
    });
  };

  const restoreBrokenFallbackImages = () => {
    hero.querySelectorAll<HTMLImageElement>("img[data-fallback-src]").forEach((fallbackImage) => {
      const fallback = fallbackImage.dataset.fallbackSrc;

      if (fallback && fallbackImage.complete && fallbackImage.naturalWidth === 0) {
        fallbackImage.src = fallback;
      }
    });
  };

  const onResize = () => {
    updateStagePosition();
    updateMasterProgress(playhead.progress);
    ScrollTrigger.refresh();
  };

  if (image.complete) updateStagePosition();
  else image.addEventListener("load", updateStagePosition, { once: true });

  resetPortalVisuals();
  resetEntranceScroll();
  warmFrameCache();
  preloadFirstShowroomDoor();
  createEntranceTrigger();
  resetEntranceScroll();
  requestAnimationFrame(restoreBrokenFallbackImages);
  fallbackScanTimer = window.setTimeout(restoreBrokenFallbackImages, 1400);
  window.addEventListener("resize", onResize);
  const onPageShow = () => {
    resetPortalVisuals();
    resetEntranceScroll();
    requestAnimationFrame(() => {
      updateStagePosition();
      resetPortalVisuals();
      ScrollTrigger.refresh();
    });
  };
  window.addEventListener("pageshow", onPageShow);
  pageShowCleanup = () => window.removeEventListener("pageshow", onPageShow);

  cleanup = () => {
    playheadTween?.kill();
    trigger?.kill(true);
    if (preloadTimer) window.clearTimeout(preloadTimer);
    if (fallbackScanTimer) window.clearTimeout(fallbackScanTimer);
    pageShowCleanup?.();
    setDoorOpen(false);
    window.removeEventListener("resize", onResize);
  };
});

onBeforeUnmount(() => {
  cleanup?.();
});
</script>

<template>
  <section ref="heroRef" class="entrance-door" :aria-label="copy.sectionLabel">
    <div class="entrance-door__showroom" aria-live="polite">
      <div ref="showroomTrackRef" class="entrance-door__showroom-track">
        <article
          v-for="(door, index) in showroomDoors"
          :key="door.id"
          class="entrance-door__showroom-panel"
        >
          <div class="entrance-door__showroom-spotlight" aria-hidden="true" />
          <h2 class="entrance-door__showroom-title">
            {{ door.name }}
          </h2>
          <p class="entrance-door__showroom-series">
            {{ door.series }}
          </p>
          <div class="entrance-door__showroom-door">
            <img
              class="entrance-door__showroom-image"
              :src="door.image"
              :alt="door.name"
              :data-fallback-src="door.fallbackImage"
              width="520"
              height="820"
              :loading="index === 0 ? 'eager' : 'lazy'"
              :fetchpriority="index === 0 ? 'high' : 'auto'"
              decoding="async"
              draggable="false"
              @error="useLocalImageFallback"
            />
          </div>
          <div class="entrance-door__showroom-glow" aria-hidden="true" />
        </article>

        <div class="entrance-door__showroom-panel entrance-door__showroom-panel--cta">
          <div class="entrance-door__showroom-spotlight" aria-hidden="true" />
          <h2 class="entrance-door__showroom-cta">
            {{ copy.ctaTitle }}
          </h2>
          <div class="entrance-door__showroom-glow" aria-hidden="true" />
        </div>
      </div>
    </div>

    <div ref="zoomLayerRef" class="entrance-door__zoom-layer">
      <img
        ref="imageRef"
        :src="imageKitHomeImages.day"
        :alt="copy.imageAlt"
        class="entrance-door__image entrance-door__image--day"
        decoding="async"
        loading="eager"
      >

      <img
        :src="imageKitHomeImages.night"
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
      <h1>
        <span>{{ copy.titleLine }}</span>
        <span><span class="entrance-door__title-accent">{{ copy.accent }}</span> {{ copy.suffix }}</span>
      </h1>
    </div>

    <div class="entrance-door__scroll-cue" aria-hidden="true">
      <span>{{ copy.scroll }}</span>
      <i />
    </div>

    <div ref="blackoutRef" class="entrance-door__blackout" aria-hidden="true" />
  </section>
</template>
