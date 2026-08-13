import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventStoreService, EventRecord } from '../../services/event-store.service';
import { StreamExportService, StreamExportRow } from '../../services/stream-export.service';
import { SnackbarService } from '../../services/snackbar.service';

const PAGE_SIZE = 20;

interface ExportRow extends StreamExportRow {
  id: string;
  number: number;
  type: string;
}

@Component({
  selector: 'app-stream-export',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stream-export.component.html',
  styleUrls: ['./stream-export.component.css'],
})
export class StreamExportComponent {
  private eventStore = inject(EventStoreService);
  private exportSvc  = inject(StreamExportService);
  private snackbar   = inject(SnackbarService);

  streamId = signal('');

  // ── UI state
  loading  = signal(false);
  error    = signal<string | null>(null);
  searched = signal(false);
  rows     = signal<ExportRow[]>([]);

  // ── Filters
  filterText     = signal('');
  filterStatus   = signal('');
  filterDateFrom = signal('');
  filterTimeFrom = signal('');
  filterDateTo   = signal('');
  filterTimeTo   = signal('');

  // ── Sort
  sortField = signal<'aggregateId' | 'currentStatus' | 'createdAt'>('createdAt');
  sortDir   = signal<'asc' | 'desc'>('desc');

  // ── Pagination
  currentPage = signal(1);

  hasValidInput = computed(() => this.streamId().trim().length > 0);

  // ── Unique statuses for dropdown filter
  statusOptions = computed(() => {
    const statuses = new Set(this.rows().map(r => r.currentStatus).filter(Boolean));
    return Array.from(statuses).sort();
  });

  hasActiveFilters = computed(() =>
    !!this.filterText().trim() ||
    !!this.filterStatus().trim() ||
    !!this.filterDateFrom() ||
    !!this.filterTimeFrom() ||
    !!this.filterDateTo() ||
    !!this.filterTimeTo()
  );

  // ── Filtered + sorted rows
  filteredRows = computed(() => {
    let result = this.rows();

    const status = this.filterStatus().trim();
    if (status) result = result.filter(r => r.currentStatus === status);

    const from = this.dateTimeStart(this.filterDateFrom(), this.filterTimeFrom());
    const to   = this.dateTimeEnd(this.filterDateTo(), this.filterTimeTo());
    if (from || to) {
      result = result.filter(r => {
        const created = this.rowCreatedAt(r);
        if (!created) return false;
        if (from && created < from) return false;
        if (to && created > to) return false;
        return true;
      });
    }

    const q = this.filterText().toLowerCase().trim();
    if (q) result = result.filter(r =>
      r.aggregateId.toLowerCase().includes(q) ||
      r.currentStatus.toLowerCase().includes(q) ||
      r.targetStatus.toLowerCase().includes(q) ||
      r.userName.toLowerCase().includes(q) ||
      r.type.toLowerCase().includes(q)
    );

    const field = this.sortField();
    const dir   = this.sortDir();
    result = [...result].sort((a, b) => {
      let cmp = 0;
      if (field === 'createdAt') {
        const da = this.rowCreatedAt(a)?.getTime() ?? 0;
        const db = this.rowCreatedAt(b)?.getTime() ?? 0;
        cmp = da - db;
      } else {
        cmp = a[field].localeCompare(b[field]);
      }
      return dir === 'asc' ? cmp : -cmp;
    });

    return result;
  });

  // ── Pagination
  totalPages = computed(() => Math.max(1, Math.ceil(this.filteredRows().length / PAGE_SIZE)));

  pagedRows = computed(() => {
    const page = Math.min(this.currentPage(), this.totalPages());
    const start = (page - 1) * PAGE_SIZE;
    return this.filteredRows().slice(start, start + PAGE_SIZE);
  });

  pageNumbers = computed(() => {
    const total = this.totalPages();
    const cur   = this.currentPage();
    const pages: (number | '…')[] = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (cur > 3)          pages.push('…');
      for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) pages.push(i);
      if (cur < total - 2)  pages.push('…');
      pages.push(total);
    }
    return pages;
  });

  setStreamId(val: string): void {
    this.streamId.set(val.trim());
  }

  fetchEvents(): void {
    const id = this.streamId().trim();
    if (!id) return;

    this.error.set(null);
    this.rows.set([]);
    this.filterText.set('');
    this.filterStatus.set('');
    this.filterDateFrom.set('');
    this.filterTimeFrom.set('');
    this.filterDateTo.set('');
    this.filterTimeTo.set('');
    this.sortField.set('createdAt');
    this.sortDir.set('desc');
    this.currentPage.set(1);
    this.loading.set(true);
    this.searched.set(false);

    this.eventStore.getEvents(id).subscribe({
      next: (data) => {
        const events: EventRecord[] = Array.isArray(data) ? data : [];
        const parsed: ExportRow[] = events.map(ev => ({
          id: ev.id,
          number: ev.number,
          type: ev.type,
          ...this.exportSvc.parseEvent(ev),
        }));
        this.rows.set(parsed);
        this.loading.set(false);
        this.searched.set(true);

        if (events.length === 0) {
          this.snackbar.info('No events found for this stream.');
        } else {
          this.snackbar.success(`Loaded ${events.length} event${events.length !== 1 ? 's' : ''}.`);
        }
      },
      error: (e) => {
        const msg = e?.error?.message ?? e?.message ?? 'Failed to fetch events.';
        this.error.set(msg);
        this.loading.set(false);
        this.searched.set(true);
        this.snackbar.error(msg);
      },
    });
  }

  exportExcel(): void {
    const rows = this.filteredRows();
    if (!rows.length) {
      this.snackbar.error('Nothing to export — fetch events first.');
      return;
    }
    this.exportSvc.exportToExcel(rows, this.streamId().trim());
    this.snackbar.success(`Exported ${rows.length} row${rows.length !== 1 ? 's' : ''} to Excel.`);
  }

  onFilterChange(): void { this.currentPage.set(1); }

  clearDateFilter(): void {
    this.filterDateFrom.set('');
    this.filterTimeFrom.set('');
    this.filterDateTo.set('');
    this.filterTimeTo.set('');
    this.onFilterChange();
  }

  setSort(field: 'aggregateId' | 'currentStatus' | 'createdAt'): void {
    if (this.sortField() === field) {
      this.sortDir.update(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortField.set(field);
      this.sortDir.set(field === 'createdAt' ? 'desc' : 'asc');
    }
    this.currentPage.set(1);
  }

  goToPage(p: number | '…'): void {
    if (p === '…') return;
    this.currentPage.set(Math.max(1, Math.min(p, this.totalPages())));
  }

  prevPage(): void { this.goToPage(this.currentPage() - 1); }
  nextPage(): void { this.goToPage(this.currentPage() + 1); }

  private rowCreatedAt(row: ExportRow): Date | null {
    if (!row.createdAt) return null;
    const d = new Date(row.createdAt);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  private dateTimeStart(dateStr: string, timeStr: string): Date | null {
    if (!dateStr) return null;
    const time = timeStr || '00:00:00';
    const d = new Date(`${dateStr}T${time}`);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  private dateTimeEnd(dateStr: string, timeStr: string): Date | null {
    if (!dateStr) return null;
    const time = timeStr || '23:59:59';
    const d = new Date(`${dateStr}T${time}`);
    return Number.isNaN(d.getTime()) ? null : d;
  }
}
