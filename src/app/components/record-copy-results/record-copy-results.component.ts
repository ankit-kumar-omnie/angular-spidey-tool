import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecordCopyService, CopyResultRecord, CopyStatus, GetCopyResultsParams, Program, CopyTask } from '../../services/record-copy.service';
import { CopyResultCardComponent } from '../copy-result-card/copy-result-card.component';

@Component({
  selector: 'app-record-copy-results',
  standalone: true,
  imports: [CommonModule, FormsModule, CopyResultCardComponent],
  templateUrl: './record-copy-results.component.html',
  styleUrls: ['./record-copy-results.component.css'],
})
export class RecordCopyResultsComponent {
  filters = signal<GetCopyResultsParams>({});
  results = signal<CopyResultRecord[] | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  statuses: CopyStatus[] = ['InProgress', 'Completed', 'Failed', 'Ready'];
  programs: Program[] = ['VR', 'ER', 'IL', 'ILOB'];
  tasks: CopyTask[] = ['UpdateElement', 'CreateElement', 'Re-CreateElementHistory', 'CreateSection', 'CreateRecord'];

  constructor(private svc: RecordCopyService) {}

  setFilter(field: string, value: string) {
    this.filters.update(f => ({ ...f, [field]: value || undefined }));
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

  trackByProgram(index: number, p: Program): Program {
    return p;
  }

  trackByTask(index: number, t: CopyTask): CopyTask {
    return t;
  }

  trackByStatus(index: number, s: CopyStatus): CopyStatus {
    return s;
  }

  trackById(index: number, r: CopyResultRecord): string {
    return r.id;
  }
}
