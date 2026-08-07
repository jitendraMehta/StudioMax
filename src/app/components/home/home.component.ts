import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from '../hero/hero.component';
import { TrustComponent } from '../trust/trust.component';
import { CategoriesComponent } from '../categories/categories.component';
import { ValuePropComponent } from '../value-prop/value-prop.component';
import { CtaComponent } from '../cta/cta.component';

@Component({
  selector: 'studio-home',
  standalone: true,
  imports: [CommonModule, HeroComponent, TrustComponent, CategoriesComponent, ValuePropComponent, CtaComponent],  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./home.component.scss'],
  template: `
    <div class="home-hero-region">
      <studio-hero></studio-hero>
    </div>
    <studio-trust></studio-trust>
    <studio-categories></studio-categories>
    <studio-values></studio-values>
    <studio-cta></studio-cta>
  `,
})
export class HomeComponent {}
