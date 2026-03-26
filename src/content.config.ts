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

export const collections = { products };