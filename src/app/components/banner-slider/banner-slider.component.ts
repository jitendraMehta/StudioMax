import { ChangeDetectionStrategy, Component, OnDestroy, afterNextRender, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

interface BannerSlide {
  image: string;
  alt: string;
}

@Component({
  selector: 'studio-banner-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './banner-slider.component.html',
  styleUrls: ['./banner-slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannerSliderComponent implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);

  slides: BannerSlide[] = [
    {
      image: 'hero-banner-1.png',
      alt: 'Vlogmate NEO lavalier microphone',
    },
    {
      image: 'hero-banner-2.png',
      alt: 'Wireless earbuds and creator audio setup',
    },
    {
      image: 'PA-driver-unit.png',
      alt: 'Professional PA driver unit product',
    },
  ];

  current = 0;
  private autoplayId: number | null = null;
  private startX = 0;
  private dragging = false;
  private readonly autoplayInterval = 5000;

  constructor() {
    afterNextRender(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.startAutoplay();
      }
    });
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  startAutoplay(): void {
    this.stopAutoplay();
    this.autoplayId = window.setInterval(() => this.next(), this.autoplayInterval);
  }

  stopAutoplay(): void {
    if (this.autoplayId !== null) {
      window.clearInterval(this.autoplayId);
      this.autoplayId = null;
    }
  }

  pauseAutoplay(): void {
    this.stopAutoplay();
  }

  resumeAutoplay(): void {
    this.startAutoplay();
  }

  setSlide(index: number): void {
    this.current = (index + this.slides.length) % this.slides.length;
  }

  prev(): void {
    this.setSlide(this.current - 1);
  }

  next(): void {
    this.setSlide(this.current + 1);
  }

  onPointerDown(event: PointerEvent): void {
    this.dragging = true;
    this.startX = event.clientX;
    try {
      (event.target as HTMLElement).setPointerCapture?.(event.pointerId);
    } catch {}
    this.pauseAutoplay();
  }

  onPointerMove(event: PointerEvent): void {
    // No live drag translation; simple swipe support only.
    if (!this.dragging) {
      return;
    }
    event.preventDefault();
  }

  onPointerUp(event: PointerEvent): void {
    if (!this.dragging) {
      return;
    }
    this.dragging = false;
    const delta = event.clientX - this.startX;
    if (Math.abs(delta) > 50) {
      delta < 0 ? this.next() : this.prev();
    }
    try {
      (event.target as HTMLElement).releasePointerCapture?.(event.pointerId);
    } catch {}
    this.resumeAutoplay();
  }

  onPointerCancel(): void {
    this.dragging = false;
    this.resumeAutoplay();
  }
}
