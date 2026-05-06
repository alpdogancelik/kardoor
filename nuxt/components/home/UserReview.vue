<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { useKardoorLocale } from "~/composables/useKardoorLocale";

type Review = {
  id: number;
  text: string;
  name: string;
};

type RenderedReview = Review & {
  renderKey: string;
};

type TrackState = {
  x: number;
  isDragging: boolean;
  startX: number;
  isHovered: boolean;
  baseSpeed: number;
  currentVelocity: number;
};

const { locale } = useKardoorLocale();

const titleWords = computed(() =>
  locale.value === "tr" ? ["sözü", "kararı", "noktayı"] : ["word", "choice", "final say"]
);
const titleIndex = ref(0);
const titleWidth = ref(0);
const hiddenSpan = ref<HTMLElement | null>(null);

const googleReviews = computed<Review[]>(() =>
  locale.value === "tr"
    ? [
        { id: 1, text: "Kardoor Çelik Kapı ailesi sorunumu özenle dinledi ve çözdü. Güven Bey ve montaj ekibine teşekkür ediyorum. Titizlikle ilgilendiler.", name: "Nadire Ş." },
        { id: 2, text: "Kendi evime ve oğlumun evine kapı yaptırdık. Çok memnun kaldık. Ekip işi beklediğimden hızlı teslim etti.", name: "Ahmet M." },
        { id: 3, text: "Yaptıkları işlerde gerek kalite gerek hız olarak uzun zamandır bu kadar iyi bir firmayla çalışmamıştım. Teşekkürler Kardoor Çelik Kapı.", name: "Mustafa K." },
        { id: 4, text: "İzmir'de dış iklim kapısı ararken Kardoor'u bulduk. Güven Bey çok yardımcı oldu. Kapının yalıtımı ve malzeme kalitesi gerçekten muazzam.", name: "Elif T." },
        { id: 5, text: "Bina giriş kapımızı yeniledik. Cam kapı detayları ve işçilik çok başarılı. Tüm süreçte profesyonel yaklaştılar, tavsiye ederim.", name: "Kemal S." },
        { id: 6, text: "Montaj ekibi söz verdikleri gün ve saatte gelip tertemiz çalıştı. Hem estetik hem de güven veren, sağlam bir yapısı var.", name: "Ayşe Y." },
        { id: 7, text: "Showroom'daki 3D sunum ile evimize uygulanacak kapıyı önceden görmek harikaydı. Sonuç beklediğimizden de şık oldu.", name: "Burak D." },
        { id: 8, text: "Hızlı, net ve profesyonel yaklaşım. İhtiyacımız olan çelik kapı çözümünü doğrudan aldık, fiyat ve performans çok iyi.", name: "Serkan A." }
      ]
    : [
        { id: 1, text: "The Kardoor team listened carefully and solved our issue. Thank you to Guven Bey and the installation crew for their meticulous work.", name: "Nadire S." },
        { id: 2, text: "We ordered doors for my home and my son's home. We were very satisfied, and the team delivered faster than expected.", name: "Ahmet M." },
        { id: 3, text: "Their quality and speed were excellent. I had not worked with such a reliable steel door company in years. Thank you, Kardoor.", name: "Mustafa K." },
        { id: 4, text: "We found Kardoor while looking for an exterior climate door in Izmir. The insulation and material quality are genuinely impressive.", name: "Elif T." },
        { id: 5, text: "We renewed our building entrance door. The glass details and workmanship are very successful, and the whole process felt professional.", name: "Kemal S." },
        { id: 6, text: "The installation team arrived on the promised day and worked cleanly. The door is aesthetic, solid and reassuring.", name: "Ayse Y." },
        { id: 7, text: "Seeing the door for our home through the showroom's 3D presentation was excellent. The final result was even more elegant than expected.", name: "Burak D." },
        { id: 8, text: "Fast, clear and professional. We got exactly the steel door solution we needed, with very good value for performance.", name: "Serkan A." }
      ]
);

const row1 = computed(() => googleReviews.value.slice(0, 4));
const row2 = computed(() => googleReviews.value.slice(4, 8));
const duplicatedRow1 = computed<RenderedReview[]>(() =>
  [...row1.value, ...row1.value].map((review, index) => ({
    ...review,
    renderKey: `row-1-${index}-${review.id}`
  }))
);
const duplicatedRow2 = computed<RenderedReview[]>(() =>
  [...row2.value, ...row2.value].map((review, index) => ({
    ...review,
    renderKey: `row-2-${index}-${review.id}`
  }))
);
const dynamicGap = computed(() => `calc(0.5vw + ${titleWidth.value * 0.005}vw)`);

const inner1 = ref<HTMLElement | null>(null);
const inner2 = ref<HTMLElement | null>(null);

const track1State: TrackState = {
  x: 0,
  isDragging: false,
  startX: 0,
  isHovered: false,
  baseSpeed: 0.4,
  currentVelocity: 0.4
};

const track2State: TrackState = {
  x: 0,
  isDragging: false,
  startX: 0,
  isHovered: false,
  baseSpeed: 0.25,
  currentVelocity: 0.25
};

let activeTrack: number | null = null;
let animationFrameId = 0;
let titleInterval: ReturnType<typeof setInterval> | null = null;

const updateTitleWidth = () => {
  if (!hiddenSpan.value) return;
  titleWidth.value = hiddenSpan.value.getBoundingClientRect().width;
};

const getX = (event: MouseEvent | TouchEvent) => {
  if ("touches" in event) return event.touches[0]?.pageX ?? 0;
  return event.pageX;
};

