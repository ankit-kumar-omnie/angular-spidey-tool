import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (loader.loading()) {
      <div class="loader-overlay" role="status" aria-label="Loading">
        <div class="loader-box">
          <div class="spinner">
            <div class="spinner-ring"></div>
            <div class="spinner-ring"></div>
            <div class="spinner-ring"></div>
          </div>
          <p class="loader-text">Loading…</p>
        </div>
      </div>
    }
  `,
  styleUrls: ['./loader.component.css'],
})
export class LoaderComponent {
  constructor(public loader: LoaderService) {}
}
