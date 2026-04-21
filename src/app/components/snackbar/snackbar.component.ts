import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnackbarService, SnackbarMessage } from '../../services/snackbar.service';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="snackbar-container" aria-live="polite" aria-atomic="false">
      @for (snack of snackbar.snacks(); track snack.id) {
        <div class="snack" [class]="'snack--' + snack.type" role="alert">
          <span class="snack-icon">{{ icons[snack.type] }}</span>
          <span class="snack-message">{{ snack.message }}</span>
          <button class="snack-close" (click)="snackbar.dismiss(snack.id)" aria-label="Dismiss">✕</button>
          <div class="snack-progress"></div>
        </div>
      }
    </div>
  `,
  styleUrls: ['./snackbar.component.css'],
})
export class SnackbarComponent {
  icons: Record<string, string> = {
    success: '✓',
    error:   '✕',
    warning: '⚠',
    info:    'ℹ',
  };

  constructor(public snackbar: SnackbarService) {}
}
