import { collections } from "./collections";
import { products } from "./products";

export const technicalCalloutLabels = ["Kasa", "Kanat", "Yüzey", "Kol", "Kilit", "Cam"];

export function getCollectionBySlug(slug: string) {
  return collections.find((collection) => collection.slug === slug);
}

export function getProductsByCollectionSlug(collectionSlug: string) {
  return products.filter((product) => product.collectionSlug === collectionSlug);
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getFeaturedProducts() {
  const featuredCodes = ["K1001", "K1051", "K1101"];
  return featuredCodes
    .map((code) => products.find((product) => product.code === code))
    .filter((product): product is NonNullable<typeof product> => Boolean(product));
}