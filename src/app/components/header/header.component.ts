import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catalogCategoryRoute } from '../../data/catalog-data';
import { CATALOG_MENU_ITEMS } from '../../navigation/catalog-menu';
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

  private catalogCloseTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
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
    return this.router.url.startsWith('/catalog');
  }

  catalogCategoryLink(id: string): string[] {
    return catalogCategoryRoute(id);
  }
}

