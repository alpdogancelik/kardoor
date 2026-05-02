<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "#imports";

const route = useRoute();

const navItems = [
  {
    to: "/",
    label: "Home",
    eyebrow: "Start"
  },
  {
    to: "/doors",
    label: "Doors",
    eyebrow: "Collections",
    children: [
      { to: "/doors", label: "All Door Models" },
      { to: "/catalog", label: "Catalog View" },
      { to: "/request-quote", label: "Project Quote" }
    ]
  },
  {
    to: "/series",
    label: "Series",
    eyebrow: "Models",
    children: [
      { to: "/series/aluminium-frame", label: "Aluminium Frame" },
      { to: "/series/thermo-wood", label: "Thermo Wood" },
      { to: "/series/laminox", label: "Laminox" }
    ]
  },
  {
    to: "/production",
    label: "Production",
    eyebrow: "Factory"
  },
  {
    to: "/export",
    label: "Export",
    eyebrow: "Global"
  },
  {
    to: "/company",
    label: "Company",
    eyebrow: "About"
  },
  {
    to: "/contact",
    label: "Contact",
    eyebrow: "Reach us"
  }
];

const isScrolled = ref(false);
const isMenuOpen = ref(false);
const isEntranceDoorOpen = ref(false);
const activePanel = ref<string | null>(null);

const activeMegaItem = computed(() =>
  navItems.find((item) => item.label === activePanel.value && item.children?.length)
);

const isActive = (to: string) => {
  if (to === "/") return route.path === "/";
  return route.path.startsWith(to);
};

const openPanel = (label: string, hasChildren?: boolean) => {
  activePanel.value = hasChildren ? label : null;
};

const closePanel = () => {
  activePanel.value = null;
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  closePanel();
};

const closeMenu = () => {
  isMenuOpen.value = false;
  closePanel();
};

const onScroll = () => {
  const hasScrolled = window.scrollY > 24;

  isScrolled.value = hasScrolled;

  if (hasScrolled && (isMenuOpen.value || activePanel.value)) {
    closeMenu();
  }
};

const onEntranceDoorState = (event: Event) => {
  const detail = (event as CustomEvent<{ isOpen?: boolean }>).detail;
  isEntranceDoorOpen.value = Boolean(detail?.isOpen);

  if (isEntranceDoorOpen.value) {
    closeMenu();
  }
};

watch(
  () => route.path,
  () => {
    isEntranceDoorOpen.value = false;
    closeMenu();
  }
);

onMounted(() => {
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("kardoor:entrance-door-state", onEntranceDoorState);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("kardoor:entrance-door-state", onEntranceDoorState);
});
</script>

<template>
  <header
    class="site-header"
    :class="{
      'site-header--scrolled': isScrolled,
      'site-header--menu-open': isMenuOpen,
      'site-header--door-open': isEntranceDoorOpen
    }"
    @mouseleave="closePanel"
  >
    <div class="site-header__inner">
      <NuxtLink class="site-header__brand" to="/" aria-label="Ege Kardoor Home">
        <BrandMark />
      </NuxtLink>

      <nav class="site-nav" aria-label="Primary navigation">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          class="site-nav__link"
          :class="{ 'site-nav__link--active': isActive(item.to) }"
          :to="item.to"
          @mouseenter="openPanel(item.label, Boolean(item.children?.length))"
          @focus="openPanel(item.label, Boolean(item.children?.length))"
        >
          <span>{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <div class="site-actions">
        <NuxtLink class="site-actions__catalog" to="/catalog">
          Catalog
        </NuxtLink>

        <NuxtLink class="site-actions__quote" to="/request-quote">
          Request Quote
        </NuxtLink>
      </div>

      <button
        class="site-burger"
        type="button"
        :aria-expanded="isMenuOpen"
        aria-controls="mobile-navigation"
        aria-label="Toggle navigation menu"
        @click="toggleMenu"
      >
        <span />
        <span />
      </button>
    </div>

    <Transition name="header-mega">
      <div
        v-if="activeMegaItem"
        class="site-mega"
        @mouseenter="openPanel(activeMegaItem.label, true)"
        @mouseleave="closePanel"
      >
        <div class="site-mega__copy">
          <span>{{ activeMegaItem.eyebrow }}</span>
          <strong>{{ activeMegaItem.label }}</strong>
          <p>
            Explore Kardoor steel door solutions designed for residential,
            project and export supply.
          </p>
        </div>

        <div class="site-mega__links">
          <NuxtLink
            v-for="child in activeMegaItem.children"
            :key="child.to"
            :to="child.to"
          >
            {{ child.label }}
            <span>›</span>
          </NuxtLink>
        </div>
      </div>
    </Transition>

    <Transition name="mobile-nav">
      <nav
        v-if="isMenuOpen"
        id="mobile-navigation"
        class="mobile-nav"
        aria-label="Mobile navigation"
      >
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :class="{ 'mobile-nav__link--active': isActive(item.to) }"
          class="mobile-nav__link"
        >
          <small>{{ item.eyebrow }}</small>
          <span>{{ item.label }}</span>
        </NuxtLink>

        <div class="mobile-nav__actions">
          <NuxtLink to="/catalog" @click="closeMenu">Catalog</NuxtLink>
          <NuxtLink to="/request-quote" @click="closeMenu">Request Quote</NuxtLink>
        </div>
      </nav>
    </Transition>
  </header>
</template>

<style scoped lang="scss">
.site-header {
  --header-height: 114px;
  --header-bg-scrolled: rgba(15, 16, 16, 0.78);
  --header-text: #f4f2ef;
  --header-muted: rgba(244, 242, 239, 0.62);
  --header-cyan: #38dff5;
  --header-cyan-deep: #1bb8d4;

  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  width: 100%;
  color: var(--header-text);
  background: transparent;
  border-bottom: 1px solid transparent;
  backdrop-filter: none;
  box-shadow: none;
  transition:
    opacity 0.28s ease,
    transform 0.28s ease,
    background 0.35s ease,
    border-color 0.35s ease,
    box-shadow 0.35s ease,
    backdrop-filter 0.35s ease;

  * {
    box-sizing: border-box;
  }
}

.site-header--scrolled {
  background: var(--header-bg-scrolled);
  backdrop-filter: blur(18px);
  border-color: rgba(244, 242, 239, 0.08);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.22);

  .site-header__inner {
    min-height: 82px;
  }

  :deep(.brand-mark) {
    transform: scale(0.92);
  }
}

