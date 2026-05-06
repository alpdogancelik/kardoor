import process from "node:process";

export default defineNuxtConfig({
  compatibilityDate: "2026-05-02",
  devtools: { enabled: process.env.NODE_ENV !== "production" },
  modules: ["@nuxt/image"],
  components: [{ path: "~/components", pathPrefix: false }],
  css: ["~/assets/styles/main.css"],
  app: {
    head: {
      titleTemplate: "%s | Ege Kardoor",
      htmlAttrs: { lang: "en" },
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { charset: "utf-8" },
        { name: "theme-color", content: "#050505" },
        {
          name: "description",
          content:
            "Ege Kardoor manufactures steel doors in Turkiye for international buyers, dealers and project supply."
        }
      ],
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800;900&family=Inter:wght@400;500;600;700;800;900&family=Instrument+Serif:ital@0;1&display=swap"
        }
      ]
    },
    pageTransition: { name: "page", mode: "out-in" }
  },
  image: {
    domains: ["i.hizliresim.com"],
    quality: 82,
    format: ["webp", "avif"],
    screens: {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536
    }
  },
  runtimeConfig: {
    public: {
      assetBaseUrl: process.env.NUXT_PUBLIC_ASSET_BASE_URL || ""
    }
  },
  nitro: {
    compressPublicAssets: true
  },
  typescript: {
    strict: true,
    typeCheck: true
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag: string) => tag === "dotlottie-player"
    }
  }
});
