<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute } from "#imports";

const route = useRoute();
const { isNight, toggleMode } = useShowroomAmbience();
const isScrolled = ref(false);

const navItems = [
  { to: "/", label: "Home" },
  { to: "/doors", label: "Doors" },
  { to: "/series", label: "Series" },
  { to: "/production", label: "Production" },
  { to: "/export", label: "Export" },
  { to: "/company", label: "Company" },
  { to: "/contact", label: "Contact" }
];

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
      <NuxtLink class="site-header__brand" to="/" aria-label="Kardoor Home">
        <BrandMark />
      </NuxtLink>

      <nav class="site-header__nav" aria-label="Primary navigation">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          class="site-header__nav-link"
          :class="{ 'is-active': isActive(item.to) }"
          :to="item.to"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="site-header__actions">
        <button
          class="site-header__ambience"
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

        <NuxtLink class="site-header__catalog" to="/catalog">
          Catalog
        </NuxtLink>

        <NuxtLink class="site-header__quote" to="/request-quote">
          Request Quote
        </NuxtLink>

        <button class="site-header__menu" type="button" aria-label="Open menu">
          <span />
          <span />
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 80;
  width: 100%;
  padding: 28px 40px;
  pointer-events: none;
  transition:
    padding 0.35s ease,
    background 0.35s ease,
    backdrop-filter 0.35s ease;
}

.site-header__inner {
  position: relative;
  display: grid;
  grid-template-columns: minmax(220px, 280px) minmax(480px, 760px) max-content;
  align-items: center;
  gap: clamp(18px, 2vw, 28px);
  width: 100%;
  margin: 0 auto;
  pointer-events: auto;
}

.site-header__brand {
  display: inline-flex;
  align-items: center;
  width: max-content;
  min-width: 0;
  color: #fff;
  text-decoration: none;
  filter: drop-shadow(0 10px 26px rgba(0, 0, 0, 0.22));
}

.site-header__nav {
  justify-self: center;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 58px;
  padding: 7px;
  border: 1px solid rgba(255, 255, 255, 0.34);
  border-radius: 999px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0.42)),
    rgba(255, 255, 255, 0.34);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.72),
    0 24px 70px rgba(0, 0, 0, 0.18);
  backdrop-filter: blur(22px) saturate(1.25);
  -webkit-backdrop-filter: blur(22px) saturate(1.25);
}

.site-header__nav-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 0 18px;
  border-radius: 999px;
  color: rgba(10, 18, 28, 0.76);
  font-size: 13px;
  font-weight: 760;
  line-height: 1;
  letter-spacing: -0.02em;
  text-decoration: none;
  white-space: nowrap;
  transition:
    color 0.25s ease,
    background 0.25s ease,
    transform 0.25s ease;
}

.site-header__nav-link:hover {
  color: rgba(4, 12, 22, 0.96);
  background: rgba(255, 255, 255, 0.42);
}

.site-header__nav-link.is-active {
  color: #04101d;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.52));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.84),
    0 8px 24px rgba(0, 0, 0, 0.08);
}

.site-header__actions {
  justify-self: end;
  display: flex;
  align-items: center;
  gap: 14px;
  white-space: nowrap;
}

.site-header__ambience {
  position: relative;
  display: inline-grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 18px;
  color: #10151d;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0.38)),
    rgba(255, 255, 255, 0.22);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.36),
    0 18px 42px rgba(0, 0, 0, 0.16);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  cursor: pointer;
  transition:
    transform 0.25s ease,
    background 0.25s ease,
    border-color 0.25s ease,
    color 0.25s ease,
    box-shadow 0.25s ease;
}

.site-header__ambience:hover {
  transform: translateY(-1px);
  border-color: rgba(255, 255, 255, 0.46);
}

.site-header__bulb {
  position: relative;
  display: block;
  width: 23px;
  height: 28px;
}

