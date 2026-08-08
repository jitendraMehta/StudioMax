import catalogJson from './catalog.json';
import type { CatalogProduct } from '../models/catalog-product.model';
import { STUDIO_PHONE_E164, STUDIO_WHATSAPP_MESSAGE } from '../constants/contact';

export interface CatalogCategory {
  id: string;
  label: string;
  icon: string;
  count: number;
  showInNav?: boolean;
}

export interface CatalogCategoryDefinition {
  id: string;
  label: string;
  icon: string;
  showInNav?: boolean;
  description: string;
  overview: string;
  tileImage: string;
  modelGroupHeading?: string;
  modelGroupHeadingEmphasis?: string;
  modelGroups?: CatalogModelGroup[];
}

export interface CatalogModelGroup {
  id: string;
  tabLabel: string;
  sectionTitle: string;
}

export interface CatalogModelGroupView extends CatalogModelGroup {
  productCount: number;
}

export interface CatalogCategoryTile extends CatalogCategoryDefinition {
  productCount: number;
}

interface CatalogJsonFile {
  categories: CatalogCategoryDefinition[];
  products: CatalogProduct[];
}

const catalog = catalogJson as CatalogJsonFile;

export const CATALOG_PRODUCTS: CatalogProduct[] = catalog.products;

const productById = new Map(CATALOG_PRODUCTS.map((product) => [product.id, product]));
const categoryById = new Map(catalog.categories.map((category) => [category.id, category]));

export function getCategoryProductCount(categoryId: string): number {
  return CATALOG_PRODUCTS.filter((product) => product.categoryId === categoryId).length;
}

export function buildCatalogCategories(): CatalogCategory[] {
  const productCount = CATALOG_PRODUCTS.length;
  return [
    { id: 'all', label: 'All Products', icon: 'grid_view', count: productCount },
    ...catalog.categories.map((category) => ({
      id: category.id,
      label: category.label,
      icon: category.icon,
      showInNav: category.showInNav,
      count: getCategoryProductCount(category.id),
    })),
  ];
}

export const CATALOG_CATEGORIES: CatalogCategory[] = buildCatalogCategories();

export const CATALOG_CATEGORY_TILES: CatalogCategoryTile[] = catalog.categories.map((category) => ({
  ...category,
  productCount: getCategoryProductCount(category.id),
}));

export function getCatalogCategoryDefinition(categoryId: string): CatalogCategoryDefinition | undefined {
  return categoryById.get(categoryId);
}

export function getProductsByCategoryId(categoryId: string): CatalogProduct[] {
  return CATALOG_PRODUCTS.filter((product) => product.categoryId === categoryId);
}

export function categoryHasModelGroups(categoryId: string): boolean {
  const definition = categoryById.get(categoryId);
  return Boolean(definition?.modelGroups?.length);
}

export function getCategoryModelGroups(categoryId: string): CatalogModelGroup[] {
  const definition = categoryById.get(categoryId);
  if (definition?.modelGroups?.length) {
    return definition.modelGroups;
  }
  return [];
}

export function getCategoryModelGroupViews(categoryId: string): CatalogModelGroupView[] {
  if (!categoryHasModelGroups(categoryId)) {
    return [];
  }
  const products = getProductsByCategoryId(categoryId);
  return getCategoryModelGroups(categoryId).map((group) => ({
    ...group,
    productCount: products.filter((product) => product.modelGroupId === group.id).length,
  }));
}

export function getProductsByModelGroup(categoryId: string, groupId: string): CatalogProduct[] {
  const products = getProductsByCategoryId(categoryId);
  if (!categoryHasModelGroups(categoryId)) {
    return products;
  }
  return products.filter((product) => product.modelGroupId === groupId);
}

export function getCatalogProductById(id: string): CatalogProduct | undefined {
  return productById.get(id);
}

export function getCatalogProductPrerenderParams(): Record<string, string>[] {
  return CATALOG_PRODUCTS.map((product) => ({ id: product.id }));
}

