import fs from 'fs';

const catalogPath = new URL('../src/app/data/catalog.json', import.meta.url);

/** slug → model group (matches Almax Table Stand / Floor Stand). */
const PRODUCT_SLUGS = [
  { slug: 'book-stand', modelGroupId: 'floor-stand' },
  { slug: 'boom-stand-floor', modelGroupId: 'floor-stand' },
  { slug: 'boom-stand-floor-black', modelGroupId: 'floor-stand' },
  { slug: 'boom-stand-table', modelGroupId: 'table-stand' },
  { slug: 'boom-stand-table-black', modelGroupId: 'table-stand' },
  { slug: 'desk-stand-ats', modelGroupId: 'table-stand' },
  { slug: 'folding-stand-92-table', modelGroupId: 'table-stand' },
  { slug: 'mic-stand-floor1', modelGroupId: 'floor-stand' },
  { slug: 'mic-stand-dgn-dlx', modelGroupId: 'floor-stand' },
  { slug: 'mic-stand-dgt-dlx', modelGroupId: 'table-stand' },
  { slug: 'mic-stand-floor-dgn-a', modelGroupId: 'floor-stand' },
  { slug: 'mic-stand-round-base-floor-a', modelGroupId: 'floor-stand' },
  { slug: 'mic-stand-round-base-floor-b', modelGroupId: 'floor-stand' },
  { slug: 'mic-stand-round-base-floor-c', modelGroupId: 'floor-stand' },
  { slug: 'mic-stand-round-base-table-a', modelGroupId: 'table-stand' },
  { slug: 'mic-stand-round-base-table-b', modelGroupId: 'table-stand' },
  { slug: 'mic-stand-round-base-table-c', modelGroupId: 'table-stand' },
  { slug: 'three-leg-mic-stand-floor-c', modelGroupId: 'floor-stand' },
  { slug: 'three-leg-mic-stand-table-a', modelGroupId: 'table-stand' },
  { slug: 'three-leg-mic-stand-table-c', modelGroupId: 'table-stand' },
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

function productId(slug) {
  return `prod-microphone-stands-${slug}`;
}

async function scrapeProduct({ slug, modelGroupId }) {
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
    id: productId(slug),
    model,
    categoryId: 'microphone-stands',
    modelGroupId,
    image: '/microphone-stands.png',
    specs: specs.length ? specs : [{ label: 'Details', value: 'Contact StudioMax for specifications' }],
  };
}

async function main() {
  const data = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

  const category = data.categories.find((c) => c.id === 'microphone-stands');
  if (category) {
    category.description = 'Table and floor microphone stands for stage, studio, and speech.';
    category.overview =
      'StudioMax supplies the full Almax Audio microphone stand range—table and floor models for vocals, instruments, and presentations. Select a style tab to browse all models and enquire for pricing across India.';
    category.modelGroupHeading = 'Choose Stand Type';
    category.modelGroupHeadingEmphasis = 'Type';
    category.modelGroups = [
      {
        id: 'table-stand',
        tabLabel: 'Table Stand',
        sectionTitle: 'Table Stand',
      },
      {
        id: 'floor-stand',
        tabLabel: 'Floor Stand',
        sectionTitle: 'Floor Stand',
      },
    ];
  }

  const micProducts = [];
  for (const entry of PRODUCT_SLUGS) {
    process.stdout.write(`Fetching ${entry.slug}…\n`);
    micProducts.push(await scrapeProduct(entry));
    await new Promise((r) => setTimeout(r, 400));
  }

  const withoutMic = data.products.filter((p) => p.categoryId !== 'microphone-stands');
  const insertAt = withoutMic.findIndex((p) => p.categoryId === 'trumpet');
  const at = insertAt === -1 ? withoutMic.length : insertAt;
  withoutMic.splice(at, 0, ...micProducts);
  data.products = withoutMic;

  fs.writeFileSync(catalogPath, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`Microphone stands: ${micProducts.length} products synced.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
