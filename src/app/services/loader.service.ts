import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  readonly loading = signal(false);

  // Minimum time the loader stays visible (ms) — long enough to enjoy the animation
  private readonly MIN_DURATION = 1800;
  private shownAt = 0;

  show(): void {
    this.shownAt = Date.now();
    this.loading.set(true);
  }

  hide(): void {
    const elapsed = Date.now() - this.shownAt;
    const remaining = this.MIN_DURATION - elapsed;
    if (remaining > 0) {
      setTimeout(() => this.loading.set(false), remaining);
    } else {
      this.loading.set(false);
    }
  }
}
