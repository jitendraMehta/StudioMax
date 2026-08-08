import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catalogCategoryRoute, getCatalogProductById } from '../../data/catalog-data';
import { CATALOG_MENU_ITEMS, normalizeCategoryId } from '../../navigation/catalog-menu';
import { STUDIO_WHATSAPP_URL } from '../../constants/contact';

@Component({
  selector: 'studio-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly menuOpen = signal(false);
  readonly catalogOpen = signal(false);
  readonly catalogMobileOpen = signal(false);
  readonly catalogMenuItems = CATALOG_MENU_ITEMS;
  readonly whatsappUrl = STUDIO_WHATSAPP_URL;
  /** Normalized category id when on a category or product catalog route. */
  readonly activeCatalogCategoryId = signal<string | null>(null);
  readonly catalogAllProductsActive = signal(false);
  readonly catalogNavActive = signal(false);

  private catalogCloseTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.syncCatalogNavFromUrl(this.router.url);

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => {
        this.syncCatalogNavFromUrl(event.urlAfterRedirects);
        this.menuOpen.set(false);
        this.closeCatalogDropdown();
        this.catalogMobileOpen.set(false);
      });
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  toggleCatalogDropdown(): void {
    if (this.catalogCloseTimer) {
      clearTimeout(this.catalogCloseTimer);
      this.catalogCloseTimer = null;
    }
    this.catalogOpen.update((open) => !open);
  }

  openCatalogDropdown(): void {
    if (this.catalogCloseTimer) {
      clearTimeout(this.catalogCloseTimer);
      this.catalogCloseTimer = null;
    }
    this.catalogOpen.set(true);
  }

  closeCatalogDropdown(): void {
    if (this.catalogCloseTimer) {
      clearTimeout(this.catalogCloseTimer);
      this.catalogCloseTimer = null;
    }
    this.catalogOpen.set(false);
  }

  scheduleCloseCatalogDropdown(): void {
    if (this.catalogCloseTimer) {
      clearTimeout(this.catalogCloseTimer);
    }
    this.catalogCloseTimer = setTimeout(() => {
      this.catalogOpen.set(false);
      this.catalogCloseTimer = null;
    }, 160);
  }

  toggleCatalogMobile(): void {
    this.catalogMobileOpen.update((open) => !open);
  }

  isCatalogRouteActive(): boolean {
    return this.catalogNavActive();
  }

  isCatalogAllProductsActive(): boolean {
    return this.catalogAllProductsActive();
  }

  isCatalogMenuItemActive(categoryId: string): boolean {
    const active = this.activeCatalogCategoryId();
    return active !== null && active === normalizeCategoryId(categoryId);
  }

  catalogCategoryLink(id: string): string[] {
    return catalogCategoryRoute(id);
  }

  private syncCatalogNavFromUrl(url: string): void {
    const path = url.split('?')[0].split('#')[0];

    if (!path.startsWith('/catalog')) {
      this.catalogNavActive.set(false);
      this.catalogAllProductsActive.set(false);
      this.activeCatalogCategoryId.set(null);
      return;
    }

    this.catalogNavActive.set(true);

    if (path === '/catalog' || path === '/catalog/') {
      this.catalogAllProductsActive.set(true);
      this.activeCatalogCategoryId.set(null);
      return;
    }

    const categoryMatch = /^\/catalog\/category\/([^/]+)/.exec(path);
    if (categoryMatch) {
      this.catalogAllProductsActive.set(false);
      this.activeCatalogCategoryId.set(normalizeCategoryId(decodeURIComponent(categoryMatch[1])));
      return;
    }

    const productMatch = /^\/catalog\/product\/([^/]+)/.exec(path);
    if (productMatch) {
      const product = getCatalogProductById(decodeURIComponent(productMatch[1]));
      this.catalogAllProductsActive.set(false);
      this.activeCatalogCategoryId.set(
        product ? normalizeCategoryId(product.categoryId) : null,
      );
      return;
    }

    this.catalogAllProductsActive.set(false);
    this.activeCatalogCategoryId.set(null);
  }
}

