import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  computed,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { catalogCategoryRoute } from '../../data/catalog-data';
import { CORE_COLLECTIONS, type CoreCollectionItem } from './core-collections';



@Component({

  selector: 'studio-categories',

  standalone: true,

  imports: [CommonModule, RouterModule],

  changeDetection: ChangeDetectionStrategy.OnPush,

  templateUrl: './categories.component.html',

  styleUrls: ['./categories.component.scss'],

})

export class CategoriesComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  readonly collections = CORE_COLLECTIONS;



  readonly current = signal(0);

  readonly itemsPerView = signal(1);



  readonly maxIndex = computed(() =>

    Math.max(0, this.collections.length - this.itemsPerView()),

  );



  readonly pageCount = computed(() => this.maxIndex() + 1);



  readonly trackTransform = computed(() => {

    const perView = this.itemsPerView();

    const step = 100 / perView;

    return `translateX(-${this.current() * step}%)`;

  });



  readonly dotIndexes = computed(() =>

    Array.from({ length: this.pageCount() }, (_, index) => index),

  );



  private autoplayId: ReturnType<typeof setInterval> | null = null;

  private startX = 0;

  private dragging = false;

  private readonly autoplayIntervalMs = 6000;

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }
      this.syncItemsPerView();
      this.startAutoplay();
      const onResize = (): void => {
        this.syncItemsPerView();
      };
      window.addEventListener('resize', onResize, { passive: true });
      this.destroyRef.onDestroy(() => {
        window.removeEventListener('resize', onResize);
        this.stopAutoplay();
      });
    });
  }

  trackById(_index: number, item: CoreCollectionItem): string {

    return item.id;

  }



  catalogCategoryLink(item: CoreCollectionItem): string[] | null {
    return item.catalogCategory ? catalogCategoryRoute(item.catalogCategory) : null;
  }



  syncItemsPerView(): void {

    const width = window.innerWidth;

    if (width >= 1024) {

      this.itemsPerView.set(3);

    } else if (width >= 640) {

      this.itemsPerView.set(2);

    } else {

      this.itemsPerView.set(1);

    }

    this.clampCurrent();

  }



  clampCurrent(): void {

    const max = this.maxIndex();

    if (this.current() > max) {

      this.current.set(max);

    }

  }



  setSlide(index: number): void {

    const max = this.maxIndex();

    this.current.set(Math.min(Math.max(0, index), max));

  }



  prev(): void {

    this.setSlide(this.current() - 1);

  }



  next(): void {

    this.setSlide(this.current() + 1);

  }



  startAutoplay(): void {

    this.stopAutoplay();

    this.autoplayId = setInterval(() => {

      const max = this.maxIndex();

      this.current.update((value) => (value >= max ? 0 : value + 1));

    }, this.autoplayIntervalMs);

  }



  stopAutoplay(): void {

    if (this.autoplayId !== null) {

      clearInterval(this.autoplayId);

      this.autoplayId = null;

    }

  }



  pauseAutoplay(): void {

    this.stopAutoplay();

  }



  resumeAutoplay(): void {

    this.startAutoplay();

  }



  onPointerDown(event: PointerEvent): void {

    this.dragging = true;

    this.startX = event.clientX;

    this.pauseAutoplay();

  }



  onPointerUp(event: PointerEvent): void {

    if (!this.dragging) {

      return;

    }

    this.dragging = false;

    const delta = event.clientX - this.startX;

    if (Math.abs(delta) > 48) {

      delta < 0 ? this.next() : this.prev();

    }

    this.resumeAutoplay();

  }



  onPointerCancel(): void {

    this.dragging = false;

    this.resumeAutoplay();

  }

}


