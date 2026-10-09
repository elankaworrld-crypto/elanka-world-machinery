import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const products = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/products" }),
  schema: z.object({
    title: z.string(),
    shortDescription: z.string(), // New Field
    description: z.string(), // Long description
    image: z.string(),
    images: z.array(z.string()).optional(),
    categories: z.array(z.string()),
    price: z.string(), // Original Price
    offerPrice: z.string().optional(), // New Sale Price
  }),
});

const premium = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/premium" }),
  schema: z.object({
    title: z.string().optional(),
  }),
});

// 🌟 New Industries Collection using Astro v5 Glob Loader
const industry = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/industry" }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(), // 👈 ADDED .optional() HERE
    seoDescription: z.string(),
    intro: z.string(),
    featuredCategories: z.array(
      z.object({
        id: z.string(), // CSS anchor ID (e.g., "filling-machines")
        name: z.string(), // Category display name (e.g., "Liquid Filling Machines")
        description: z.string().optional(),
        productIds: z.array(z.string()), // List of product IDs matching product markdown filenames
      })
    ),
  }),
});

// 🌟 Export all collections
export const collections = { products, premium, industry };