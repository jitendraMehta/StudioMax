import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'studio-page-hero',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './page-hero.component.html',
  styleUrls: ['./page-hero.component.scss'],
})
export class PageHeroComponent {
  readonly eyebrow = input.required<string>();
  readonly titleBefore = input<string>('');
  readonly titleAccent = input<string>('');
  readonly titleAfter = input<string>('');
  readonly lead = input<string>('');
  readonly headingId = input<string>('page-hero-heading');
  readonly compact = input<boolean>(false);
}
