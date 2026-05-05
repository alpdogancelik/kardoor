<script setup lang="ts">
import { computed } from "vue";

const { mode, isHydrated } = useShowroomAmbience();

const shellClasses = computed(() => [
  `app-shell--${mode.value}`,
  {
    "app-shell--hydrated": isHydrated.value
  }
]);
</script>

<template>
  <div
    class="app-shell"
    :class="shellClasses"
    :data-ambience="mode"
  >
    <SiteHeader />

    <main>
      <NuxtPage />
    </main>

    <SiteFooter />
  </div>
</template>
