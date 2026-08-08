import fs from 'fs';

const path = new URL('../src/app/data/catalog.json', import.meta.url);
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const groups = {
  '12-inch': [
    'AL-1210',
    'AL-1220',
    'AL-1225',
    'AL-1230 RC',
    'AL-1235 RC',
    'AL-1240 RC',
    'AL-1245 LA',
    'AL-1282 PD',
  ],
  '15-inch': [
    'AL-15/800 PULSE',
    'AL-1510 BNE',
    'AL-1510 RC',
    'AL-1520',
    'AL-1540 BNE',
    'AL-1540 V3',
    'AL-1545 SUMO',
    'AL-1545 V3',
    'AL-1550',
    'AL-1560 BNE',
    'AL-1560 Panther',
    'AL-1580 THUNDERBOLT',
    'AL-1582',
    'AL-1586',
  ],
  '18-inch': ['AL-1810 V3', 'AL-1845', 'AL-1850 PDC', 'AL-1860'],
};

function slug(model) {
  return model
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function makeProduct(model, groupId) {
  return {
    id: `prod-dj-speakers-${slug(model)}`,
    model,
    categoryId: 'dj-speakers',
    modelGroupId: groupId,
    image: '/speakers.png',
    specs: [
      {
        label: 'Detailed specifications',
        value: 'Contact StudioMax for datasheet (Studio Max)',
      },
    ],
  };
}

const djProducts = [];
for (const [groupId, models] of Object.entries(groups)) {
  models.forEach((model, i) => {
    djProducts.push(makeProduct(model, groupId));
  });
}

data.products = data.products.filter((p) => p.categoryId !== 'dj-speakers');
const paIdx = data.products.findIndex((p) => p.categoryId === 'pa-speakers');
if (paIdx === -1) {
  data.products.push(...djProducts);
} else {
  data.products.splice(paIdx, 0, ...djProducts);
}

const djCat = data.categories.find((c) => c.id === 'dj-speakers');
if (djCat) {
  djCat.overview =
    'StudioMax supplies the full Almax Audio DJ speaker line in 12", 15", and 18" sizes. Select a size tab to browse every model and contact us for datasheets and pricing.';
}

fs.writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
console.log(`Inserted ${djProducts.length} DJ speaker products.`);
