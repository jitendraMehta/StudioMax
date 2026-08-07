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

export interface CatalogProduct {
  id: string;
  model: string;
  categoryId: string;
  categoryLabel: string;
  description: string;
  brand: string;
  priceInr: number;
  powerWatts: number;
  inStock: boolean;
  image: string;
  featured: boolean;
}

interface PowerRangeOption {
  id: string;
  label: string;
  min: number;
  max: number | null;
}

interface CatalogTrustItem {
  icon: string;
  title: string;
  subtitle: string;
}

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc';
type ViewMode = 'grid' | 'list';

@Component({
  selector: 'studio-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss'],
})
export class CatalogComponent implements OnInit {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly categories: CatalogCategory[] = CATALOG_CATEGORIES;
  readonly brandOptions = ['Krown', 'Almax Audio', 'StudioMax', 'ProAudio Labs', 'SoundTech'];
  readonly sortOptions: { value: SortOption; label: string }[] = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A–Z' },
  ];
  readonly powerRangeOptions: PowerRangeOption[] = [
    { id: '0-100', label: '0 – 100W', min: 0, max: 100 },
    { id: '100-500', label: '100 – 500W', min: 100, max: 500 },
    { id: '500-1000', label: '500 – 1000W', min: 500, max: 1000 },
    { id: '1000+', label: '1000W+', min: 1000, max: null },
  ];
  readonly trustItems: CatalogTrustItem[] = [
    { icon: 'verified_user', title: '100% Genuine Products', subtitle: 'Authentic & quality assured' },
    { icon: 'local_shipping', title: 'Pan India Delivery', subtitle: 'Fast & secure shipping' },
    { icon: 'headset_mic', title: 'Expert Support', subtitle: 'Technical guidance' },
    { icon: 'sell', title: 'Bulk Order Discount', subtitle: 'Best pricing for bulk orders' },
  ];

  readonly priceCeiling = 50_000;

  readonly products = signal<CatalogProduct[]>(this.buildProductCatalog());

  readonly selectedCategory = signal('all');
  readonly selectedBrand = signal('');
  readonly priceMin = signal(0);
  readonly priceMax = signal(this.priceCeiling);
  readonly selectedPowerRanges = signal<Set<string>>(new Set());
  readonly filterInStock = signal(true);
  readonly filterOutOfStock = signal(true);
  readonly sortBy = signal<SortOption>('featured');
  readonly viewMode = signal<ViewMode>('grid');
  readonly page = signal(1);
  readonly pageSize = 12;
  readonly wishlist = signal<Set<string>>(new Set());

  readonly filteredProducts = computed(() => {
    let list = [...this.products()];

    const category = this.selectedCategory();
    if (category !== 'all') {
      list = list.filter((p) => p.categoryId === category);
    }

    const brand = this.selectedBrand();
    if (brand) {
      list = list.filter((p) => p.brand === brand);
    }

    const min = this.priceMin();
    const max = this.priceMax();
    list = list.filter((p) => p.priceInr >= min && p.priceInr <= max);

    const powerRanges = this.selectedPowerRanges();
    if (powerRanges.size > 0) {
      list = list.filter((p) => this.matchesPowerRange(p.powerWatts, powerRanges));
    }

    const showIn = this.filterInStock();
    const showOut = this.filterOutOfStock();
    if (!showIn || !showOut) {
      list = list.filter((p) => (p.inStock ? showIn : showOut));
    }

    const sort = this.sortBy();
    list.sort((a, b) => {
      switch (sort) {
        case 'price-asc':
          return a.priceInr - b.priceInr;
        case 'price-desc':
          return b.priceInr - a.priceInr;
        case 'name-asc':
          return a.model.localeCompare(b.model);
        default:
          return Number(b.featured) - Number(a.featured) || a.model.localeCompare(b.model);
      }
    });

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

  readonly availabilityCounts = computed(() => {
    const base = this.productsForCategoryCounts();
    return {
      inStock: base.filter((p) => p.inStock).length,
      outOfStock: base.filter((p) => !p.inStock).length,
    };
  });

  readonly powerRangeCounts = computed(() => {
    const base = this.productsForCategoryCounts();
    const counts: Record<string, number> = {};
    for (const range of this.powerRangeOptions) {
      counts[range.id] = base.filter((p) => this.productInPowerRange(p.powerWatts, range)).length;
    }
    return counts;
  });

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

  onBrandChange(value: string): void {
    this.selectedBrand.set(value);
    this.page.set(1);
  }

  onPriceMinChange(value: number): void {
    const max = this.priceMax();
    this.priceMin.set(Math.min(value, max));
    this.page.set(1);
  }

  onPriceMaxChange(value: number): void {
    const min = this.priceMin();
    this.priceMax.set(Math.max(value, min));
    this.page.set(1);
  }

  togglePowerRange(rangeId: string, checked: boolean): void {
    this.selectedPowerRanges.update((current) => {
      const next = new Set(current);
      if (checked) {
        next.add(rangeId);
      } else {
        next.delete(rangeId);
      }
      return next;
    });
    this.page.set(1);
  }

  isPowerRangeSelected(rangeId: string): boolean {
    return this.selectedPowerRanges().has(rangeId);
  }

  onAvailabilityChange(): void {
    this.page.set(1);
  }

  onSortChange(value: SortOption): void {
    this.sortBy.set(value);
    this.page.set(1);
  }

  setViewMode(mode: ViewMode): void {
    this.viewMode.set(mode);
  }

  clearAllFilters(): void {
    this.selectedBrand.set('');
    this.priceMin.set(0);
    this.priceMax.set(this.priceCeiling);
    this.selectedPowerRanges.set(new Set());
    this.filterInStock.set(true);
    this.filterOutOfStock.set(true);
    this.sortBy.set('featured');
    this.page.set(1);
    this.selectCategory('all');
  }

  toggleWishlist(productId: string): void {
    this.wishlist.update((current) => {
      const next = new Set(current);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  }

  isWishlisted(productId: string): boolean {
    return this.wishlist().has(productId);
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

  formatInr(value: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  }

  private productsForCategoryCounts(): CatalogProduct[] {
    const category = this.selectedCategory();
    if (category === 'all') {
      return this.products();
    }
    return this.products().filter((p) => p.categoryId === category);
  }

  private matchesPowerRange(watts: number, selected: Set<string>): boolean {
    return this.powerRangeOptions.some(
      (range) => selected.has(range.id) && this.productInPowerRange(watts, range),
    );
  }

  private productInPowerRange(watts: number, range: PowerRangeOption): boolean {
    if (range.max === null) {
      return watts >= range.min;
    }
    return watts >= range.min && watts <= range.max;
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

  private buildProductCatalog(): CatalogProduct[] {
    const images: Record<string, string> = {
      driver: '/PA-driver-unit.png',
      speaker: '/speakers.png',
      horn: '/trumpet.png',
      projector: '/speaker.png',
      accessories: '/driver.jpeg',
      crossover: '/PA-driver-unit.png',
      amplifier: '/speaker.png',
    };

    const prefixes: Record<string, string> = {
      driver: 'SM-DU',
      speaker: 'SM-WS',
      horn: 'SM-TH',
      projector: 'SM-SP',
      accessories: 'SM-AC',
      crossover: 'SM-CX',
      amplifier: 'SM-AM',
    };

    const descriptions: Record<string, string> = {
      driver:
        'High-performance driver unit engineered for clarity, durability and consistent output in professional systems.',
      speaker:
        'Studio-grade speaker built for accurate monitoring with balanced response and rugged enclosure design.',
      horn:
        'Precision horn and tweeter assembly for focused projection and extended high-frequency detail.',
      projector:
        'Compact sound projector designed for speech intelligibility and even coverage in commercial spaces.',
      accessories:
        'Professional audio accessory built for reliable connectivity and long-term installation use.',
      crossover:
        'Active crossover network for precise frequency division and optimized multi-way speaker performance.',
      amplifier:
        'High-efficiency amplifier delivering stable power for demanding live and installation applications.',
    };

    const products: CatalogProduct[] = [];
    let index = 0;

    for (const category of CATALOG_CATEGORIES) {
      if (category.id === 'all') {
        continue;
      }

      for (let i = 0; i < category.count; i++) {
        index += 1;
        const model = `${prefixes[category.id]}${750 + index}`;
        products.push({
          id: `prod-${category.id}-${i + 1}`,
          model,
          categoryId: category.id,
          categoryLabel: category.label,
          description: descriptions[category.id],
          brand: this.brandOptions[index % this.brandOptions.length],
          priceInr: 4_500 + ((index * 1_137) % 46_000),
          powerWatts: [75, 120, 250, 600, 850, 1200][index % 6],
          inStock: index % 5 !== 0,
          image: images[category.id],
          featured: index <= 12,
        });
      }
    }

    return products;
  }
}
