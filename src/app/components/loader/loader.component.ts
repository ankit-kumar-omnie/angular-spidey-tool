import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../services/loader.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loader-overlay" role="status" aria-label="Loading" *ngIf="loader.loading()">

        <ng-container *ngIf="theme.theme() === 'spidey'; else defaultSpinnerBlock">
          <!-- ── SPIDEY 3D WEB LOADER ── -->
          <div class="spidey-loader">

            <!-- Backdrop radial glow -->
            <div class="spidey-glow"></div>

            <!-- 3D web scene -->
            <div class="web-scene">

              <!-- Outer rotating ring -->
              <div class="web-ring web-ring--outer"></div>
              <div class="web-ring web-ring--mid"></div>
              <div class="web-ring web-ring--inner"></div>

              <!-- SVG web that spins on Y axis (3D flip) -->
              <div class="web-3d-wrap">
                <svg class="web-3d-svg" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                  <!-- Radial strands -->
                  <line x1="60" y1="60" x2="60"  y2="4"   class="web-line"/>
                  <line x1="60" y1="60" x2="102" y2="18"  class="web-line"/>
                  <line x1="60" y1="60" x2="116" y2="60"  class="web-line"/>
                  <line x1="60" y1="60" x2="102" y2="102" class="web-line"/>
                  <line x1="60" y1="60" x2="60"  y2="116" class="web-line"/>
                  <line x1="60" y1="60" x2="18"  y2="102" class="web-line"/>
                  <line x1="60" y1="60" x2="4"   y2="60"  class="web-line"/>
                  <line x1="60" y1="60" x2="18"  y2="18"  class="web-line"/>
                  <!-- Concentric rings -->
                  <circle cx="60" cy="60" r="14" class="web-circle"/>
                  <circle cx="60" cy="60" r="28" class="web-circle"/>
                  <circle cx="60" cy="60" r="42" class="web-circle"/>
                  <circle cx="60" cy="60" r="56" class="web-circle web-circle--outer"/>
                  <!-- Center spider body -->
                  <circle cx="60" cy="60" r="5"  class="web-center"/>
                  <circle cx="60" cy="60" r="5"  class="web-center-pulse"/>
                </svg>
              </div>

              <!-- Web strand dropping from top with spider -->
              <div class="spider-drop-wrap">
                <div class="spider-thread"></div>
                <div class="spider-body">
                  <div class="spider-head"></div>
                  <div class="spider-abdomen"></div>
                  <div class="spider-legs">
                    <span></span><span></span>
                    <span></span><span></span>
                    <span></span><span></span>
                    <span></span><span></span>
                  </div>
                </div>
              </div>

            </div>

            <p class="spidey-loader-text">
              <span class="spidey-loader-char" style="--i:0">W</span>
              <span class="spidey-loader-char" style="--i:1">e</span>
              <span class="spidey-loader-char" style="--i:2">b</span>
              <span class="spidey-loader-char" style="--i:3">b</span>
              <span class="spidey-loader-char" style="--i:4">i</span>
              <span class="spidey-loader-char" style="--i:5">n</span>
              <span class="spidey-loader-char" style="--i:6">g</span>
              <span class="spidey-loader-char" style="--i:7">.</span>
              <span class="spidey-loader-char" style="--i:8">.</span>
              <span class="spidey-loader-char" style="--i:9">.</span>
            </p>
          </div>

        </ng-container>
        <ng-template #defaultSpinnerBlock>
          <!-- ── DEFAULT SPINNER ── -->
          <div class="loader-box">
            <div class="spinner">
              <div class="spinner-ring"></div>
              <div class="spinner-ring"></div>
              <div class="spinner-ring"></div>
            </div>
            <p class="loader-text">Loading…</p>
          </div>
        </ng-template>

    </div>
  `,
  styleUrls: ['./loader.component.css'],
})
export class LoaderComponent {
  constructor(
    public loader: LoaderService,
    public theme: ThemeService,
  ) {}
}
