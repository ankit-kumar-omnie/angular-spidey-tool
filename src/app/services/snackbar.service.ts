import { Injectable, signal } from '@angular/core';

export type SnackbarType = 'success' | 'error' | 'warning' | 'info';

export interface SnackbarMessage {
  id: number;
  message: string;
  type: SnackbarType;
}

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  readonly snacks = signal<SnackbarMessage[]>([]);
  private counter = 0;
  private readonly DURATION = 5000;

  show(message: string, type: SnackbarType = 'info'): void {
    const id = ++this.counter;
    this.snacks.update(s => [...s, { id, message, type }]);
    setTimeout(() => this.dismiss(id), this.DURATION);
  }

  success(message: string): void { this.show(message, 'success'); }
  error(message: string): void   { this.show(message, 'error'); }
  warning(message: string): void { this.show(message, 'warning'); }
  info(message: string): void    { this.show(message, 'info'); }

  dismiss(id: number): void {
    this.snacks.update(s => s.filter(x => x.id !== id));
  }
}
