import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from '../../models/site.model';
import { InViewDirective } from '../../directives/in-view.directive';

@Component({
  selector: 'studio-categories',
  standalone: true,
  imports: [CommonModule, InViewDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent {
  categories: Category[] = [
    {
      id: 'driver',
      title: 'Driver Unit & Diaphragm',
      subtitle: 'High-Performance Audio Components',
      image: '/driver.jpeg',
    },
    {
      id: 'speaker',
      title: 'Studio Speakers',
      subtitle: 'High-Fidelity Monitoring',
      image: '/speakers.png',
    },
    {
      id: 'trumpet',
      title: 'Trumpet & Reflex Horn',
      subtitle: 'Precision Sound Projection',
      image: '/trumpet.png',
    },
  ];

  trackById(index: number, item: Category) {
    return item.id;
  }
}
