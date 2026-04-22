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
