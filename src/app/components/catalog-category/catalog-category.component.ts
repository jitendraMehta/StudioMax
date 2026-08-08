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
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  buildWhatsAppCategoryUrl,
  buildWhatsAppDatasheetUrl,
  buildWhatsAppProductUrl,
  CATALOG_HERO_HIGHLIGHTS,
  CATALOG_IDEAL_FOR,
  CATALOG_TRUST_MARKERS,
  categoryHasModelGroups,
  getCatalogCategoryDefinition,
  getCategoryModelGroupViews,
  getProductsByCategoryId,
  getProductsByModelGroup,
} from '../../data/catalog-data';
import type { CatalogProduct } from '../../models/catalog-product.model';
import type { CatalogProductSpec } from '../../models/catalog-product.model';
import { normalizeCategoryId } from '../../navigation/catalog-menu';

@Component({
  selector: 'studio-catalog-category',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './catalog-category.component.html',
  styleUrls: ['./catalog-category.component.scss'],
})
export class CatalogCategoryComponent implements OnInit {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly idealFor = CATALOG_IDEAL_FOR;
  readonly trustMarkers = CATALOG_TRUST_MARKERS;
  readonly categoryHighlights = CATALOG_HERO_HIGHLIGHTS;

  readonly categoryId = signal<string | null>(null);
  readonly categoryLabel = signal('');
  readonly categoryOverview = signal('');
  readonly modelGroupHeading = signal('Browse models');
  readonly modelGroupHeadingEmphasis = signal('');
  readonly activeGroupId = signal<string | null>(null);
  readonly expandedProductId = signal<string | null>(null);

  readonly modelGroups = computed(() => {
    const id = this.categoryId();
    if (!id) {
      return [];
    }
    return getCategoryModelGroupViews(id);
  });

  readonly hasModelGroups = computed(() => {
    const id = this.categoryId();
    return id ? categoryHasModelGroups(id) : false;
  });

  readonly activeGroup = computed(() => {
    const groups = this.modelGroups();
    const activeId = this.activeGroupId();
    return groups.find((group) => group.id === activeId) ?? groups[0] ?? null;
  });

  readonly groupProducts = computed(() => {
    const id = this.categoryId();
    if (!id) {
      return [];
    }
    if (!categoryHasModelGroups(id)) {
      return getProductsByCategoryId(id);
    }
    const groupId = this.activeGroupId();
    if (!groupId) {
      return [];
    }
    return getProductsByModelGroup(id, groupId);
  });

  readonly modelGroupHeadingPrefix = computed(() => {
    const heading = this.modelGroupHeading();
    const emphasis = this.modelGroupHeadingEmphasis();
    if (!emphasis || !heading.endsWith(emphasis)) {
      return heading;
    }
    return heading.slice(0, heading.length - emphasis.length).trimEnd();
  });

  readonly productTypeLabel = computed(() => {
    const label = this.categoryLabel();
    if (!label) {
      return 'Professional audio product';
    }
    const singular = label.replace(/\s+s\s*$/i, '').trim();
    return `Professional ${singular}`;
  });

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const raw = params.get('categoryId');
      const normalized = normalizeCategoryId(raw);
      const definition = getCatalogCategoryDefinition(normalized);

      if (!definition || normalized === 'all') {
        void this.router.navigate(['/catalog']);
        return;
      }

      this.categoryId.set(normalized);
      this.categoryLabel.set(definition.label);
      this.categoryOverview.set(definition.overview);
      this.modelGroupHeading.set(definition.modelGroupHeading ?? 'Browse models');
      this.modelGroupHeadingEmphasis.set(definition.modelGroupHeadingEmphasis ?? '');
      this.expandedProductId.set(null);

      const groups = getCategoryModelGroupViews(normalized);
      if (categoryHasModelGroups(normalized)) {
        const firstWithProducts = groups.find((group) => group.productCount > 0) ?? groups[0];
        this.activeGroupId.set(firstWithProducts?.id ?? null);
      } else {
        this.activeGroupId.set(null);
      }

      this.title.setTitle(`${definition.label} — StudioMax Professional Audio`);
      this.meta.updateTag({
        name: 'description',
        content: definition.overview,
      });
      this.meta.updateTag({ name: 'robots', content: 'index,follow' });
    });
  }

  selectGroup(groupId: string, productCount: number): void {
    if (productCount === 0) {
      return;
    }
    this.activeGroupId.set(groupId);
    this.expandedProductId.set(null);
  }

  isGroupActive(groupId: string): boolean {
    return this.activeGroupId() === groupId;
  }

  toggleProduct(product: CatalogProduct): void {
    const current = this.expandedProductId();
    this.expandedProductId.set(current === product.id ? null : product.id);
  }

  isProductExpanded(productId: string): boolean {
    return this.expandedProductId() === productId;
  }

  specColumns(product: CatalogProduct): [CatalogProductSpec[], CatalogProductSpec[]] {
    const mid = Math.ceil(product.specs.length / 2);
    return [product.specs.slice(0, mid), product.specs.slice(mid)];
  }

  whatsappCategoryUrl(): string {
    return buildWhatsAppCategoryUrl(this.categoryLabel());
  }

  whatsappProductUrl(model: string): string {
    return buildWhatsAppProductUrl(model);
  }

  whatsappDatasheetUrl(model: string): string {
    return buildWhatsAppDatasheetUrl(model);
  }
}
