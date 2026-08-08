import fs from 'fs';

/** Keys kept on each product — matches active catalog UI usage. */
const PRODUCT_KEYS = ['id', 'model', 'categoryId', 'modelGroupId', 'image', 'specs'];

const catalogPath = new URL('../src/app/data/catalog.json', import.meta.url);
const data = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

let pruned = 0;
data.products = data.products.map((product) => {
  const next = {};
  for (const key of PRODUCT_KEYS) {
    if (product[key] !== undefined && product[key] !== null) {
      next[key] = product[key];
    }
  }
  if (Object.keys(product).length !== Object.keys(next).length) {
    pruned++;
  }
  return next;
});

fs.writeFileSync(catalogPath, `${JSON.stringify(data, null, 2)}\n`);
console.log(`Pruned ${pruned} of ${data.products.length} products to keys: ${PRODUCT_KEYS.join(', ')}`);
