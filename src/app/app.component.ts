import { Component, computed, signal, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { Report911Service, CommandResult, ResultRecord } from './services/report911.service';
import { RecordCopyService, CopyCommandResult, CopyResultRecord } from './services/record-copy.service';
import { ThemeService } from './services/theme.service';
import { LoaderService } from './services/loader.service';
import { SnackbarService } from './services/snackbar.service';
import { AuthTokenComponent } from './components/auth-token/auth-token.component';
import { Report911FormComponent } from './components/report911-form/report911-form.component';
import { Report911ResultsComponent } from './components/report911-results/report911-results.component';
import { RecordCopyFormComponent } from './components/record-copy-form/record-copy-form.component';
import { RecordCopyResultsComponent } from './components/record-copy-results/record-copy-results.component';
import { ResultCardComponent } from './components/result-card/result-card.component';
import { CopyResultCardComponent } from './components/copy-result-card/copy-result-card.component';
import { LoaderComponent } from './components/loader/loader.component';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { EventStoreComponent } from './components/event-store/event-store.component';
import { SplunkAnalyzeComponent } from './components/splunk-analyze/splunk-analyze.component';
import { GitBranchManagerComponent } from './components/git-branch-manager/git-branch-manager.component';
import { DbAggregationComponent } from './components/db-aggregation/db-aggregation.component';

type ActiveTool = 'report911' | 'recordCopy' | 'eventStore' | 'splunkAnalyze' | 'gitBranchManager' | 'dbAggregation';

const TOOL_LABELS: Record<ActiveTool, string> = {
  report911:        'Report 911 SPIDEY Tool',
  recordCopy:       'Record SPIDEY Tool',
  eventStore:       'Event Store Viewer',
  splunkAnalyze:    'Splunk Log Analyzer',
  gitBranchManager: 'Git Branch Manager',
  dbAggregation:    'DB Aggregation',
};

const TOOL_ICONS: Record<ActiveTool, string> = {
  report911:        '📋',
  recordCopy:       '🗂️',
  eventStore:       '⚡',
  splunkAnalyze:    '🔍',
  gitBranchManager: '🌿',
  dbAggregation:    '🗄️',
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    AuthTokenComponent,
    Report911FormComponent,
    Report911ResultsComponent,
    RecordCopyFormComponent,
    RecordCopyResultsComponent,
    ResultCardComponent,
    CopyResultCardComponent,
    LoaderComponent,
    SnackbarComponent,
    EventStoreComponent,
    SplunkAnalyzeComponent,
    GitBranchManagerComponent,
    DbAggregationComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  activeTool = signal<ActiveTool>('report911');
  toolMenuOpen = signal(false);
  toolLabels = TOOL_LABELS;
  toolIcons  = TOOL_ICONS;
  toolKeys = Object.keys(TOOL_LABELS) as ActiveTool[];

  submitted911 = signal<CommandResult[] | null>(null);
  postResults911 = signal<ResultRecord[]>([]);
  submittedCopy = signal<CopyCommandResult | null>(null);
  postResultsCopy = signal<CopyResultRecord[]>([]);

  tenant = computed(() => this.auth.token() ? this.auth.decodeTenant(this.auth.token()) : '');
  env = computed(() => this.auth.token() ? this.auth.decodeEnv(this.auth.token()) : '');
  userName = computed(() => this.auth.token() ? this.auth.decodeUserName(this.auth.token()) : '');
  role = computed(()=> this.auth.token() ? (this.auth.decodeRole(this.auth.token()) || 'User') : '');

  constructor(
    public auth: AuthService,
    public theme: ThemeService,
    public loader: LoaderService,
    private snackbar: SnackbarService,
    private report911: Report911Service,
    private recordCopy: RecordCopyService,
    private elRef: ElementRef,
  ) {
    this.theme.initTheme();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.toolMenuOpen() && !this.elRef.nativeElement.querySelector('.tool-switcher')?.contains(event.target)) {
      this.toolMenuOpen.set(false);
    }
  }

  selectTool(tool: ActiveTool) {
    this.activeTool.set(tool);
    this.toolMenuOpen.set(false);
  }

  toggleToolMenu() { this.toolMenuOpen.update(o => !o); }
  toggleTheme() { this.theme.toggleTheme(); }

  themeLabel() {
    const next = { light: 'Switch to Dark', dark: 'Switch to Spidey 🕷', spidey: 'Switch to Light' };
    return next[this.theme.theme()];
  }

  onTokenSave(token: string) {
    this.auth.setToken(token);
    if (token) {
      this.snackbar.success('Token saved — you are now authorized.');
    } else {
      this.snackbar.info('Token cleared — you are now unauthorized.');
    }
  }

  on911Success(result: CommandResult | CommandResult[]) {
    const results = Array.isArray(result) ? result : [result];
    this.submitted911.set(results);
    this.loader.show();
    let completed = 0;
    results.forEach(r => {
      this.report911.getResults({ id: r.id }).subscribe({
        next: data => {
          if (data[0]) this.postResults911.update(prev => [data[0], ...prev.filter(x => x.id !== data[0].id)]);
          if (++completed === results.length) {
            this.loader.hide();
            this.snackbar.success(`Submitted successfully — ${results.length} record${results.length > 1 ? 's' : ''} processed.`);
          }
        },
        error: (e) => {
          if (++completed === results.length) this.loader.hide();
          this.snackbar.error(e?.message ?? 'Failed to fetch result.');
        }
      });
    });
  }

  on911Refresh(id: string) {
    this.loader.show();
    this.report911.getResults({ id }).subscribe({
      next: data => {
        if (data[0]) this.postResults911.update(prev => prev.map(r => r.id === id ? data[0] : r));
        this.loader.hide();
        this.snackbar.info('Record refreshed.');
      },
      error: (e) => {
        this.loader.hide();
        this.snackbar.error(e?.message ?? 'Refresh failed.');
      }
    });
  }

  onCopySuccess(result: CopyCommandResult) {
    this.submittedCopy.set(result);
    this.loader.show();
    this.recordCopy.getResults({ id: result.id }).subscribe({
      next: data => {
        if (data[0]) this.postResultsCopy.update(prev => [data[0], ...prev.filter(r => r.id !== data[0].id)]);
        this.loader.hide();
        this.snackbar.success('Record copy submitted successfully.');
      },
      error: (e) => {
        this.loader.hide();
        this.snackbar.error(e?.message ?? 'Failed to fetch copy result.');
      }
    });
  }

  onCopyRefresh(id: string) {
    this.loader.show();
    this.recordCopy.getResults({ id }).subscribe({
      next: data => {
        if (data[0]) this.postResultsCopy.update(prev => prev.map(r => r.id === id ? data[0] : r));
        this.loader.hide();
        this.snackbar.info('Record refreshed.');
      },
      error: (e) => {
        this.loader.hide();
        this.snackbar.error(e?.message ?? 'Refresh failed.');
      }
    });
  }
}
