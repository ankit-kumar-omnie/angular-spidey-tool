import { Injectable, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'spidey';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'spidey-theme';
  readonly theme = signal<ThemeMode>('light');

  private readonly cycle: ThemeMode[] = ['light', 'dark', 'spidey'];

  initTheme(): void {
    const saved = localStorage.getItem(this.storageKey) as ThemeMode | null;
    const preferredDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const mode: ThemeMode = saved ?? (preferredDark ? 'dark' : 'light');
    this.setTheme(mode);
  }

  toggleTheme(): void {
    const current = this.theme();
    const next = this.cycle[(this.cycle.indexOf(current) + 1) % this.cycle.length];
    this.setTheme(next);
  }

  private setTheme(mode: ThemeMode): void {
    this.theme.set(mode);
    document.documentElement.setAttribute('data-theme', mode);
    localStorage.setItem(this.storageKey, mode);
  }
}
