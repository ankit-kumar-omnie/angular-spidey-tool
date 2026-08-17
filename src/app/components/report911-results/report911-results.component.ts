import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Report911Service, ResultRecord, MigrationStatus, GetResultsParams } from '../../services/report911.service';
import { ResultCardComponent } from '../result-card/result-card.component';

@Component({
  selector: 'app-report911-results',
  standalone: true,
  imports: [CommonModule, FormsModule, ResultCardComponent],
  templateUrl: './report911-results.component.html',
  styleUrls: ['./report911-results.component.css'],
})
export class Report911ResultsComponent {
  filters = signal<GetResultsParams>({});
  results = signal<ResultRecord[] | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  statuses: MigrationStatus[] = ['InProgress', 'Completed', 'Failed', 'Ready'];

  constructor(private svc: Report911Service) {}

  setFilter(field: string, value: string) {
    this.filters.update(f => ({ ...f, [field]: value || undefined }));
  }

  setUnReport(value: string) {
    this.filters.update(f => ({ ...f, unReport: value === '' ? undefined : value === 'true' }));
  }

  unReportValue(): string {
    const v = this.filters().unReport;
    return v === undefined ? '' : String(v);
  }

  handleSearch() {
    this.error.set(null);
    this.loading.set(true);
    this.svc.getResults(this.filters()).subscribe({
      next: data => { this.results.set(Array.isArray(data) ? data : [data]); this.loading.set(false); },
      error: e => { this.error.set(e.message ?? JSON.stringify(e)); this.loading.set(false); },
    });
  }

  handleRefresh(id: string) {
    this.svc.getResults({ id }).subscribe({
      next: data => {
        if (data[0]) this.results.update(prev => prev ? prev.map(r => r.id === id ? data[0] : r) : prev);
      }
    });
  }

  trackByStatus(index: number, s: MigrationStatus): MigrationStatus {
    return s;
  }

  trackById(index: number, r: ResultRecord): string {
    return r.id;
  }
}
