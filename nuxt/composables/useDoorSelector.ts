import { computed, ref } from "vue";
import { collections } from "~/data/collections";
import { products } from "~/data/products";

const fallbackProduct = products[0]!;

export function useDoorSelector() {
  const activeIndex = ref(0);
  const selectedSeries = ref<string[]>([]);
  const selectedUseCases = ref<string[]>([]);
  const selectedSurfaces = ref<string[]>([]);
  const selectedExportTags = ref<string[]>([]);

  const filterOptions = computed(() => ({
    series: collections,
    useCases: [...new Set(products.flatMap((product) => product.useCases))],
    surfaces: [...new Set(products.flatMap((product) => product.surfaces))],
    exportTags: [...new Set(products.flatMap((product) => product.exportTags))]
  }));

  const filteredProducts = computed(() =>
    products.filter((product) => {
      const matchesSeries =
        selectedSeries.value.length === 0 || selectedSeries.value.includes(product.seriesSlug);
      const matchesUseCase =
        selectedUseCases.value.length === 0 ||
        product.useCases.some((useCase) => selectedUseCases.value.includes(useCase));
      const matchesSurface =
        selectedSurfaces.value.length === 0 ||
        product.surfaces.some((surface) => selectedSurfaces.value.includes(surface));
      const matchesExport =
        selectedExportTags.value.length === 0 ||
        product.exportTags.some((tag) => selectedExportTags.value.includes(tag));

      return matchesSeries && matchesUseCase && matchesSurface && matchesExport;
    })
  );

  const activeProduct = computed(() => filteredProducts.value[activeIndex.value] ?? fallbackProduct);
  const previousProduct = computed(() => {
    const list = filteredProducts.value.length ? filteredProducts.value : products;
    return list[(activeIndex.value - 1 + list.length) % list.length] ?? fallbackProduct;
  });
  const nextProduct = computed(() => {
    const list = filteredProducts.value.length ? filteredProducts.value : products;
    return list[(activeIndex.value + 1) % list.length] ?? fallbackProduct;
  });

  function clampActiveIndex() {
    if (activeIndex.value > filteredProducts.value.length - 1) activeIndex.value = 0;
  }

  function toggle(list: string[], value: string) {
    const index = list.indexOf(value);
    if (index >= 0) list.splice(index, 1);
    else list.push(value);
    clampActiveIndex();
  }

  function selectIndex(index: number) {
    const total = filteredProducts.value.length || products.length;
    activeIndex.value = (index + total) % total;
  }

  function next() {
    selectIndex(activeIndex.value + 1);
  }

  function previous() {
    selectIndex(activeIndex.value - 1);
  }

  function clearFilters() {
    selectedSeries.value = [];
    selectedUseCases.value = [];
    selectedSurfaces.value = [];
    selectedExportTags.value = [];
    activeIndex.value = 0;
  }

  return {
    activeIndex,
    activeProduct,
    previousProduct,
    nextProduct,
    filteredProducts,
    filterOptions,
    selectedSeries,
    selectedUseCases,
    selectedSurfaces,
    selectedExportTags,
    toggle,
    next,
    previous,
    selectIndex,
    clearFilters
  };
}
