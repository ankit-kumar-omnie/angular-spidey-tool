import { Injectable, signal } from '@angular/core';

type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly storageKey = 'spidey-theme';
  readonly theme = signal<ThemeMode>('light');

  initTheme(): void {
    const saved = localStorage.getItem(this.storageKey) as ThemeMode | null;
    const preferredDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const mode: ThemeMode = saved ?? (preferredDark ? 'dark' : 'light');
    this.setTheme(mode);
  }

  toggleTheme(): void {
    this.setTheme(this.theme() === 'dark' ? 'light' : 'dark');
  }

  private setTheme(mode: ThemeMode): void {
    this.theme.set(mode);
    document.documentElement.setAttribute('data-theme', mode);
    localStorage.setItem(this.storageKey, mode);
  }
}
