import { ChangeDetectionStrategy, Component, OnInit, inject, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Title, Meta, DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { STUDIO_PHONE_DISPLAY, STUDIO_PHONE_TEL, STUDIO_WHATSAPP_URL } from '../../constants/contact';
import { PageHeroComponent } from '../page-hero/page-hero.component';

interface ContactChannel {
  id: string;
  icon: string;
  title: string;
  primary: string;
  secondary: string;
  href?: string;
}

interface RegionalOffice {
  id: string;
  city: string;
  address: string;
  phone: string;
  tel: string;
}

@Component({
  selector: 'studio-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeroComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);

  readonly whatsappUrl = STUDIO_WHATSAPP_URL;

  readonly contactChannels: ContactChannel[] = [
    {
      id: 'phone',
      icon: 'call',
      title: 'Phone',
      primary: STUDIO_PHONE_DISPLAY,
      secondary: 'Mon - Sat: 9:00 AM - 6:00 PM',
      href: STUDIO_PHONE_TEL,
    },
    {
      id: 'email',
      icon: 'mail',
      title: 'Email',
      primary: 'info@studiomax.com',
      secondary: 'We reply within 24 hours',
      href: 'mailto:info@studiomax.com',
    },
    {
      id: 'address',
      icon: 'location_on',
      title: 'Address',
      primary: 'Vishwash Nagar, Shahdara, Delhi, India',
      secondary: '',
    }
  ];

  readonly subjectOptions = [
    'General Inquiry',
    'Product Support',
    'Technical Assistance',
    'Bulk Order',
    'Partnership',
  ] as const;

  readonly regionalOffices: RegionalOffice[] = [
    {
      id: 'delhi',
      city: 'Delhi NCR',
      address: '456 Sound Avenue, Delhi, India',
      phone: '+91 98765 43210',
      tel: '+919876543210',
    }
  ];

  readonly headOffice = {
    title: 'StudioMax Head Office',
    address: '1234 Audio Lane, Sound City, SC 56789, India',
    directionsUrl:
      'https://www.google.com/maps/search/?api=1&query=1234+Audio+Lane+Sound+City+SC+56789+India',
  };

  readonly mapEmbedUrl: SafeResourceUrl;

  model = {
    name: '',
    email: '',
    phone: '',
    subject: '' as string,
    message: '',
  };

  submitting = signal(false);
  status = signal<string | null>(null);

  constructor(
    private title: Title,
    private meta: Meta,
    sanitizer: DomSanitizer,
  ) {
    this.mapEmbedUrl = sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.openstreetmap.org/export/embed.html?bbox=77.08%2C28.55%2C77.28%2C28.68&layer=mapnik&marker=28.6139%2C77.2090',
    );
  }

  ngOnInit(): void {
    this.title.setTitle('Contact — StudioMax Professional Audio');
    this.meta.updateTag({
      name: 'description',
      content:
        'Contact StudioMax for product questions, technical support, bulk orders, and partnership inquiries.',
    });
    this.meta.updateTag({ name: 'robots', content: 'index,follow' });

    if (isPlatformBrowser(this.platformId)) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel='canonical']");
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', window.location.href);
    }
  }

  onSubmit(contactForm: NgForm): void {
    if (contactForm.invalid || this.submitting()) {
      return;
    }

    this.submitting.set(true);
    this.status.set(null);

    setTimeout(() => {
      this.status.set('Thank you! Our team will get back to you shortly.');
      this.submitting.set(false);
      this.model = {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      };
      contactForm.resetForm(this.model);
      setTimeout(() => this.status.set(null), 7000);
    }, 1200);
  }
}
