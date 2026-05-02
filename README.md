# Kardoor

Nuxt/Vue application for the Ege Kardoor showroom and catalog experience.

## Commands

Run all project commands from the repository root:

```bash
npm run dev
npm run typecheck
npm run build
npm run preview
```

The root scripts delegate to the Nuxt app in `nuxt/`.

## Project Shape

- `nuxt/pages` contains route pages.
- `nuxt/components` contains Vue components.
- `nuxt/assets/styles/main.css` contains global application styles.
- `nuxt/public` contains static images, door animation frames and model assets.

Astro sources have been removed; Nuxt is the single application runtime.
