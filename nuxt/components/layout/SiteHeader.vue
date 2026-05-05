<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute } from "#imports";

type HeaderLocale = "TR" | "EN";

const route = useRoute();
const { isNight, toggleMode } = useShowroomAmbience();

const isScrolled = ref(false);
const activeLocale = ref<HeaderLocale>("EN");

const navItems = [
  { to: "/", label: "Home" },
  { to: "/doors", label: "Doors" },
  { to: "/series", label: "Series" },
  { to: "/production", label: "Production" },
  { to: "/export", label: "Export" },
  { to: "/company", label: "Company" },
  { to: "/contact", label: "Contact" }
];

const locales: HeaderLocale[] = ["TR", "EN"];

const isActive = (to: string) => {
  if (to === "/") return route.path === "/";

  return route.path.startsWith(to);
};

const headerClass = computed(() => ({
  "site-header--scrolled": isScrolled.value,
  "site-header--night": isNight.value
}));

const ambienceToggleLabel = computed(() =>
  isNight.value ? "Switch to light mode" : "Switch to dark mode"
);

const setLocale = (locale: HeaderLocale) => {
  activeLocale.value = locale;
};

const onScroll = () => {
  isScrolled.value = window.scrollY > 24;
};

onMounted(() => {
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
});
</script>

<template>
  <header class="site-header" :class="headerClass">
    <div class="site-header__inner">
      <NuxtLink class="site-header__brand" to="/" aria-label="Kardoor home">
        <BrandMark />
      </NuxtLink>

      <nav class="site-header__nav" aria-label="Primary navigation">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          class="site-header__nav-link"
          :class="{ 'is-active': isActive(item.to) }"
          :to="item.to"
          :aria-current="isActive(item.to) ? 'page' : undefined"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="site-header__utility" aria-label="Header utilities">
        <button
          class="site-header__icon-button site-header__ambience"
          type="button"
          :aria-label="ambienceToggleLabel"
          :aria-pressed="isNight"
          :title="ambienceToggleLabel"
          @click="toggleMode"
        >
          <span class="site-header__bulb" aria-hidden="true">
            <span class="site-header__bulb-glass" />
            <span class="site-header__bulb-base" />
          </span>
        </button>

        <div class="site-header__language" aria-label="Language selector">
          <button
            v-for="locale in locales"
            :key="locale"
            class="site-header__language-button"
            :class="{ 'is-active': activeLocale === locale }"
            type="button"
            :aria-label="`Switch interface language to ${locale}`"
            :aria-pressed="activeLocale === locale"
            @click="setLocale(locale)"
          >
            {{ locale }}
          </button>
        </div>

        <NuxtLink
          class="site-header__utility-link site-header__utility-link--catalog"
          to="/catalog"
          aria-label="Open catalogue"
        >
          Catalogue
        </NuxtLink>

        <NuxtLink
          class="site-header__utility-link site-header__utility-link--quote"
          to="/request-quote"
          aria-label="Request a quote"
        >
          Quote
        </NuxtLink>

        <button
          class="site-header__icon-button site-header__menu"
          type="button"
          aria-label="Open menu"
        >
          <span />
          <span />
        </button>
      </div>
    </div>
  </header>
</template>
