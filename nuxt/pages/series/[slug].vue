<script setup lang="ts">
import { getCollectionBySlug, getProductsByCollectionSlug } from "~/data/catalog";

const route = useRoute();
const series = getCollectionBySlug(String(route.params.slug));

if (!series) {
  throw createError({ statusCode: 404, statusMessage: "Door series not found" });
}

const products = getProductsByCollectionSlug(series.slug);

useSeoMeta({
  title: series.title,
  description: series.description
});
</script>

<template>
  <section class="detail-page">
    <NuxtLink class="back-link" to="/series">← All series</NuxtLink>

    <div class="detail-page__grid">
      <div class="detail-page__visual">
        <NuxtImg :src="series.image" :alt="series.title" width="520" height="820" />
      </div>

      <div class="detail-page__content">
        <p class="eyebrow">Series {{ series.number }}</p>
        <h1>{{ series.title }}</h1>
        <p>{{ series.longDescription }}</p>

        <div class="detail-specs">
          <span v-for="code in series.modelCodes" :key="code">{{ code }}</span>
        </div>

        <div class="hero-actions">
          <NuxtLink class="btn btn-primary" to="/doors">View Door Selector</NuxtLink>
          <NuxtLink class="btn btn-secondary" to="/request-quote">Request Quote</NuxtLink>
        </div>
      </div>
    </div>

    <div class="related-row">
      <NuxtLink v-for="product in products" :key="product.slug" :to="`/doors/${product.slug}`">
        <span>{{ product.code }}</span>
        <strong>{{ product.name }}</strong>
      </NuxtLink>
    </div>
  </section>
</template>
