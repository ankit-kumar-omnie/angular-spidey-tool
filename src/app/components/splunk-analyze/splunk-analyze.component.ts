import { Component, signal, inject } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  SplunkAnalyzeService,
  SplunkLogAnalysisResponse,
  SplunkAnalyzeParams,
} from '../../services/splunk-analyze.service';
import { SnackbarService } from '../../services/snackbar.service';
import { ThemeService } from '../../services/theme.service';

const SPLUNK_CREDS_KEY = 'spidey_splunk_creds';
const ANTHROPIC_KEY_STORAGE = 'spidey_anthropic_key';

const LOG_LEVELS = ['trace', 'debug', 'stat', 'info', 'warn', 'error', 'critical'] as const;

@Component({
  selector: 'app-splunk-analyze',
  standalone: true,
  imports: [CommonModule, FormsModule, JsonPipe],
  templateUrl: './splunk-analyze.component.html',
  styleUrls: ['./splunk-analyze.component.css'],
})
export class SplunkAnalyzeComponent {
  private svc      = inject(SplunkAnalyzeService);
  private snackbar = inject(SnackbarService);
  readonly theme   = inject(ThemeService);

  // ── Form fields
  splunkHost     = signal(this.loadCreds().host || 'https://libera.splunkcloudgc.com');
  splunkUsername = signal(this.loadCreds().username || '');
  splunkPassword = signal(this.loadCreds().password || '');
  splunkIndex    = signal('docker-test');
  earliest       = signal('-7d');
  latest         = signal('now');
  requestId      = signal('');
  selectedLevels = signal<string[]>(['error']);
  className      = signal('');
  keyword        = signal('');
  limit          = signal(100);
  anthropicApiKey = signal(localStorage.getItem(ANTHROPIC_KEY_STORAGE) || '');
  model          = signal('claude-haiku-4-5');

  // ── UI state
  loading  = signal(false);
  error    = signal<string | null>(null);
  result   = signal<SplunkLogAnalysisResponse | null>(null);
  searched = signal(false);
  showRawLog = signal(false);

  // ── Options
  logLevels = LOG_LEVELS;
  models = ['claude-haiku-4-5', 'claude-sonnet-4-20250514', 'claude-opus-4-20250514'];

  toggleLevel(level: string): void {
    this.selectedLevels.update(levels => {
      if (levels.includes(level)) {
        return levels.filter(l => l !== level);
      }
      return [...levels, level];
    });
  }

  analyze(): void {
    this.error.set(null);
    this.result.set(null);
    this.searched.set(false);
    this.showRawLog.set(false);

    if (!this.splunkHost() || !this.splunkUsername() || !this.splunkPassword()) {
      this.snackbar.error('Splunk host, username, and password are required.');
      return;
    }
    if (!this.anthropicApiKey()) {
      this.snackbar.error('Anthropic API key is required.');
      return;
    }
    if (!this.requestId() && !this.className() && !this.keyword() && this.selectedLevels().length === 0) {
      this.snackbar.error('Provide at least one filter (requestId, level, className, or keyword).');
      return;
    }

    // Save credentials for convenience
    this.saveCreds();
    localStorage.setItem(ANTHROPIC_KEY_STORAGE, this.anthropicApiKey());

    const params: SplunkAnalyzeParams = {
      splunkHost: this.splunkHost(),
      splunkUsername: this.splunkUsername(),
      splunkPassword: this.splunkPassword(),
      splunkIndex: this.splunkIndex() || undefined,
      earliest: this.earliest() || undefined,
      latest: this.latest() || undefined,
      requestId: this.requestId() || undefined,
      level: this.selectedLevels().length > 0 ? this.selectedLevels() : undefined,
      className: this.className() || undefined,
      keyword: this.keyword() || undefined,
      limit: this.limit() || undefined,
      anthropicApiKey: this.anthropicApiKey(),
      model: this.model() || undefined,
    };

    this.loading.set(true);

    this.svc.analyze(params).subscribe({
      next: (data) => {
        this.result.set(data);
        this.loading.set(false);
        this.searched.set(true);
        this.snackbar.success('Analysis complete.');
      },
      error: (e) => {
        const msg = e?.error?.message || e?.message || 'Analysis failed.';
        this.error.set(msg);
        this.loading.set(false);
        this.searched.set(true);
        this.snackbar.error(msg);
      },
    });
  }

  toggleRawLog(): void {
    this.showRawLog.update(v => !v);
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => this.snackbar.info('Copied to clipboard.'));
  }

  copyFullAnalysis(): void {
    const r = this.result();
    if (!r) return;
    const text = JSON.stringify(r, null, 2);
    navigator.clipboard.writeText(text).then(() => this.snackbar.success('Full analysis copied as JSON.'));
  }

  private loadCreds(): { host: string; username: string; password: string } {
    try {
      return JSON.parse(localStorage.getItem(SPLUNK_CREDS_KEY) || '{}');
    } catch {
      return { host: '', username: '', password: '' };
    }
  }

  private saveCreds(): void {
    localStorage.setItem(SPLUNK_CREDS_KEY, JSON.stringify({
      host: this.splunkHost(),
      username: this.splunkUsername(),
      password: this.splunkPassword(),
    }));
  }
}
