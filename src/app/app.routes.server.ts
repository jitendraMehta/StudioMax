import { RenderMode, ServerRoute, PrerenderFallback } from '@angular/ssr';
import { getCatalogCategoryPrerenderParams } from './data/catalog-data';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'about', renderMode: RenderMode.Prerender },
  { path: 'contact', renderMode: RenderMode.Prerender },
  { path: 'catalog', renderMode: RenderMode.Prerender },
  {
    path: 'catalog/category/:categoryId',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Server,
    async getPrerenderParams() {
      return getCatalogCategoryPrerenderParams();
    },
  },
  { path: 'catalog/product/:id', renderMode: RenderMode.Server },
  { path: '**', renderMode: RenderMode.Prerender },
];
