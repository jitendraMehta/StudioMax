/** Parked legacy catalog (filters/sidebar). Not linked from app routes. */
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  CATALOG_CATEGORIES,
  normalizeCategoryId,
  type CatalogCategory,
} from '../../navigation/catalog-menu';
import { CATALOG_PRODUCTS, catalogProductRoute, getCatalogCategoryDefinition } from '../../data/catalog-products';
import type { CatalogProduct } from '../../models/catalog-product.model';

interface CatalogTrustItem {
  icon: string;
  title: string;
  subtitle: string;
}

type SortOption = 'name-asc';
type ViewMode = 'grid' | 'list';

@Component({
  selector: 'studio-catalog-legacy',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './catalog-legacy.component.html',
  styleUrls: ['./catalog-legacy.component.scss'],
})
export class CatalogLegacyComponent implements OnInit {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly categories: CatalogCategory[] = CATALOG_CATEGORIES;
  readonly sortOptions: { value: SortOption; label: string }[] = [
    { value: 'name-asc', label: 'Name: A–Z' },
  ];
  readonly trustItems: CatalogTrustItem[] = [
    { icon: 'verified_user', title: '100% Genuine Products', subtitle: 'Authentic & quality assured' },
    { icon: 'local_shipping', title: 'Pan India Delivery', subtitle: 'Fast & secure shipping' },
    { icon: 'headset_mic', title: 'Expert Support', subtitle: 'Technical guidance' },
    { icon: 'sell', title: 'Bulk Order Discount', subtitle: 'Best pricing for bulk orders' },
  ];

  readonly products = signal<CatalogProduct[]>(CATALOG_PRODUCTS);

  readonly selectedCategory = signal('all');
  readonly sortBy = signal<SortOption>('name-asc');
  readonly viewMode = signal<ViewMode>('grid');
  readonly page = signal(1);
  readonly pageSize = 12;

  readonly filteredProducts = computed(() => {
    let list = [...this.products()];

    const category = this.selectedCategory();
    if (category !== 'all') {
      list = list.filter((p) => p.categoryId === category);
    }

    list.sort((a, b) => a.model.localeCompare(b.model));

    return list;
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredProducts().length / this.pageSize)),
  );

  readonly pagedProducts = computed(() => {
    const list = this.filteredProducts();
    const start = (this.page() - 1) * this.pageSize;
    return list.slice(start, start + this.pageSize);
  });

  readonly showingRange = computed(() => {
    const total = this.filteredProducts().length;
    if (total === 0) {
      return { from: 0, to: 0, total: 0 };
    }
    const from = (this.page() - 1) * this.pageSize + 1;
    const to = Math.min(this.page() * this.pageSize, total);
    return { from, to, total };
  });

  readonly paginationItems = computed(() => this.buildPagination(this.page(), this.totalPages()));

  ngOnInit(): void {
    this.title.setTitle('Product Catalog — StudioMax Professional Audio');
    this.meta.updateTag({
      name: 'description',
      content:
        'Browse StudioMax professional audio components — drivers, speakers, horns, projectors, crossovers, and amplifiers.',
    });
    this.meta.updateTag({ name: 'robots', content: 'index,follow' });

    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const category = normalizeCategoryId(params.get('category'));
      const valid = this.categories.some((c) => c.id === category);
      this.selectedCategory.set(valid ? category : 'all');
      this.page.set(1);
    });
  }

  selectCategory(categoryId: string): void {
    this.selectedCategory.set(categoryId);
    this.page.set(1);
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: categoryId === 'all' ? { category: null } : { category: categoryId },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  isCategoryActive(categoryId: string): boolean {
    return this.selectedCategory() === categoryId;
  }

  onSortChange(value: SortOption): void {
    this.sortBy.set(value);
    this.page.set(1);
  }

  setViewMode(mode: ViewMode): void {
    this.viewMode.set(mode);
  }

  setPage(page: number): void {
    const safe = Math.min(Math.max(1, page), this.totalPages());
    this.page.set(safe);
  }

  prevPage(): void {
    this.setPage(this.page() - 1);
  }

  nextPage(): void {
    this.setPage(this.page() + 1);
  }

  trackByProductId(_index: number, product: CatalogProduct): string {
    return product.id;
  }

  productDetailLink(product: CatalogProduct): string[] {
    return catalogProductRoute(product.id);
  }

  categoryLabelFor(product: CatalogProduct): string {
    return getCatalogCategoryDefinition(product.categoryId)?.label ?? product.categoryId;
  }

  private buildPagination(current: number, total: number): (number | 'ellipsis')[] {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const items: (number | 'ellipsis')[] = [1];
    if (current > 3) {
      items.push('ellipsis');
    }
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let p = start; p <= end; p++) {
      items.push(p);
    }
    if (current < total - 2) {
      items.push('ellipsis');
    }
    items.push(total);
    return items;
  }
}

