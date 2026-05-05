<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import type { CSSProperties } from "vue";

type DoorItem = {
  id: string;
  name: string;
  series: string;
  image: string;
  material: string;
  tone: string;
  tags: string[];
};

const doors: DoorItem[] = [
  {
    id: "emerald-line",
    name: "Emerald Line",
    series: "Atelier Series",
    image: "/images/doors/atelier-emerald.png",
    material: "Laminated steel / gold accent",
    tone: "Emerald green · champagne",
    tags: ["Laminoks", "Villa", "Custom size"]
  },
  {
    id: "mono-graphite",
    name: "Mono Graphite",
    series: "Atelier Series",
    image: "/images/doors/atelier-mono-graphite.png",
    material: "Minimal steel surface",
    tone: "Graphite black",
    tags: ["Modern", "Export-ready", "Secure"]
  },
  {
    id: "ivory-line",
    name: "Ivory Line",
    series: "Atelier Series",
    image: "/images/doors/atelier-ivory-line.png",
    material: "Interior premium panel",
    tone: "Warm ivory · brass",
    tags: ["Interior", "Minimal", "Soft tone"]
  },
  {
    id: "graphite-oak",
    name: "Graphite Oak",
    series: "Atelier Series",
    image: "/images/doors/atelier-graphite-oak.png",
    material: "Natural oak / graphite steel",
    tone: "Graphite · light oak",
    tags: ["Architectural", "Wood texture", "Premium"]
  },
  {
    id: "classic-sand",
    name: "Classic Sand",
    series: "Atelier Series",
    image: "/images/doors/atelier-classic-sand.png",
    material: "Classic embossed steel",
    tone: "Sand beige",
    tags: ["Classic", "Metal", "Villa"]
  }
];

const activeIndex = ref(0);
const direction = ref<"next" | "prev">("next");
const isDetailVisible = ref(false);
const isShowroomPaused = ref(false);

const fallbackDoor = doors[0] as DoorItem;

const activeDoor = computed<DoorItem>(() => doors[activeIndex.value] ?? fallbackDoor);

const previousIndex = computed(() =>
  activeIndex.value === 0 ? doors.length - 1 : activeIndex.value - 1
);

const nextIndex = computed(() =>
  activeIndex.value === doors.length - 1 ? 0 : activeIndex.value + 1
);

const goToDoor = (index: number) => {
  if (index === activeIndex.value) return;

  direction.value = index > activeIndex.value ? "next" : "prev";
  activeIndex.value = index;
};

const nextDoor = () => {
  direction.value = "next";
  activeIndex.value = nextIndex.value;
};

const previousDoor = () => {
  direction.value = "prev";
  activeIndex.value = previousIndex.value;
};

const getOrbitStyle = (index: number): CSSProperties =>
  ({
    "--orbit-delay": `${index * -8.4}s`
  }) as CSSProperties;

const pauseShowcase = () => {
  isShowroomPaused.value = true;
  isDetailVisible.value = true;
};

const resumeShowcase = () => {
  isShowroomPaused.value = false;
  isDetailVisible.value = false;
};

const previewDoor = (index: number) => {
  pauseShowcase();
  goToDoor(index);
};

const selectDoor = (index: number) => {
  pauseShowcase();
  goToDoor(index);
};

const selectNextDoor = () => {
  pauseShowcase();
  nextDoor();
};

const selectPreviousDoor = () => {
  pauseShowcase();
  previousDoor();
};

let touchStartX = 0;
let touchStartY = 0;

const onTouchStart = (event: TouchEvent) => {
  touchStartX = event.touches[0]?.clientX ?? 0;
  touchStartY = event.touches[0]?.clientY ?? 0;
};

const onTouchEnd = (event: TouchEvent) => {
  const touch = event.changedTouches[0];

  if (!touch) return;

  const deltaX = touch.clientX - touchStartX;
  const deltaY = touch.clientY - touchStartY;

  if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY)) return;

  if (deltaX < 0) {
    selectNextDoor();
  } else {
    selectPreviousDoor();
  }
};

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === "ArrowRight") selectNextDoor();
  if (event.key === "ArrowLeft") selectPreviousDoor();
};

onMounted(() => {
  window.addEventListener("keydown", onKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown);
});
</script>

<template>
  <section
    class="showroom-dive"
    :class="{
      'showroom-dive--details': isDetailVisible,
      'showroom-dive--paused': isShowroomPaused
    }"
    :data-direction="direction"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
    @mouseleave="resumeShowcase"
  >
    <div class="showroom-dive__wall" aria-hidden="true" />
    <div class="showroom-dive__light" aria-hidden="true" />
    <div class="showroom-dive__floor" aria-hidden="true" />

    <div class="showroom-dive__content">
      <div class="showroom-dive__eyebrow">
        Inside the showroom
      </div>

      <h1 class="showroom-dive__title">
        Explore Kardoor models in one cinematic space.
      </h1>

      <p class="showroom-dive__text">
        Move between selected steel door designs, compare surfaces and continue
        into the full product series.
      </p>

      <div class="showroom-dive__actions">
        <NuxtLink class="showroom-dive__button showroom-dive__button--primary" to="/series">
          View Series
        </NuxtLink>

        <NuxtLink class="showroom-dive__button showroom-dive__button--ghost" to="/request-quote">
          Request Quote
        </NuxtLink>
      </div>
    </div>

    <div class="showroom-dive__stage" aria-live="polite">
      <article
        v-for="(door, index) in doors"
        :key="door.id"
        class="showroom-dive__door-card"
        :class="{ 'showroom-dive__door-card--selected': index === activeIndex }"
        :style="getOrbitStyle(index)"
        tabindex="0"
        @mouseenter="previewDoor(index)"
        @focus="previewDoor(index)"
      >
        <NuxtImg
          class="showroom-dive__door-image"
          :src="door.image"
          :alt="door.name"
          width="520"
          height="820"
          sizes="sm:220px md:320px lg:420px xl:520px"
          densities="1x 2x"
          format="webp"
          :loading="index === activeIndex ? 'eager' : 'lazy'"
          decoding="async"
          draggable="false"
        />
      </article>
    </div>

    <div v-if="activeDoor" class="showroom-dive__product">
      <p class="showroom-dive__series">
        {{ activeDoor.series }}
      </p>

      <h2 class="showroom-dive__product-name">
        {{ activeDoor.name }}
      </h2>

      <p class="showroom-dive__material">
        {{ activeDoor.material }}
      </p>

      <p class="showroom-dive__tone">
        {{ activeDoor.tone }}
      </p>

      <div class="showroom-dive__tags">
        <span
          v-for="tag in activeDoor.tags"
          :key="tag"
          class="showroom-dive__tag"
        >
          {{ tag }}
        </span>
      </div>
    </div>

    <div class="showroom-dive__controls" aria-label="Door carousel controls">
      <button
        class="showroom-dive__arrow"
        type="button"
        aria-label="Previous door"
        @click="selectPreviousDoor"
      >
        ←
      </button>

      <div class="showroom-dive__progress">
        <button
          v-for="(door, index) in doors"
          :key="door.id"
          class="showroom-dive__dot"
          :class="{ 'showroom-dive__dot--active': index === activeIndex }"
          type="button"
          :aria-label="`Show ${door.name}`"
          @click="selectDoor(index)"
        />
      </div>

      <button
        class="showroom-dive__arrow"
        type="button"
        aria-label="Next door"
        @click="selectNextDoor"
      >
        →
      </button>
    </div>
  </section>
</template>
