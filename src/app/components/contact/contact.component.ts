import { ChangeDetectionStrategy, Component, OnInit, inject, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Title, Meta, DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { STUDIO_PHONE_DISPLAY, STUDIO_PHONE_TEL, STUDIO_WHATSAPP_URL, buildWhatsAppContactUrl } from '../../constants/contact';
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
      address: 'Vishwash Nagar, Shahdara, Delhi, India',
      phone: '+91 98738 38630',
      tel: '+9198738 38630',
    }
  ];

  readonly headOffice = {
    title: 'StudioMax Head Office',
    address: 'Gali No. 9, Vishwash Nagar, Shahdara, Delhi, India',
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
      'https://www.openstreetmap.org/export/embed?bbox=77.2887969017029%2C28.66174653000802%2C77.29381799697877%2C28.66475902917384&amp;layer=mapnik&amp;marker=28.663252938942293%2C77.29130744934082',
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

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.submitting.set(true);
    this.status.set(null);

    const url = buildWhatsAppContactUrl(this.model);
    window.open(url, '_blank', 'noopener,noreferrer');

    this.status.set('WhatsApp is opening — tap Send there to deliver your message to our team.');
    this.submitting.set(false);

    this.model = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    };
    contactForm.resetForm(this.model);
    setTimeout(() => this.status.set(null), 10000);
  }
}
