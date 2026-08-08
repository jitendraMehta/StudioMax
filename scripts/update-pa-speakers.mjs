import fs from 'fs';

const catalogPath = new URL('../src/app/data/catalog.json', import.meta.url);
const data = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

const paProducts = [
  {
    id: 'prod-pa-speakers-cube-30',
    model: 'Cube 30',
    categoryId: 'pa-speakers',
    image: '/pa-speaker.png',
    specs: [
      { label: 'Model', value: 'Cube 30' },
      { label: 'Output power', value: '20 W RMS / 25 W max' },
      { label: 'Speaker', value: '8″ / 4 Ω' },
      { label: 'Input', value: '3 mic / 1 AUX' },
      { label: 'Tone control', value: 'Bass / treble (+/−) 10 dB' },
      { label: 'Frequency response', value: '80 Hz – 10 kHz' },
      {
        label: 'Power supply',
        value: 'AC 220–250 V 50/60 Hz; DC 12 V; inbuilt rechargeable battery',
      },
      { label: 'Battery usage time', value: '4 hours at moderate volume' },
      {
        label: 'Indicator',
        value: 'Main / battery charging and amplifier ON',
      },
      { label: 'Dimensions (H × W × D)', value: '345 × 275 × 170 mm' },
      { label: 'Weight', value: '6.500 kg' },
    ],
  },
  {
    id: 'prod-pa-speakers-metal-column-speaker',
    model: 'Metal Column Speaker',
    categoryId: 'pa-speakers',
    image: '/pa-speaker.png',
    specs: [
      { label: 'Model variants', value: 'SCM 10 T / SCM 15 T' },
      { label: 'Input power', value: '20 W RMS / 30 W max' },
      { label: 'Power taps', value: '10 W' },
      { label: 'Dimensions (W × H × D)', value: '165 × 885 × 145 mm' },
      { label: 'Weight (SCM 10 T)', value: '2.83 kg' },
      { label: 'Weight (SCM 15 T)', value: '2.85 kg' },
    ],
  },
];

const category = data.categories.find((c) => c.id === 'pa-speakers');
if (category) {
  category.description = 'Portable and install PA solutions including powered cubes and column speakers.';
  category.overview =
    'StudioMax supplies Almax Audio PA speakers for speech, announcements, and background music. Browse Cube 30 and metal column models below—contact us for pricing and integration support across India.';
  delete category.modelGroupHeading;
  delete category.modelGroupHeadingEmphasis;
  delete category.modelGroups;
}

const withoutPa = data.products.filter((p) => p.categoryId !== 'pa-speakers');
const insertAt = withoutPa.findIndex((p) => p.categoryId === 'microphone-stands');
const at = insertAt === -1 ? withoutPa.length : insertAt;
withoutPa.splice(at, 0, ...paProducts);
data.products = withoutPa;

fs.writeFileSync(catalogPath, `${JSON.stringify(data, null, 2)}\n`);
console.log(`PA speakers: ${paProducts.length} products (removed placeholders).`);
