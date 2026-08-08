import fs from 'fs';

const catalogPath = new URL('../src/app/data/catalog.json', import.meta.url);

const PRODUCT_SLUGS = [
  '12-inch-d-type-reflex-horn',
  '12-inches-alu-trumpet-with-iron-nali',
  '12-inches-full-aluminium-trumpet',
  '12-inches-full-iron-trumpet',
  '18-inches-full-iron-trumpet',
  '22-inches-alu-trumpet-with-iron-nali',
  '22-inches-full-alu-trumpet',
  'reflex-horn-18-inches-wfb',
];

function decodeHtml(text) {
  return text
    .replace(/&#8211;/g, '–')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#038;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseProductPage(html) {
  const titleMatch =
    html.match(/<h1 class="product_title entry-title">([^<]+)</i) ||
    html.match(/<h1[^>]*class="[^"]*product_title[^"]*"[^>]*>([^<]+)/i);
  const model = titleMatch ? decodeHtml(titleMatch[1]) : 'Unknown';

  const specs = [];
  const rowRe = /<tr>\s*<td>(?:<strong>|<b>)([\s\S]*?)(?:<\/strong>|<\/b>)<\/td>\s*<td>([\s\S]*?)<\/td>\s*<\/tr>/gi;
  let match;
  while ((match = rowRe.exec(html)) !== null) {
    const label = decodeHtml(match[1]);
    const value = decodeHtml(match[2]);
    if (label && value) {
      specs.push({ label, value });
    }
  }

  return { model, specs };
}

async function scrapeProduct(slug) {
  const url = `https://almaxaudio.com/product/${slug}/`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'StudioMax-catalog-sync/1.0' },
  });
  if (!res.ok) {
    throw new Error(`${url} → HTTP ${res.status}`);
  }
  const html = await res.text();
  const { model, specs } = parseProductPage(html);
  return {
    id: `prod-trumpet-${slug}`,
    model,
    categoryId: 'trumpet',
    image: '/trumpet.png',
    specs: specs.length ? specs : [{ label: 'Details', value: 'Contact StudioMax for specifications' }],
  };
}

async function main() {
  const data = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

  const category = data.categories.find((c) => c.id === 'trumpet');
  if (category) {
    category.description = 'Trumpet and reflex horns for focused projection in PA and install systems.';
    category.overview =
      'StudioMax supplies the Almax Audio trumpet and reflex horn line in 12″, 18″, and 22″ formats. Browse all models below and contact us for pricing and OEM support across India.';
    delete category.modelGroupHeading;
    delete category.modelGroupHeadingEmphasis;
    delete category.modelGroups;
  }

  const trumpetProducts = [];
  for (const slug of PRODUCT_SLUGS) {
    process.stdout.write(`Fetching ${slug}…\n`);
    trumpetProducts.push(await scrapeProduct(slug));
    await new Promise((r) => setTimeout(r, 400));
  }

  const without = data.products.filter((p) => p.categoryId !== 'trumpet');
  const insertAt = without.findIndex((p) => p.categoryId === 'hf-tweeter');
  const at = insertAt === -1 ? without.length : insertAt;
  without.splice(at, 0, ...trumpetProducts);
  data.products = without;

  fs.writeFileSync(catalogPath, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`Trumpet & reflex horn: ${trumpetProducts.length} products synced.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