.site-header__bulb-glass {
  position: absolute;
  left: 50%;
  top: 1px;
  width: 19px;
  height: 19px;
  transform: translateX(-50%);
  border: 2px solid currentColor;
  border-radius: 50% 50% 45% 45%;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 0 rgba(44, 227, 255, 0);
  transition:
    background 0.25s ease,
    box-shadow 0.25s ease;
}

.site-header__bulb-glass::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: -6px;
  width: 8px;
  height: 7px;
  transform: translateX(-50%);
  border-left: 2px solid currentColor;
  border-right: 2px solid currentColor;
}

.site-header__bulb-base {
  position: absolute;
  left: 50%;
  bottom: 1px;
  width: 13px;
  height: 7px;
  transform: translateX(-50%);
  border-top: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  border-radius: 2px;
}

.site-header--night .site-header__ambience {
  color: #eafaff;
  background:
    linear-gradient(135deg, rgba(44, 227, 255, 0.3), rgba(255, 255, 255, 0.08)),
    rgba(8, 12, 18, 0.42);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.18),
    0 18px 44px rgba(44, 227, 255, 0.18);
}

.site-header--night .site-header__bulb-glass {
  background: rgba(44, 227, 255, 0.22);
  box-shadow:
    0 0 18px rgba(44, 227, 255, 0.5),
    0 0 34px rgba(44, 227, 255, 0.22);
}

.site-header__catalog {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
  padding: 0 24px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 18px;
  color: #fff;
  font-size: 13px;
  font-weight: 780;
  letter-spacing: -0.01em;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.1);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.18),
    0 20px 44px rgba(0, 0, 0, 0.16);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  transition:
    background 0.25s ease,
    transform 0.25s ease,
    border-color 0.25s ease;
}

.site-header__catalog:hover {
  transform: translateY(-1px);
  border-color: rgba(255, 255, 255, 0.44);
  background: rgba(255, 255, 255, 0.18);
}

.site-header__quote {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
  padding: 0 26px;
  border-radius: 18px;
  color: #00111a;
  font-size: 13px;
  font-weight: 860;
  letter-spacing: -0.01em;
  text-decoration: none;
  background:
    linear-gradient(135deg, #5fe7ff 0%, #19c9e6 48%, #0bb1d0 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.44),
    0 18px 42px rgba(18, 201, 230, 0.28);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.site-header__quote:hover {
  transform: translateY(-1px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    0 24px 54px rgba(18, 201, 230, 0.34);
}

.site-header__menu {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  width: 52px;
  height: 52px;
  border: 1px solid rgba(255, 255, 255, 0.26);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.1);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.18),
    0 20px 44px rgba(0, 0, 0, 0.16);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  cursor: pointer;
}

.site-header__menu span {
  width: 22px;
  height: 2px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
}

.site-header--scrolled {
  padding-top: 16px;
  padding-bottom: 16px;
}

.site-header--scrolled .site-header__nav {
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.82), rgba(255, 255, 255, 0.58)),
    rgba(255, 255, 255, 0.44);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.76),
    0 18px 54px rgba(0, 0, 0, 0.16);
}

@media (max-width: 1240px) {
  .site-header {
    padding-inline: 24px;
  }

  .site-header__inner {
    grid-template-columns: 240px 1fr auto;
    gap: 18px;
  }

  .site-header__nav-link {
    padding-inline: 13px;
    font-size: 12px;
  }
}

@media (max-width: 980px) {
  .site-header {
    padding: 18px;
  }

  .site-header__inner {
    display: flex;
    justify-content: space-between;
  }

  .site-header__nav {
    display: none;
  }

  .site-header__catalog {
    display: none;
  }

  .site-header__quote {
    min-height: 46px;
    padding-inline: 18px;
    border-radius: 16px;
    font-size: 12px;
  }

  .site-header__ambience,
  .site-header__menu {
    width: 46px;
    height: 46px;
    border-radius: 16px;
  }
}

@media (max-width: 640px) {
  .site-header__quote {
    display: none;
  }
}
</style>
