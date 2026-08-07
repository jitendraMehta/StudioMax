import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DEFAULT_THEME } from './theme.config';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private current: Theme;

  constructor() {
    this.current = this.readSavedTheme() ?? DEFAULT_THEME;
    this.apply(this.current);
  }

  setTheme(theme: Theme) {
    this.current = theme;
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem('studioMaxTheme', theme);
      } catch {
        /* storage unavailable */
      }
    }
    this.apply(theme);
  }

  toggleTheme() {
    this.setTheme(this.current === 'dark' ? 'light' : 'dark');
  }

  getTheme(): Theme {
    return this.current;
  }

  private readSavedTheme(): Theme | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    try {
      const saved = localStorage.getItem('studioMaxTheme') as Theme | null;
      return saved === 'light' || saved === 'dark' ? saved : null;
    } catch {
      return null;
    }
  }

  private apply(theme: Theme) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark');
    root.classList.add(`theme-${theme}`);
  }
}