export function getCatalogCategoryPrerenderParams(): Record<string, string>[] {
  return catalog.categories.map((category) => ({ categoryId: category.id }));
}

export function catalogCategoryRoute(categoryId: string): string[] {
  return ['/catalog/category', categoryId];
}

export function catalogProductRoute(id: string): string[] {
  return ['/catalog/product', id];
}

export function buildWhatsAppProductUrl(productModel: string): string {
  const message = `${STUDIO_WHATSAPP_MESSAGE}\n\nProduct: ${productModel}`;
  return `https://wa.me/${STUDIO_PHONE_E164}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppCategoryUrl(categoryLabel: string): string {
  const message = `${STUDIO_WHATSAPP_MESSAGE}\n\nCategory: ${categoryLabel}`;
  return `https://wa.me/${STUDIO_PHONE_E164}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppCatalogueUrl(categoryLabel: string): string {
  const message = `${STUDIO_WHATSAPP_MESSAGE}\n\nPlease share the ${categoryLabel} catalogue (PDF).`;
  return `https://wa.me/${STUDIO_PHONE_E164}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppDatasheetUrl(model: string): string {
  const message = `${STUDIO_WHATSAPP_MESSAGE}\n\nPlease share the datasheet for ${model}.`;
  return `https://wa.me/${STUDIO_PHONE_E164}?text=${encodeURIComponent(message)}`;
}

export interface CatalogIdealForItem {
  icon: string;
  label: string;
}

export const CATALOG_IDEAL_FOR: CatalogIdealForItem[] = [
  { icon: 'temple_hindu', label: 'Temples' },
  { icon: 'theater_comedy', label: 'Auditoriums' },
  { icon: 'school', label: 'Schools' },
  { icon: 'stadium', label: 'Stages' },
  { icon: 'mosque', label: 'Mosques' },
  { icon: 'celebration', label: 'Events' },
  { icon: 'disc_full', label: 'DJ Setups' },
];

export const CATALOG_TRUST_MARKERS = [
  { icon: 'workspace_premium', label: 'Premium Quality' },
  { icon: 'verified_user', label: 'Trusted Across India' },
  { icon: 'support_agent', label: 'After Sales Support' },
] as const;

export interface CatalogHeroHighlight {
  icon: string;
  title: string;
  text: string;
}

export const CATALOG_HERO_HIGHLIGHTS: CatalogHeroHighlight[] = [
  { icon: 'speaker', title: 'Wide Model Range', text: 'Multiple configurations available' },
  { icon: 'verified_user', title: 'High Quality', text: 'Tested for professional use' },
  { icon: 'settings', title: 'Easy Integration', text: 'Standard impedance & mounting' },
  { icon: 'support_agent', title: 'Expert Support', text: 'Guidance on model selection' },
];

/** First part of hero H1 (red + underline), remainder stays dark. */
export const CATEGORY_HERO_TITLE_EMPHASIS: Record<string, string> = {
  'dj-speakers': 'DJ',
  'pa-speakers': 'PA',
  'microphone-stands': 'Microphone',
  trumpet: 'Trumpet',
  'hf-tweeter': 'HF',
  driver: 'Driver',
  'wires-cables': 'Wires',
  microphones: 'Microphones',
  accessories: 'Accessories',
};

const DEFAULT_CATEGORY_HERO_FEATURES: CatalogHeroHighlight[] = [
  { icon: 'verified_user', title: 'Genuine Range', text: 'StudioMax authorized supply' },
  { icon: 'inventory_2', title: 'Full Catalog', text: 'Models listed with specs' },
  { icon: 'support_agent', title: 'Expert Support', text: 'Help choosing the right model' },
  { icon: 'chat', title: 'Easy Enquiry', text: 'WhatsApp pricing support' },
];

