/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module "*.glb?url" {
  const src: string;
  export default src;
}
