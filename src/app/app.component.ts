import { Component, computed, signal, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { Report911Service, CommandResult, ResultRecord } from './services/report911.service';
import { RecordCopyService, CopyCommandResult, CopyResultRecord } from './services/record-copy.service';
import { AuthTokenComponent } from './components/auth-token/auth-token.component';
import { Report911FormComponent } from './components/report911-form/report911-form.component';
import { Report911ResultsComponent } from './components/report911-results/report911-results.component';
import { RecordCopyFormComponent } from './components/record-copy-form/record-copy-form.component';
import { RecordCopyResultsComponent } from './components/record-copy-results/record-copy-results.component';
import { ResultCardComponent } from './components/result-card/result-card.component';
import { CopyResultCardComponent } from './components/copy-result-card/copy-result-card.component';

type ActiveTool = 'report911' | 'recordCopy';

const TOOL_LABELS: Record<ActiveTool, string> = {
  report911: 'Report 911 SPIDEY Tool',
  recordCopy: 'Record Tool',
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
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  activeTool = signal<ActiveTool>('report911');
  toolMenuOpen = signal(false);
  toolLabels = TOOL_LABELS;
  toolKeys = Object.keys(TOOL_LABELS) as ActiveTool[];

  submitted911 = signal<CommandResult[] | null>(null);
  postResults911 = signal<ResultRecord[]>([]);
  submittedCopy = signal<CopyCommandResult | null>(null);
  postResultsCopy = signal<CopyResultRecord[]>([]);

  tenant = computed(() => this.auth.token() ? this.auth.decodeTenant(this.auth.token()) : '');
  env = computed(() => this.auth.token() ? this.auth.decodeEnv(this.auth.token()) : '');
  userName = computed(() => this.auth.token() ? this.auth.decodeUserName(this.auth.token()) : '');

  constructor(
    public auth: AuthService,
    private report911: Report911Service,
    private recordCopy: RecordCopyService,
    private elRef: ElementRef,
  ) {}

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

  onTokenSave(token: string) { this.auth.setToken(token); }

  on911Success(result: CommandResult | CommandResult[]) {
    const results = Array.isArray(result) ? result : [result];
    this.submitted911.set(results);
    results.forEach(r => {
      this.report911.getResults({ id: r.id }).subscribe({
        next: data => {
          if (data[0]) this.postResults911.update(prev => [data[0], ...prev.filter(x => x.id !== data[0].id)]);
        },
        error: () => {}
      });
    });
  }

  on911Refresh(id: string) {
    this.report911.getResults({ id }).subscribe({
      next: data => {
        if (data[0]) this.postResults911.update(prev => prev.map(r => r.id === id ? data[0] : r));
      }
    });
  }

  onCopySuccess(result: CopyCommandResult) {
    this.submittedCopy.set(result);
    this.recordCopy.getResults({ id: result.id }).subscribe({
      next: data => {
        if (data[0]) this.postResultsCopy.update(prev => [data[0], ...prev.filter(r => r.id !== data[0].id)]);
      },
      error: () => {}
    });
  }

  onCopyRefresh(id: string) {
    this.recordCopy.getResults({ id }).subscribe({
      next: data => {
        if (data[0]) this.postResultsCopy.update(prev => prev.map(r => r.id === id ? data[0] : r));
      }
    });
  }
}
