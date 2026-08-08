import fs from 'fs';

const catalogPath = new URL('../src/app/data/catalog.json', import.meta.url);

const PRODUCT_SLUGS = [
  '101xlr',
  '98xlr',
  'dynamic-unidirectional-microphone-99xlr',
  'sv100',
];

/** Local asset (add `public/microphones.png` to swap catalog imagery). */
const PRODUCT_IMAGE = '/driver.jpeg';

function decodeHtml(text) {
  return text
    .replace(/&#8211;/g, '–')
    .replace(/&#8243;/g, '″')
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
  const rowRe = /<tr>\s*<td>([\s\S]*?)<\/td>\s*<td>([\s\S]*?)<\/td>\s*<\/tr>/gi;
  let match;
  while ((match = rowRe.exec(html)) !== null) {
    const label = decodeHtml(match[1]);
    const value = decodeHtml(match[2]);
    if (!label || !value) {
      continue;
    }
    specs.push({ label, value });
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
    id: `prod-microphones-${slug}`,
    model,
    categoryId: 'microphones',
    image: PRODUCT_IMAGE,
    specs: specs.length ? specs : [{ label: 'Details', value: 'Contact StudioMax for specifications' }],
  };
}

async function main() {
  const data = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

  const category = data.categories.find((c) => c.id === 'microphones');
  if (category) {
    category.description = 'Dynamic and XLR microphones for stage, speech, and vocal use.';
    category.tileImage = PRODUCT_IMAGE;
    category.overview =
      'StudioMax supplies the Almax Audio microphone range—XLR dynamics and vocal models for events and installs. Browse all four models below and contact us for pricing across India.';
    delete category.modelGroupHeading;
    delete category.modelGroupHeadingEmphasis;
    delete category.modelGroups;
  }

  const products = [];
  for (const slug of PRODUCT_SLUGS) {
    process.stdout.write(`Fetching ${slug}…\n`);
    products.push(await scrapeProduct(slug));
    await new Promise((r) => setTimeout(r, 400));
  }

  const without = data.products.filter((p) => p.categoryId !== 'microphones');
  const insertAt = without.findIndex((p) => p.categoryId === 'accessories');
  const at = insertAt === -1 ? without.length : insertAt;
  without.splice(at, 0, ...products);
  data.products = without;

  fs.writeFileSync(catalogPath, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`Microphones: ${products.length} products synced.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
