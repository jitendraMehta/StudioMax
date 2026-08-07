import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TrustItem {
  icon: string;
  title: string;
  subtitle: string;
}

@Component({
  selector: 'studio-trust',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./trust.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './trust.component.html',
})
export class TrustComponent {
  readonly items: TrustItem[] = [
    {
      icon: 'verified_user',
      title: 'Genuine Products',
      subtitle: '100% Original & Authentic',
    },
    {
      icon: 'local_shipping',
      title: 'All India Delivery',
      subtitle: 'Fast & Secure Pan India Shipping',
    },
    {
      icon: 'inventory_2',
      title: 'Bulk Orders',
      subtitle: 'Special Pricing for Bulk Requirements',
    },
    {
      icon: 'headset_mic',
      title: 'Installation Guidance',
      subtitle: 'Expert Support for Seamless Setup',
    },
  ];
}
