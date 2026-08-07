import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../models/site.model';

interface JourneyMilestone {
  year: string;
  icon: string;
  text: string;
}

interface QualityCheck {
  id: string;
  label: string;
}

interface StatItem {
  id: string;
  icon: string;
  value: string;
  label: string;
}

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  tall?: boolean;
}

@Component({
  selector: 'studio-about',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
  readonly journey: JourneyMilestone[] = [
    {
      year: '2010',
      icon: 'calendar_month',
      text: 'StudioMax was founded with a vision',
    },
    {
      year: '2014',
      icon: 'rocket_launch',
      text: 'Expanded product range and pan India distribution',
    },
    {
      year: '2018',
      icon: 'verified_user',
      text: 'Trusted by thousands of professionals & institutions',
    },
    {
      year: '2024+',
      icon: 'public',
      text: 'Continuing to innovate and deliver excellence worldwide',
    },
  ];

  readonly whyFeatures: Feature[] = [
    {
      id: 'quality',
      title: 'Quality First',
      icon: 'shield',
      description:
        'We offer only genuine, tested and reliable audio components sourced from trusted manufacturers.',
    },
    {
      id: 'expertise',
      title: 'Expertise',
      icon: 'settings',
      description:
        'Our team has deep technical knowledge to help you find the right solutions for every project.',
    },
    {
      id: 'customer',
      title: 'Customer Focused',
      icon: 'headset_mic',
      description:
        'From consultation to after-sales support, we are with you at every step of your journey.',
    },
    {
      id: 'delivery',
      title: 'Pan India Delivery',
      icon: 'local_shipping',
      description:
        'Fast, secure and insured delivery across India with careful packaging for fragile gear.',
    },
    {
      id: 'trust',
      title: 'Trust & Integrity',
      icon: 'military_tech',
      description:
        'Transparent business practices and a commitment to long-term relationships with our clients.',
    },
  ];

  readonly qualityChecks: QualityCheck[] = [
    { id: 'partners', label: 'Sourced from certified partners' },
    { id: 'testing', label: 'Rigorous testing for performance & durability' },
    { id: 'genuine', label: '100% genuine and authentic products' },
    { id: 'reliability', label: 'High reliability for critical applications' },
  ];

  readonly gallery: GalleryImage[] = [
    {
      id: 'tech',
      src: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=640&q=80',
      alt: 'Technician inspecting audio circuitry',
      tall: true,
    },
    {
      id: 'parts',
      src: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c3?auto=format&fit=crop&w=400&q=80',
      alt: 'Precision metal audio components',
    },
    {
      id: 'driver',
      src: 'https://images.unsplash.com/photo-1614615752530-8a949f6592c6?auto=format&fit=crop&w=400&q=80',
      alt: 'Speaker driver unit close-up',
    },
    {
      id: 'warehouse',
      src: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80',
      alt: 'Organized warehouse inventory',
    },
    {
      id: 'assembly',
      src: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d92d?auto=format&fit=crop&w=400&q=80',
      alt: 'Engineer assembling audio hardware',
    },
  ];

  readonly stats: StatItem[] = [
    { id: 'customers', icon: 'groups', value: '500+', label: 'Happy Customers' },
    { id: 'delivered', icon: 'inventory_2', value: '105000+', label: 'Products Delivered' },
    { id: 'brands', icon: 'workspace_premium', value: '50+', label: 'Top Indian Brands' },
    { id: 'support', icon: 'headset_mic', value: '24/7', label: 'Technical Support' },
    { id: 'assurance', icon: 'verified_user', value: '100%', label: 'Genuine Assurance' },
  ];

}
