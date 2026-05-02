<template>
  <section id="showroom-dive" class="showroom-dive" aria-label="Kardoor showroom">
    <div class="showroom-dive__vignette" aria-hidden="true" />

    <div class="showroom-dive__copy">
      <p class="eyebrow">Inside the showroom</p>
      <h2>Models, series and export details in one guided space.</h2>
      <p>
        Move from the entrance into a darker product environment where Kardoor
        models can be compared by series, surface, use case and supply profile.
      </p>
      <div class="hero-actions">
        <NuxtLink class="btn btn-primary" to="/doors">Open Door Selector</NuxtLink>
        <NuxtLink class="btn btn-secondary" to="/series">View Series</NuxtLink>
      </div>
    </div>

    <div class="showroom-dive__stage" aria-hidden="true">
      <div class="showroom-dive__frame" />
      <NuxtImg src="/images/doors/door-graphite.svg" alt="" width="420" height="760" />
      <span class="showroom-dive__tag showroom-dive__tag--top">Export-ready</span>
      <span class="showroom-dive__tag showroom-dive__tag--left">Model codes</span>
      <span class="showroom-dive__tag showroom-dive__tag--right">Custom sizes</span>
    </div>
  </section>
</template>