const CATEGORY_HERO_FEATURES: Record<string, CatalogHeroHighlight[]> = {
  'pa-speakers': [
    { icon: 'graphic_eq', title: 'Clear Sound', text: 'High clarity audio' },
    { icon: 'verified_user', title: 'Rugged Build', text: 'Built for durability' },
    { icon: 'campaign', title: 'Wide Coverage', text: 'Even sound spread' },
    { icon: 'settings', title: 'Easy Integration', text: 'Seamless setup' },
  ],
  'dj-speakers': [
    { icon: 'speaker', title: 'High Output', text: 'Built for live events' },
    { icon: 'verified_user', title: 'Pro Grade', text: 'Studio Max speaker line' },
    { icon: 'straighten', title: 'Multiple Sizes', text: '12″, 15″ & 18″ models' },
    { icon: 'support_agent', title: 'Expert Support', text: 'Guidance on model choice' },
  ],
  'microphone-stands': [
    { icon: 'height', title: 'Stable Design', text: 'Stage & studio use' },
    { icon: 'unfold_more', title: 'Table & Floor', text: 'Two stand families' },
    { icon: 'verified_user', title: 'Durable Build', text: 'Daily professional use' },
    { icon: 'inventory_2', title: 'Wide Range', text: '20 stand models' },
  ],
  trumpet: [
    { icon: 'campaign', title: 'Focused Output', text: 'Trumpet & reflex horns' },
    { icon: 'straighten', title: 'Multiple Sizes', text: '12″ through 22″ formats' },
    { icon: 'precision_manufacturing', title: 'OEM Ready', text: 'Install & retrofit use' },
    { icon: 'support_agent', title: 'StudioMax Support', text: 'Pricing across India' },
  ],
  'hf-tweeter': [
    { icon: 'graphic_eq', title: 'HF Detail', text: 'Compression driver range' },
    { icon: 'bolt', title: 'Rated Power', text: 'Specs on every model' },
    { icon: 'hub', title: 'Horn Loading', text: 'Professional PA builds' },
    { icon: 'settings', title: 'Easy Integration', text: 'Standard mounting options' },
  ],
  driver: [
    { icon: 'settings_input_component', title: 'Drivers & Parts', text: 'Units and diaphragms' },
    { icon: 'electrical_services', title: 'Install Audio', text: '100V line drivers' },
    { icon: 'build', title: 'Quality Build', text: 'Die-cast aluminium options' },
    { icon: 'support_agent', title: 'Match & Replace', text: 'Technical enquiry support' },
  ],
  'wires-cables': [
    { icon: 'cable', title: 'Signal & Power', text: 'Mic, speaker & XLR lines' },
    { icon: 'checklist', title: 'Clear Codes', text: 'Gauge & SKU listings' },
    { icon: 'verified_user', title: 'Pro Grade', text: 'Copper & PVC specs' },
    { icon: 'chat', title: 'Bulk Orders', text: 'WhatsApp for pricing' },
  ],
  microphones: [
    { icon: 'mic', title: 'Dynamic Range', text: 'XLR stage microphones' },
    { icon: 'verified_user', title: 'Almax Models', text: 'Four models in catalog' },
    { icon: 'volume_up', title: 'Live Ready', text: 'Events & speech use' },
    { icon: 'support_agent', title: 'Pan-India', text: 'Enquiry & pricing help' },
  ],
  accessories: [
    { icon: 'extension', title: 'DJ & Rigging', text: 'Belts and hyce hardware' },
    { icon: 'construction', title: 'Metal Options', text: 'Die-cast & double hyce' },
    { icon: 'local_shipping', title: 'StudioMax Supply', text: 'Trade & bulk orders' },
    { icon: 'chat', title: 'Quick Enquiry', text: 'Share your requirement' },
  ],
};

export function getCategoryHeroFeatures(categoryId: string): CatalogHeroHighlight[] {
  return CATEGORY_HERO_FEATURES[categoryId] ?? DEFAULT_CATEGORY_HERO_FEATURES;
}

export function getCategoryHeroTitleEmphasis(categoryId: string, label: string): string {
  const mapped = CATEGORY_HERO_TITLE_EMPHASIS[categoryId];
  if (mapped) {
    return mapped;
  }
  const first = label.split(/\s+/)[0] ?? label;
  return first;
}