.site-header--door-open {
  opacity: 0;
  transform: translateY(-100%);
  pointer-events: none;
}

.site-header__inner {
  width: min(100%, 1840px);
  min-height: var(--header-height);
  margin: 0 auto;
  padding: 0 clamp(24px, 2.1vw, 40px);
  display: grid;
  grid-template-columns: minmax(250px, 0.78fr) minmax(520px, 1fr) auto;
  align-items: center;
  gap: clamp(28px, 3vw, 58px);
  transition: min-height 0.35s ease;
}

.site-header__brand {
  display: inline-flex;
  width: fit-content;
  color: inherit;
  text-decoration: none;

  :deep(.brand-mark) {
    transform-origin: left center;
    transition: transform 0.35s ease;
  }
}

.site-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(20px, 1.75vw, 32px);
}

.site-nav__link {
  position: relative;
  display: inline-flex;
  align-items: center;
  min-height: 42px;
  color: rgba(244, 242, 239, 0.78);
  text-decoration: none;
  text-transform: uppercase;
  font-size: clamp(0.82rem, 0.86vw, 1rem);
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.018em;
  transition: color 0.25s ease;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 100%;
    bottom: 0;
    height: 3px;
    border-radius: 999px;
    background: var(--header-cyan);
    transition: right 0.28s ease;
  }

  &:hover,
  &:focus-visible,
  &--active {
    color: var(--header-text);
  }

  &:hover::after,
  &:focus-visible::after,
  &--active::after {
    right: 0;
  }
}

.site-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 14px;

  a {
    min-height: 58px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 9px;
    text-decoration: none;
    text-transform: uppercase;
    font-size: 0.92rem;
    font-weight: 950;
    letter-spacing: -0.018em;
    white-space: nowrap;
    transition:
      transform 0.25s ease,
      border-color 0.25s ease,
      background 0.25s ease,
      color 0.25s ease;
  }
}

.site-actions__catalog {
  padding: 0 28px;
  color: var(--header-text);
  background: rgba(255, 255, 255, 0.075);
  border: 1px solid rgba(244, 242, 239, 0.16);

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(244, 242, 239, 0.32);
    background: rgba(255, 255, 255, 0.105);
  }
}

