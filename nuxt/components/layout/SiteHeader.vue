<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "#imports";

const route = useRoute();
const { isNight, toggleMode } = useShowroomAmbience();
const { locale, locales, localeLabels, setLocale } = useKardoorLocale();

const isScrolled = ref(false);
const isMenuOpen = ref(false);
const menuButtonRef = ref<HTMLButtonElement | null>(null);

const navItems = computed(() => {
  const labels = {
    tr: {
      home: "Ana Sayfa",
      doors: "Kapılar",
      series: "Seriler",
      production: "Üretim",
      catalog: "Katalog",
      export: "İhracat",
      company: "Kurumsal",
      contact: "İletişim"
    },
    en: {
      home: "Home",
      doors: "Doors",
      series: "Series",
      production: "Production",
      catalog: "Catalogue",
      export: "Export",
      company: "Company",
      contact: "Contact"
    }
  }[locale.value];

  return [
    { to: "/", label: labels.home },
    { to: "/doors", label: labels.doors },
    { to: "/series", label: labels.series },
    { to: "/production", label: labels.production },
    { to: "/catalog", label: labels.catalog },
    { to: "/export", label: labels.export },
    { to: "/company", label: labels.company },
    { to: "/contact", label: labels.contact }
  ];
});

const isActive = (to: string) => {
  if (to === "/") return route.path === "/";

  return route.path.startsWith(to);
};

const headerClass = computed(() => ({
  "site-header--scrolled": isScrolled.value,
  "site-header--night": isNight.value,
  "site-header--menu-open": isMenuOpen.value
}));

const ambienceToggleLabel = computed(() =>
  locale.value === "tr"
    ? isNight.value
      ? "Aydınlık moda geç"
      : "Karanlık moda geç"
    : isNight.value
      ? "Switch to light mode"
      : "Switch to dark mode"
);

const brandLabel = computed(() =>
  locale.value === "tr" ? "Kardoor ana sayfa" : "Kardoor home"
);

const primaryNavLabel = computed(() =>
  locale.value === "tr" ? "Ana navigasyon" : "Primary navigation"
);

const utilitiesLabel = computed(() =>
  locale.value === "tr" ? "Header araçları" : "Header utilities"
);

const languageLabel = computed(() =>
  locale.value === "tr" ? "Dil seçici" : "Language selector"
);

const menuLabel = computed(() =>
  isMenuOpen.value
    ? locale.value === "tr"
      ? "Header menüyü kapat"
      : "Close header navigation"
    : locale.value === "tr"
      ? "Header menüyü aç"
      : "Open header navigation"
);

const mobileNavLabel = computed(() =>
  locale.value === "tr" ? "Mobil navigasyon" : "Mobile navigation"
);

const getLanguageSwitchLabel = (nextLocale: typeof locales[number]) =>
  locale.value === "tr"
    ? `Arayüz dilini ${localeLabels[nextLocale]} yap`
    : `Switch interface language to ${localeLabels[nextLocale]}`;

const closeMenu = () => {
  if (!isMenuOpen.value) return;

  const activeElement = document.activeElement;

  if (activeElement instanceof HTMLElement && activeElement.closest("#site-mobile-menu")) {
    menuButtonRef.value?.focus();
  }

  isMenuOpen.value = false;
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const onScroll = () => {
  isScrolled.value = window.scrollY > 24;
};

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") closeMenu();
};

onMounted(() => {
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("keydown", onKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("keydown", onKeydown);
});

watch(
  () => route.fullPath,
  () => {
    closeMenu();
  }
);
</script>

<template>
  <header class="site-header" :class="headerClass">
    <div class="site-header__inner">
      <NuxtLink class="site-header__brand" to="/" :aria-label="brandLabel">
        <BrandMark />
      </NuxtLink>

      <nav
        id="site-primary-nav"
        class="site-header__nav"
        :aria-label="primaryNavLabel"
        :aria-hidden="!isMenuOpen"
        :inert="!isMenuOpen"
      >
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

      <div class="site-header__utility" :aria-label="utilitiesLabel">
        <button
          class="site-header__icon-button site-header__ambience"
          type="button"
          :aria-label="ambienceToggleLabel"
          :aria-pressed="isNight"
          :title="ambienceToggleLabel"
          @click="toggleMode"
        >
          <span class="site-header__bulb" aria-hidden="true">
            <svg viewBox="0 0 57.876 57.876" focusable="false">
              <path
                style="fill:#DCE0E8;"
                d="M28.938,0c-9.004,0-19,4.126-19,17.876c0,15.333,11,22.698,11,27.067v0.933h8h8v-0.933 c0-4.369,11-11.734,11-27.067C47.938,4.126,37.942,0,28.938,0z"
              />
              <path
                style="fill:#86d5e4;"
                d="M28.938,0c-9.004,0-19,4.126-19,17.876h38C47.938,4.126,37.942,0,28.938,0z"
              />
              <rect x="20.938" y="49.876" style="fill:#86d5e4;" width="16" height="4" />
              <rect x="20.938" y="45.876" style="fill:#C7CAC7;" width="16" height="4" />
              <polygon style="fill:#C7CAC7;" points="31.938,57.876 25.938,57.876 22.938,53.876 34.938,53.876 " />
              <path
                style="fill:#FFFFFF;"
                d="M16.938,15.876c-0.552,0-1-0.447-1-1c0-4.411,3.589-8,8-8c0.552,0,1,0.447,1,1s-0.448,1-1,1 c-3.309,0-6,2.691-6,6C17.938,15.429,17.49,15.876,16.938,15.876z"
              />
              <path
                style="fill:#B2B5C8;"
                d="M21.973,36.196c1.155,1.632,2.225,3.145,2.965,9.68h8c0.74-6.535,1.81-8.048,2.965-9.68 c3.124-4.417,6.035-9.913,6.035-18.32h-26C15.938,26.283,18.849,31.779,21.973,36.196z"
              />
              <path
                style="fill:#DCE0E8;"
                d="M27.938,45.876c-0.777-8.314-1.083-9.875-2.092-11.99c-1.755-3.682-2.961-7.014-3.908-16.01h14 c-0.947,8.995-2.034,12.387-3.907,16.009c-1.051,2.033-1.316,3.677-2.093,11.991H27.938z"
              />
            </svg>
          </span>
        </button>

        <div class="site-header__language" :aria-label="languageLabel">
          <button
            v-for="availableLocale in locales"
            :key="availableLocale"
            class="site-header__language-button"
            :class="{ 'is-active': locale === availableLocale }"
            type="button"
            :aria-label="getLanguageSwitchLabel(availableLocale)"
            :aria-pressed="locale === availableLocale"
            @click="setLocale(availableLocale)"
          >
            {{ localeLabels[availableLocale] }}
          </button>
        </div>

        <button
          ref="menuButtonRef"
          class="site-header__icon-button site-header__menu"
          type="button"
          :aria-label="menuLabel"
          :aria-expanded="isMenuOpen"
          aria-controls="site-primary-nav site-mobile-menu"
          @click="toggleMenu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </div>

    <div
      id="site-mobile-menu"
      class="site-header__mobile-panel"
      :aria-hidden="!isMenuOpen"
      :inert="!isMenuOpen"
    >
      <nav class="site-header__mobile-nav" :aria-label="mobileNavLabel">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          class="site-header__mobile-link"
          :class="{ 'is-active': isActive(item.to) }"
          :to="item.to"
          :aria-current="isActive(item.to) ? 'page' : undefined"
          @click="closeMenu"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
