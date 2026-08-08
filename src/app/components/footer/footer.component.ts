import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { catalogCategoryRoute } from '../../data/catalog-data';
import { CATALOG_MENU_ITEMS } from '../../navigation/catalog-menu';
import { STUDIO_PHONE_DISPLAY, STUDIO_PHONE_TEL } from '../../constants/contact';

interface FooterLink {
  label: string;
  route: string | string[];
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
  readonly phoneDisplay = STUDIO_PHONE_DISPLAY;
  readonly phoneTel = STUDIO_PHONE_TEL;

  readonly categoryLinks = CATALOG_MENU_ITEMS.map((item) => ({
    label: item.label,
    route: catalogCategoryRoute(item.id),
  }));

  readonly supportLinks: FooterLink[] = [
    { label: 'Categories', route: '/catalog' },
    { label: 'About Us', route: '/about' },
    { label: 'Contact Us', route: '/contact' },
    { label: 'Bulk Order Enquiry', route: '/contact' },
    { label: 'Installation Support', route: '/contact' },
  ];
}
