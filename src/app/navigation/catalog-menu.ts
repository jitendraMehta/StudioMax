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

export const CATALOG_CATEGORIES: CatalogCategory[] = [
  { id: 'all', label: 'All Products', icon: 'grid_view', count: 145 },
  {
    id: 'driver',
    label: 'Driver Unit & Diaphragm',
    icon: 'settings_input_component',
    count: 24,
    showInNav: true,
  },
  { id: 'speaker', label: 'Studio Speakers', icon: 'speaker', count: 32, showInNav: true },
  { id: 'horn', label: 'Horn & Tweeter', icon: 'campaign', count: 18, showInNav: true },
  { id: 'projector', label: 'Sound Projectors', icon: 'surround_sound', count: 16 },
  { id: 'accessories', label: 'Audio Accessories', icon: 'cable', count: 27, showInNav: true },
  { id: 'crossover', label: 'Crossovers', icon: 'tune', count: 12, showInNav: true },
  { id: 'amplifier', label: 'Amplifiers', icon: 'bolt', count: 14 },
];

/** Header / footer catalog links (excludes “All Products” and non-nav categories). */
export const CATALOG_MENU_ITEMS: CatalogMenuItem[] = CATALOG_CATEGORIES.filter((c) => c.showInNav).map(
  ({ id, label }) => ({ id, label }),
);

/** @deprecated Use `horn` — kept for old `?category=trumpet` links. */
export const LEGACY_CATEGORY_ALIASES: Record<string, string> = {
  trumpet: 'horn',
};

export function normalizeCategoryId(id: string | null | undefined): string {
  if (!id) {
    return 'all';
  }
  return LEGACY_CATEGORY_ALIASES[id] ?? id;
}
