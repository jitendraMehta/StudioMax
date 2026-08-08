import fs from 'fs';

const catalogPath = new URL('../src/app/data/catalog.json', import.meta.url);

const PRODUCT_SLUGS = ['audio-cables', 'microphone-wire', 'speaker-wire', 'xlr-cables'];

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
    id: `prod-wires-cables-${slug}`,
    model,
    categoryId: 'wires-cables',
    image: '/wires.png',
    specs: specs.length ? specs : [{ label: 'Details', value: 'Contact StudioMax for specifications' }],
  };
}

async function main() {
  const data = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

  const category = data.categories.find((c) => c.id === 'wires-cables');
  if (category) {
    category.description = 'Audio, microphone, speaker, and XLR cables for professional installs.';
    category.tileImage = '/wires.png';
    category.overview =
      'StudioMax supplies Almax Audio wires and cables for stage, studio, and install work. Browse all four product lines below and contact us for lengths, connectors, and bulk pricing across India.';
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

  const without = data.products.filter((p) => p.categoryId !== 'wires-cables');
  const insertAt = without.findIndex((p) => p.categoryId === 'microphones');
  const at = insertAt === -1 ? without.length : insertAt;
  without.splice(at, 0, ...products);
  data.products = without;

  fs.writeFileSync(catalogPath, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`Wires & cables: ${products.length} products synced.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
