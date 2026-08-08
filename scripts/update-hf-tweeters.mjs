import fs from 'fs';

const catalogPath = new URL('../src/app/data/catalog.json', import.meta.url);

const PRODUCT_SLUGS = [
  'al-hf-450d',
  'al-hf-518d',
  'al-hf-7228d',
  'al-hf-750d',
  'al-hf-d26',
];

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

function parseTableRows(html) {
  const rows = [];
  const rowRe = /<tr>\s*<td>([\s\S]*?)<\/td>\s*<td>([\s\S]*?)<\/td>\s*<\/tr>/gi;
  let match;
  while ((match = rowRe.exec(html)) !== null) {
    const left = decodeHtml(match[1]);
    const right = decodeHtml(match[2]);
    if (left && right) {
      rows.push({ left, right });
    }
  }
  return rows;
}

function formatImpedance(value) {
  const parts = value.split('/').map((s) => s.trim());
  if (parts.length === 2 && parts.every((p) => /^\d+$/.test(p))) {
    const nominal = Number(parts[0]);
    const dc = Number(parts[1]);
    if (nominal >= 10 && dc <= 100) {
      return `${nominal / 10} Ω / ${dc / 10} Ω`;
    }
  }
  return value.includes('Ω') ? value : `${value} Ω`;
}

/** Almax HF tables use paired value rows (power/voice coil, sensitivity/response). */
function normalizeHfSpecs(rows) {
  const specs = [];
  for (let i = 0; i < rows.length; i++) {
    const { left, right } = rows[i];

    if (left === 'Sensitivity' && right === 'Response') {
      const prev = rows[i - 1];
      if (prev && /±?\d.*dB/i.test(prev.left)) {
        specs.push({ label: 'Sensitivity', value: prev.left.replace(/dB/i, 'dB') });
        specs.push({ label: 'Frequency response', value: prev.right });
      }
      continue;
    }

    if (/±?\d.*dB/i.test(left)) {
      continue;
    }

    if (/^\d+\s*W$/i.test(left)) {
      specs.push({ label: 'RMS power', value: left.replace(/\s*W$/i, ' W') });
      specs.push({ label: 'Voice coil', value: right });
      continue;
    }

    if (left === 'RMS') {
      specs.push({ label: 'Continuous power capacity', value: right });
      continue;
    }

    if (left === 'Nomirsal imp/DC Resis' || left === 'Nominal imp/DC Resis') {
      specs.push({ label: 'Nominal imp / DC resistance', value: formatImpedance(right) });
      continue;
    }

    const label = left.charAt(0).toUpperCase() + left.slice(1);
    specs.push({ label, value: right });
  }
  return specs;
}

function parseProductPage(html) {
  const titleMatch =
    html.match(/<h1 class="product_title entry-title">([^<]+)</i) ||
    html.match(/<h1[^>]*class="[^"]*product_title[^"]*"[^>]*>([^<]+)/i);
  const model = titleMatch ? decodeHtml(titleMatch[1]) : 'Unknown';
  const rows = parseTableRows(html);
  const specs = normalizeHfSpecs(rows);
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
    id: `prod-hf-tweeter-${slug}`,
    model,
    categoryId: 'hf-tweeter',
    image: '/HF-tweeter.png',
    specs: specs.length ? specs : [{ label: 'Details', value: 'Contact StudioMax for specifications' }],
  };
}

async function main() {
  const data = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

  const category = data.categories.find((c) => c.id === 'hf-tweeter');
  if (category) {
    category.description = 'High-frequency tweeters and compression drivers for detail and efficiency.';
    category.overview =
      'StudioMax supplies the Almax Audio HF tweeter range—models for PA, horn loading, and OEM builds. Browse all five models below and contact us for pricing and technical support across India.';
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

  const without = data.products.filter((p) => p.categoryId !== 'hf-tweeter');
  const insertAt = without.findIndex((p) => p.categoryId === 'driver');
  const at = insertAt === -1 ? without.length : insertAt;
  without.splice(at, 0, ...products);
  data.products = without;

  fs.writeFileSync(catalogPath, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`HF tweeter: ${products.length} products synced.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
