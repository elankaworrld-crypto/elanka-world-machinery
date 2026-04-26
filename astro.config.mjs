import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap'; // 1. Must import the sitemap tool
import pagefind from "astro-pagefind";
import preact from "@astrojs/preact";

export default defineConfig({
  // 2. CRITICAL: You must add your site URL here 
  // This is how Astro builds the links (e.g., https://elanka.world/about)
  site: 'https://elanka.world', 
  
  integrations: [
    preact(),
    pagefind(),
    sitemap(), // 3. Add sitemap to the list
  ],
});