const animate = () => {
  [
    { state: track1State, inner: inner1.value },
    { state: track2State, inner: inner2.value }
  ].forEach(({ state, inner }) => {
    if (!inner) return;

    const halfWidth = inner.scrollWidth / 2;

    if (!state.isDragging) {
      const targetVelocity = state.isHovered ? 0 : state.baseSpeed;
      state.currentVelocity += (targetVelocity - state.currentVelocity) * 0.04;
      state.x -= state.currentVelocity;
    }

    if (state.x <= -halfWidth) {
      state.x += halfWidth;
    } else if (state.x > 0) {
      state.x -= halfWidth;
    }

    inner.style.transform = `translateX(${state.x}px)`;
  });

  animationFrameId = requestAnimationFrame(animate);
};

const startDrag = (event: MouseEvent | TouchEvent, trackNum: number) => {
  activeTrack = trackNum;
  const state = trackNum === 1 ? track1State : track2State;

  state.isDragging = true;
  state.startX = getX(event);
  document.body.style.cursor = "grabbing";
};

const onDrag = (event: MouseEvent | TouchEvent) => {
  if (activeTrack === null) return;

  const state = activeTrack === 1 ? track1State : track2State;
  if (!state.isDragging) return;

  const currentX = getX(event);
  state.x += currentX - state.startX;
  state.startX = currentX;
};

const endDrag = () => {
  track1State.isDragging = false;
  track2State.isDragging = false;
  activeTrack = null;
  document.body.style.cursor = "";
};

const setHover = (value: boolean, trackNum: number) => {
  const state = trackNum === 1 ? track1State : track2State;
  state.isHovered = value;
};

const tiltCard = (event: MouseEvent) => {
  const card = event.currentTarget as HTMLElement;
  const box = card.getBoundingClientRect();
  const x = event.clientX - box.left;
  const y = event.clientY - box.top;

  card.style.setProperty("--x", `${x}px`);
  card.style.setProperty("--y", `${y}px`);
  card.style.setProperty("--rx", `${(box.height / 2 - y) / 15}deg`);
  card.style.setProperty("--ry", `${(x - box.width / 2) / 20}deg`);
  card.classList.add("tilting");
};

const resetTilt = (event: MouseEvent) => {
  const card = event.currentTarget as HTMLElement;

  card.classList.remove("tilting");
  card.style.setProperty("--rx", "0deg");
  card.style.setProperty("--ry", "0deg");
};

onMounted(() => {
  updateTitleWidth();
  window.addEventListener("resize", updateTitleWidth);

  titleInterval = setInterval(() => {
    titleIndex.value = (titleIndex.value + 1) % titleWords.value.length;
    void nextTick(updateTitleWidth);
  }, 2500);

  track2State.x = -400;
  animate();

  window.addEventListener("mousemove", onDrag);
  window.addEventListener("mouseup", endDrag);
  window.addEventListener("touchmove", onDrag, { passive: false });
  window.addEventListener("touchend", endDrag);
});

onBeforeUnmount(() => {
  if (titleInterval) clearInterval(titleInterval);
  cancelAnimationFrame(animationFrameId);

  window.removeEventListener("resize", updateTitleWidth);
  window.removeEventListener("mousemove", onDrag);
  window.removeEventListener("mouseup", endDrag);
  window.removeEventListener("touchmove", onDrag);
  window.removeEventListener("touchend", endDrag);
  document.body.style.cursor = "";
});
</script>

<template>
  <section class="user-review-section">
    <div class="user-review-title-area">
      <h2 class="user-review-title rotating-title">
        <span class="top-row" :style="{ gap: dynamicGap }">
          <span class="static-text">{{ locale === "tr" ? "Son" : "We leave the" }}</span>

          <span class="rotating-text-wrapper" :style="{ width: `${titleWidth}px` }">
            <span ref="hiddenSpan" class="hidden-measure">{{ titleWords[titleIndex] }}</span>

            <TransitionGroup name="slide-word" tag="span" class="word-slider">
              <span :key="titleWords[titleIndex]" class="word-slide-item">
                {{ titleWords[titleIndex] }}
              </span>
            </TransitionGroup>
          </span>
        </span>

        <span class="bottom-row">{{ locale === "tr" ? "size bırakıyoruz." : "to you." }}</span>
      </h2>

      <div class="user-review-gradient-mask" aria-hidden="true" />
    </div>

    <div class="user-review-carousel-area">
      <div
        class="user-review-track"
        @mousedown.prevent="startDrag($event, 1)"
        @touchstart="startDrag($event, 1)"
        @mouseenter="setHover(true, 1)"
        @mouseleave="setHover(false, 1)"
      >
        <div ref="inner1" class="user-review-track-inner">
          <article
            v-for="review in duplicatedRow1"
            :key="review.renderKey"
            class="review-card"
            @mousemove="tiltCard"
            @mouseleave="resetTilt"
          >
            <p class="quote">"{{ review.text }}"</p>
            <div class="author">
              <div class="author-info">
                <span class="name">{{ review.name }}</span>
                <span class="rating" :aria-label="locale === 'tr' ? '5 yıldız' : '5 stars'">★★★★★</span>
              </div>
            </div>
          </article>
        </div>
      </div>

      <div
        class="user-review-track"
        @mousedown.prevent="startDrag($event, 2)"
        @touchstart="startDrag($event, 2)"
        @mouseenter="setHover(true, 2)"
        @mouseleave="setHover(false, 2)"
      >
        <div ref="inner2" class="user-review-track-inner">
          <article
            v-for="review in duplicatedRow2"
            :key="review.renderKey"
            class="review-card"
            @mousemove="tiltCard"
            @mouseleave="resetTilt"
          >
            <p class="quote">"{{ review.text }}"</p>
            <div class="author">
              <div class="author-info">
                <span class="name">{{ review.name }}</span>
                <span class="rating" :aria-label="locale === 'tr' ? '5 yıldız' : '5 stars'">★★★★★</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>
