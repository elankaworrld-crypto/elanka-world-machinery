import { defineConfig } from 'astro/config';
import pagefind from "astro-pagefind";
import preact from "@astrojs/preact"; // 1. Added this line

// https://astro.build/config
export default defineConfig({
  integrations: [
    preact(), // 2. Added this line
    pagefind()
  ],
});