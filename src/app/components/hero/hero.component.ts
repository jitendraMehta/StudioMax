import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Slide {
  title: string;
  titleAccent?: string;
  subtitle?: string;
  description?: string;
  cta?: string;
  image: string;
}

@Component({
  selector: 'studio-hero',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
})
export class HeroComponent implements OnInit, OnDestroy {
  private readonly cdr = inject(ChangeDetectorRef);

  slides: Slide[] = [
    {
      title: 'Professional Audio Solutions for Every Space',
      titleAccent: 'Every Space',
      subtitle: 'Authorized supplier',
      description:
        "Trusted products from leading brands including Krown and Almax Audio, backed by expert consultation and nationwide delivery.",
      cta: 'Explore Products',
      image: '/hero1.png',
    },
    {
      title: 'Precision Drivers for Crystal-Clear Sound',
      titleAccent: 'Crystal-Clear Sound',
      subtitle: 'PROFESSIONAL AUDIO COMPONENTS',
      description: 'Deliver exceptional vocal clarity and high-frequency performance with StudioMax compression drivers. Designed for auditoriums, public address systems, places of worship, educational institutions, and professional audio installations where reliability matters most.',
      cta: 'Explore Components',
      image: '/hero2.png',
    },
  ];

  current = 0;

  private autoplayId: any = null;
  private autoplayMs = 5000;

  // simple swipe tracking
  private startX = 0;
  private dragging = false;

  ngOnInit(): void {
    this.startAutoplay();
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  startAutoplay() {
    this.stopAutoplay();
    this.autoplayId = setInterval(() => this.next(), this.autoplayMs);
  }

  stopAutoplay() {
    if (this.autoplayId) {
      clearInterval(this.autoplayId);
      this.autoplayId = null;
    }
  }

  pauseAutoplay() {
    this.stopAutoplay();
  }

  resumeAutoplay() {
    this.startAutoplay();
  }

  setSlide(i: number) {
    this.current = (i + this.slides.length) % this.slides.length;
    this.cdr.markForCheck();
  }

  next() {
    this.setSlide(this.current + 1);
  }

  prev() {
    this.setSlide(this.current - 1);
  }

  // Pointer / touch handlers
  onPointerDown(e: PointerEvent) {
    this.dragging = true;
    this.startX = e.clientX;
    try { (e.target as HTMLElement).setPointerCapture?.(e.pointerId); } catch {}
    this.pauseAutoplay();
  }

  onPointerMove(e: PointerEvent) {
    if (!this.dragging) return;
    // we don't update UI while dragging to keep implementation simple
  }

  onPointerUp(e: PointerEvent) {
    if (!this.dragging) return;
    const delta = e.clientX - this.startX;
    this.dragging = false;
    if (Math.abs(delta) > 50) {
      if (delta < 0) this.next(); else this.prev();
    }
    try { (e.target as HTMLElement).releasePointerCapture?.(e.pointerId); } catch {}
    this.resumeAutoplay();
  }

  onPointerCancel(e: PointerEvent) {
    this.dragging = false;
    this.resumeAutoplay();
  }

  titleLead(slide: Slide): string {
    const accent = slide.titleAccent;
    if (!accent) {
      return slide.title;
    }
    const idx = slide.title.lastIndexOf(accent);
    if (idx === -1) {
      return slide.title;
    }
    return slide.title.slice(0, idx).trimEnd();
  }
}
