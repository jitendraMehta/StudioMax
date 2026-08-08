import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CATALOG_CATEGORY_TILES, catalogCategoryRoute } from '../../data/catalog-data';
import type { CatalogCategoryTile } from '../../data/catalog-data';
import { normalizeCategoryId } from '../../navigation/catalog-menu';

import { PageHeroComponent } from '../page-hero/page-hero.component';

@Component({
  selector: 'studio-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule, PageHeroComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss'],
})
export class CatalogComponent implements OnInit {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly categories = CATALOG_CATEGORY_TILES;

  ngOnInit(): void {
    this.title.setTitle('Product Catalogue — StudioMax Professional Audio');
    this.meta.updateTag({
      name: 'description',
      content:
        'Explore StudioMax professional audio categories — DJ speakers, PA systems, drivers, microphones, and accessories.',
    });
    this.meta.updateTag({ name: 'robots', content: 'index,follow' });

    const legacyCategory = this.route.snapshot.queryParamMap.get('category');
    if (legacyCategory) {
      const normalized = normalizeCategoryId(legacyCategory);
      if (normalized !== 'all' && this.categories.some((c) => c.id === normalized)) {
        void this.router.navigate(catalogCategoryRoute(normalized), { replaceUrl: true });
      }
    }
  }

  categoryRoute(category: CatalogCategoryTile): string[] {
    return catalogCategoryRoute(category.id);
  }
}
