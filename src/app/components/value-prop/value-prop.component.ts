import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../models/site.model';

interface StatItem {
  id: string;
  icon: string;
  value: string;
  label: string;
}

@Component({
  selector: 'studio-values',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './value-prop.component.html',
  styleUrls: ['./value-prop.component.scss'],
})
export class ValuePropComponent {
  readonly features: Feature[] = [
    {
      id: 'genuine',
      title: '100% Genuine Products',
      icon: 'verified_user',
      description:
        'We deal only in original products from authorised manufacturers with full warranty assurance.',
    },
    {
      id: 'engineering',
      title: 'Expert Engineering Support',
      icon: 'engineering',
      description:
        'Get the right product for your project with guidance from our experienced audio engineers.',
    },
    {
      id: 'delivery',
      title: 'Pan India Delivery',
      icon: 'local_shipping',
      description: 'Fast, secure and insured delivery across India with careful packaging.',
    },
    {
      id: 'installation',
      title: 'Installation Guidance',
      icon: 'support_agent',
      description: 'From planning to installation, our experts help you at every step of your project.',
    },
    {
      id: 'bulk',
      title: 'Best Bulk Pricing',
      icon: 'sell',
      description: 'Special pricing and priority support for dealers, integrators and bulk orders.',
    },
    {
      id: 'lifetime',
      title: 'Lifetime Support',
      icon: 'headset_mic',
      description: 'We are always here to support you even after your purchase is complete.',
    },
  ];

  readonly stats: StatItem[] = [
    { id: 'customers', icon: 'groups', value: '250+', label: 'Happy Customers' },
    { id: 'delivered', icon: 'inventory_2', value: '5000+', label: 'Products Delivered' },
    { id: 'brands', icon: 'workspace_premium', value: '15+', label: 'Top Global Brands' },
    { id: 'support', icon: 'headset_mic', value: '24/7', label: 'Technical Support' },
    { id: 'assurance', icon: 'verified_user', value: '100%', label: 'Genuine Assurance' },
  ];
}
