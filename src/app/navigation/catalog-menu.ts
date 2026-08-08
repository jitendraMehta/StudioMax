export interface CatalogCategory {
  id: string;
  label: string;
  icon: string;
  count: number;
  showInNav?: boolean;
}

export interface CatalogMenuItem {
  id: string;
  label: string;
}

export { CATALOG_CATEGORIES } from '../data/catalog-data';

import { CATALOG_CATEGORIES } from '../data/catalog-data';

/** Header / footer catalog links (excludes “All Products”). Order matches the Products dropdown. */
export const CATALOG_MENU_ITEMS: CatalogMenuItem[] = CATALOG_CATEGORIES.filter((c) => c.showInNav).map(
  ({ id, label }) => ({ id, label }),
);

/** Maps old category query params to current ids. */
export const LEGACY_CATEGORY_ALIASES: Record<string, string> = {
  horn: 'hf-tweeter',
  speaker: 'pa-speakers',
  projector: 'pa-speakers',
  crossover: 'accessories',
  amplifier: 'pa-speakers',
};

export function normalizeCategoryId(id: string | null | undefined): string {
  if (!id) {
    return 'all';
  }
  return LEGACY_CATEGORY_ALIASES[id] ?? id;
}
