import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catalogCategoryRoute, getCatalogProductById } from '../../data/catalog-data';

/** Legacy product URLs redirect to the category detail page (model anchor when known). */
@Component({
  selector: 'studio-product-detail',
  standalone: true,
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const id = params.get('id');
      const product = id ? getCatalogProductById(id) : undefined;

      if (product) {
        void this.router.navigate(catalogCategoryRoute(product.categoryId), { replaceUrl: true });
        return;
      }

      void this.router.navigate(['/catalog'], { replaceUrl: true });
    });
  }
}
