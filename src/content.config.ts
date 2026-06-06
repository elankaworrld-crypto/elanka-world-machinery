import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders'; // This is the new part!

const products = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/products" }),
  schema: z.object({
    title: z.string(),
    shortDescription: z.string(), // New Field
    description: z.string(), // This will be the long description
    image: z.string(),
    images: z.array(z.string()).optional(),
    categories: z.array(z.string()),
    price: z.string(), // Original Price
    offerPrice: z.string().optional(), // New Sale Price
  }),
});

// 🌟 Add the Premium Collection using the v5 glob loader syntax
const premium = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/premium" }),
  schema: z.object({
    title: z.string().optional(), // Keeps frontmatter title optional for you
  }),
});

// 🌟 Export both collections so Astro registers them
export const collections = { products, premium };