import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-');

export const GET: APIRoute = async () => {
  const site = 'https://elanka.world';
  const products = await getCollection('products');

  // Collect all unique categories and count how many products belong to each
  const categoryCounts = new Map<string, number>();
  for (const item of products) {
    const cats = item.data.categories ?? [];
    for (const cat of cats) {
      categoryCounts.set(cat, (categoryCounts.get(cat) ?? 0) + 1);
    }
  }

  // Sort categories alphabetically
  const sortedCategories = [...categoryCounts.entries()].sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  // Format category lines matching your exact /category/<slug>/ URL pattern
  const categoryLines = sortedCategories.map(([cat, count]) => {
    const slug = slugify(cat);
    return `- [${cat}](${site}/category/${slug}/): ${count} ${count === 1 ? 'machine' : 'machines'} available in Sri Lanka`;
  });

  // Format product catalog lines matching your exact /products/<id>/ URL pattern
  const sortedProducts = [...products].sort((a, b) =>
    a.data.title.localeCompare(b.data.title)
  );

  const productLines = sortedProducts.map((item) => {
    const cleanId = item.id.replace(/\.md$/, '');
    const price = item.data.offerPrice || item.data.price;
    const desc = item.data.shortDescription
      ? item.data.shortDescription.replace(/\s+/g, ' ').trim()
      : '';
    const priceNote = price ? ` (${price})` : '';
    return `- [${item.data.title}](${site}/products/${cleanId}/)${priceNote}${desc ? `: ${desc}` : ''}`;
  });

  const body = `# E Lanka World International

> Sri Lanka-based supplier of industrial packaging machinery, date & batch coding inkjet printers, food dehydrators, conveyor systems, and commercial food-processing equipment. We provide local warranty coverage, spare parts, and after-sales technical service across Sri Lanka.

## Business & Contact Information
- **Website:** ${site}
- **Specialized Coding Portal:** https://www.datecoding.lk
- **Conveyor Systems Portal:** https://vahakaya.com
- **Phone / WhatsApp:** +94 77 634 4758
- **Pickup & Service Locations:** Panadura, Rathmalana, and Nawala, Sri Lanka
- **Delivery:** Island-wide delivery across Sri Lanka
- **Brands Supplied:** Packoni, Zodpro, Atlas Lanka

## Key Pages
- [Shop All Machinery](${site}/shop/): Complete catalog of packaging, coding, food-processing, and dehydrator machines.
- [Conveyor Systems](${site}/conveyor/): Industrial belt conveyors and material handling solutions.
- [Conveyor Accessories](${site}/conveyor-accessories/): Rollers, guide rails, motors, and conveyor components.
- [Conveyor Belts](${site}/conveyor-belts-only/): Replacement PVC, PU, and modular conveyor belts.
- [About E Lanka World](${site}/about/): Company profile, warranty support, and Sri Lankan service centers.

## Product Categories
${categoryLines.join('\n')}

## Full Machinery Catalog
${productLines.join('\n')}
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};