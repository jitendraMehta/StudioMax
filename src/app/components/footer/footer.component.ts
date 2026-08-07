import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CATALOG_MENU_ITEMS } from '../../navigation/catalog-menu';

interface FooterLink {
  label: string;
  route: string;
  queryParams?: Record<string, string>;
}

@Component({
  selector: 'studio-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  readonly categoryLinks = CATALOG_MENU_ITEMS.map((item) => ({
    label: item.label,
    route: '/catalog',
    queryParams: { category: item.id },
  }));

  readonly supportLinks: FooterLink[] = [
    { label: 'Categories', route: '/catalog' },
    { label: 'About Us', route: '/about' },
    { label: 'Contact Us', route: '/contact' },
    { label: 'Bulk Order Enquiry', route: '/contact' },
    { label: 'Installation Support', route: '/contact' },
  ];
}