.site-actions__quote {
  padding: 0 28px;
  color: #03080b;
  background: linear-gradient(135deg, #48e6ff, var(--header-cyan-deep));
  border: 1px solid rgba(255, 255, 255, 0.08);

  &:hover {
    transform: translateY(-2px);
    background: linear-gradient(135deg, #71efff, #2bd5ee);
  }
}

.site-burger {
  display: none;
  width: 52px;
  height: 52px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 7px;
  border: 1px solid rgba(244, 242, 239, 0.16);
  border-radius: 12px;
  color: var(--header-text);
  background: rgba(255, 255, 255, 0.055);
  cursor: pointer;

  span {
    width: 22px;
    height: 2px;
    border-radius: 999px;
    background: currentColor;
    transition:
      transform 0.28s ease,
      opacity 0.28s ease;
  }
}

.site-header--menu-open {
  background: rgba(24, 25, 25, 0.94);
  border-color: rgba(244, 242, 239, 0.08);

  .site-burger span:first-child {
    transform: translateY(4.5px) rotate(45deg);
  }

  .site-burger span:last-child {
    transform: translateY(-4.5px) rotate(-45deg);
  }
}

.site-mega {
  position: absolute;
  left: 50%;
  top: calc(100% + 1px);
  width: min(760px, calc(100vw - 48px));
  transform: translateX(-50%);
  display: grid;
  grid-template-columns: 0.82fr 1fr;
  gap: 26px;
  padding: 26px;
  border: 1px solid rgba(244, 242, 239, 0.12);
  border-radius: 0 0 24px 24px;
  background: rgba(25, 26, 27, 0.96);
  backdrop-filter: blur(18px);
  box-shadow: 0 28px 70px rgba(0, 0, 0, 0.32);
}

.site-mega__copy {
  padding: 4px 10px 4px 0;

  span {
    display: block;
    margin-bottom: 10px;
    color: var(--header-cyan);
    text-transform: uppercase;
    font-size: 0.72rem;
    font-weight: 950;
    letter-spacing: 0.04em;
  }

  strong {
    display: block;
    margin-bottom: 12px;
    color: var(--header-text);
    font-size: 1.55rem;
    font-weight: 950;
    line-height: 1;
    letter-spacing: -0.04em;
  }

  p {
    max-width: 270px;
    margin: 0;
    color: var(--header-muted);
    font-size: 0.94rem;
    font-weight: 700;
    line-height: 1.25;
    letter-spacing: -0.012em;
  }
}

.site-mega__links {
  display: grid;
  gap: 10px;

  a {
    min-height: 54px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    padding: 0 18px;
    border: 1px solid rgba(244, 242, 239, 0.1);
    border-radius: 14px;
    color: var(--header-text);
    background: rgba(255, 255, 255, 0.04);
    text-decoration: none;
    font-size: 0.98rem;
    font-weight: 900;
    letter-spacing: -0.018em;
    transition:
      transform 0.25s ease,
      border-color 0.25s ease,
      background 0.25s ease;

    span {
      color: var(--header-cyan);
      font-size: 1.4rem;
      line-height: 1;
    }

    &:hover {
      transform: translateX(4px);
      border-color: rgba(56, 223, 245, 0.34);
      background: rgba(56, 223, 245, 0.08);
    }
  }
}

.mobile-nav {
  display: none;
}

.header-mega-enter-active,
.header-mega-leave-active,
.mobile-nav-enter-active,
.mobile-nav-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.header-mega-enter-from,
.header-mega-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px);
}

.mobile-nav-enter-from,
.mobile-nav-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 1180px) {
  .site-header__inner {
    grid-template-columns: 1fr auto auto;
  }

  .site-nav {
    display: none;
  }

  .site-actions {
    display: none;
  }

  .site-burger {
    display: inline-flex;
  }

  .site-mega {
    display: none;
  }

  .mobile-nav {
    display: grid;
    width: min(100%, 1840px);
    margin: 0 auto;
    padding: 10px 24px 24px;
    border-top: 1px solid rgba(244, 242, 239, 0.08);
    background: rgba(24, 25, 25, 0.98);
  }

  .mobile-nav__link {
    display: grid;
    grid-template-columns: 110px 1fr;
    align-items: center;
    min-height: 58px;
    border-bottom: 1px solid rgba(244, 242, 239, 0.08);
    color: var(--header-text);
    text-decoration: none;

    small {
      color: var(--header-muted);
      text-transform: uppercase;
      font-size: 0.72rem;
      font-weight: 900;
      letter-spacing: 0.04em;
    }

    span {
      font-size: 1.5rem;
      font-weight: 950;
      line-height: 1;
      letter-spacing: -0.04em;
    }
  }

  .mobile-nav__link--active span {
    color: var(--header-cyan);
  }

  .mobile-nav__actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-top: 18px;

    a {
      min-height: 56px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      text-decoration: none;
      text-transform: uppercase;
      font-size: 0.86rem;
      font-weight: 950;
      letter-spacing: -0.018em;

      &:first-child {
        color: var(--header-text);
        background: rgba(255, 255, 255, 0.075);
        border: 1px solid rgba(244, 242, 239, 0.14);
      }

      &:last-child {
        color: #03080b;
        background: linear-gradient(135deg, #48e6ff, var(--header-cyan-deep));
      }
    }
  }
}

@media (max-width: 620px) {
  .site-header {
    --header-height: 86px;
  }

  .site-header__inner {
    min-height: var(--header-height);
    padding: 0 18px;
  }

  .site-burger {
    width: 48px;
    height: 48px;
  }

  .mobile-nav {
    padding: 8px 18px 22px;
  }

  .mobile-nav__link {
    grid-template-columns: 84px 1fr;

    span {
      font-size: 1.28rem;
    }
  }

  .mobile-nav__actions {
    grid-template-columns: 1fr;
  }
}
</style>
