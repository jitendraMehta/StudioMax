export interface CatalogProductSpec {
  label: string;
  value: string;
}

export interface CatalogProduct {
  id: string;
  model: string;
  categoryId: string;
  modelGroupId?: string;
  image: string;
  specs: CatalogProductSpec[];
}
