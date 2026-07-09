import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule, DatePipe, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  EventStoreService, EventRecord,
  EventEnvPrefix, AggregateType,
  AGGREGATE_TYPES,
} from '../../services/event-store.service';
import { SnackbarService } from '../../services/snackbar.service';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';

const PAGE_SIZE = 10;

/** JWT environment (auth) → event-store stream prefix */
const JWT_ENV_TO_PREFIX: Record<string, EventEnvPrefix> = {
  Test: 'staging',
  Staging: 'migration',
  Production: 'alpha',
  Migration: 'migration',
};

const CUSTOM_AGGREGATE = '__custom__' as const;

const JWT_ENV_LABELS: Record<string, string> = {
  Test: 'Test',
  Staging: 'Staging (Migration)',
  Production: 'Production',
  Migration: 'Migration (WY Prod)',
};

@Component({
  selector: 'app-event-store',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, JsonPipe],
  templateUrl: './event-store.component.html',
  styleUrls: ['./event-store.component.css'],
})
export class EventStoreComponent {
  private svc      = inject(EventStoreService);
  private snackbar = inject(SnackbarService);
  readonly theme   = inject(ThemeService);
  private auth     = inject(AuthService);

  // ── Editable form state (env + tenant come from JWT only)
  aggregatePreset = signal<AggregateType | typeof CUSTOM_AGGREGATE>('fundAccount');
  customAggregate = signal('');
  aggregateId     = signal('');

  /** Preset or temporary custom aggregate name for stream ID */
  effectiveAggregate = computed(() => {
    if (this.aggregatePreset() === CUSTOM_AGGREGATE) {
      return this.customAggregate().trim();
    }
    return this.aggregatePreset();
  });

  /** Stream prefix from JWT (staging / alpha / migration) */
  tokenEnvPrefix = computed((): EventEnvPrefix | null => {
    const token = this.auth.token();
    if (!token) return null;
    const prefix = JWT_ENV_TO_PREFIX[this.auth.decodeEnv(token)];
    return prefix ?? null;
  });

  tokenTenant = computed(() => {
    const token = this.auth.token();
    return token ? this.auth.decodeTenant(token) : '';
  });

  envLabel = computed(() => {
    const token = this.auth.token();
    if (!token) return '—';
    const jwtEnv = this.auth.decodeEnv(token);
    return jwtEnv ? (JWT_ENV_LABELS[jwtEnv] ?? jwtEnv) : '—';
  });

  hasTokenContext = computed(() => !!this.tokenEnvPrefix() && !!this.tokenTenant().trim());

  // ── UI state
  loading    = signal(false);
  error      = signal<string | null>(null);
  events     = signal<EventRecord[]>([]);
  expanded   = signal<Set<string>>(new Set());
  filterText     = signal('');
  filterType     = signal('');
  filterDateFrom = signal('');
  filterTimeFrom = signal('');
  filterDateTo   = signal('');
  filterTimeTo   = signal('');
  searched   = signal(false);
  currentPage = signal(1);

  // ── Sort state
  sortField = signal<'number' | 'type' | 'date'>('number');
  sortDir   = signal<'asc' | 'desc'>('asc');

  // ── Static options
  aggregateTypes = AGGREGATE_TYPES;

  // ── Stream ID (always uses token env + tenant in URL)
  streamId = computed(() => {
    const env = this.tokenEnvPrefix();
    const tenant = this.tokenTenant().trim();
    const id = this.aggregateId().replace(/^["']|["']$/g, '').trim();
    const agg = this.effectiveAggregate();
    if (!env || !tenant) {
      return `${env ?? '<env>'}:${tenant || '<tenant>'}:${agg}-<guid>`;
    }
    return id
      ? this.svc.buildStreamId(env, tenant, agg, id)
      : `${env}:${tenant}:${agg}-<guid>`;
  });

  // ── Unique event types for dropdown filter
  eventTypes = computed(() => {
    const types = new Set(this.events().map(e => e.type));
    return Array.from(types).sort();
  });

  hasActiveFilters = computed(() =>
    !!this.filterText().trim() ||
    !!this.filterType().trim() ||
    !!this.filterDateFrom() ||
    !!this.filterTimeFrom() ||
    !!this.filterDateTo() ||
    !!this.filterTimeTo()
  );

  // ── Filtered + sorted events (text + type + date range + sort)
  filteredEvents = computed(() => {
    let result = this.events();
    const type = this.filterType().trim();
    if (type) result = result.filter(ev => ev.type === type);

    const from = this.dateTimeStart(this.filterDateFrom(), this.filterTimeFrom());
    const to = this.dateTimeEnd(this.filterDateTo(), this.filterTimeTo());
    if (from || to) {
      result = result.filter(ev => {
        const created = this.eventCreatedAt(ev);
        if (!created) return false;
        if (from && created < from) return false;
        if (to && created > to) return false;
        return true;
      });
    }

    const q = this.filterText().toLowerCase().trim();
    if (q) result = result.filter(ev =>
      ev.type.toLowerCase().includes(q) ||
      ev.id.toLowerCase().includes(q) ||
      ev.data.commandId?.toLowerCase().includes(q) ||
      ev.data.userContext?.name?.toLowerCase().includes(q) ||
      ev.data.userContext?.id?.toLowerCase().includes(q) ||
      JSON.stringify(ev.data.payload).toLowerCase().includes(q)
    );

    // ── Sort
    const field = this.sortField();
    const dir   = this.sortDir();
    result = [...result].sort((a, b) => {
      let cmp = 0;
      if (field === 'number') {
        cmp = (a.number ?? 0) - (b.number ?? 0);
      } else if (field === 'type') {
        cmp = a.type.localeCompare(b.type);
      } else if (field === 'date') {
        const da = this.eventCreatedAt(a)?.getTime() ?? 0;
        const db = this.eventCreatedAt(b)?.getTime() ?? 0;
        cmp = da - db;
      }
      return dir === 'asc' ? cmp : -cmp;
    });

    return result;
  });

  // ── Pagination
  totalPages = computed(() => Math.max(1, Math.ceil(this.filteredEvents().length / PAGE_SIZE)));

  pagedEvents = computed(() => {
    const page = Math.min(this.currentPage(), this.totalPages());
    const start = (page - 1) * PAGE_SIZE;
    return this.filteredEvents().slice(start, start + PAGE_SIZE);
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

  // ── Methods
  readonly customAggregateKey = CUSTOM_AGGREGATE;

  selectAggregatePreset(value: AggregateType): void {
    this.aggregatePreset.set(value);
  }

  selectCustomAggregate(): void {
    this.aggregatePreset.set(CUSTOM_AGGREGATE);
  }

  setCustomAggregate(val: string): void {
    this.customAggregate.set(val.replace(/[^a-zA-Z0-9]/g, ''));
  }

  setAggregateId(val: string): void {
    this.aggregateId.set(val.replace(/["']/g, '').trim());
  }

  fetchEvents(): void {
    this.error.set(null);
    this.events.set([]);
    this.expanded.set(new Set());
    this.filterText.set('');
    this.filterType.set('');
    this.filterDateFrom.set('');
    this.filterTimeFrom.set('');
    this.filterDateTo.set('');
    this.filterTimeTo.set('');
    this.sortField.set('number');
    this.sortDir.set('asc');
    this.currentPage.set(1);
    this.loading.set(true);
    this.searched.set(false);

    this.svc.getEvents(this.streamId()).subscribe({
      next: data => {
        this.events.set(Array.isArray(data) ? data : []);
        this.loading.set(false);
        this.searched.set(true);
        if (data.length === 0) {
          this.snackbar.info('No events found for this stream.');
        } else {
          this.snackbar.success(`Loaded ${data.length} event${data.length !== 1 ? 's' : ''}.`);
        }
      },
      error: (e) => {
        this.error.set(e?.message ?? 'Failed to fetch events.');
        this.loading.set(false);
        this.searched.set(true);
        this.snackbar.error(e?.message ?? 'Failed to fetch events.');
      },
    });
  }

  goToPage(p: number | '…'): void {
    if (p === '…') return;
    this.currentPage.set(Math.max(1, Math.min(p, this.totalPages())));
  }

  prevPage(): void { this.goToPage(this.currentPage() - 1); }
  nextPage(): void { this.goToPage(this.currentPage() + 1); }

  onFilterChange(): void { this.currentPage.set(1); }

  setSort(field: 'number' | 'type' | 'date'): void {
    if (this.sortField() === field) {
      // cycle: asc → desc → asc
      this.sortDir.update(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortField.set(field);
      this.sortDir.set('asc');
    }
    this.currentPage.set(1);
  }

  clearDateFilter(): void {
    this.filterDateFrom.set('');
    this.filterTimeFrom.set('');
    this.filterDateTo.set('');
    this.filterTimeTo.set('');
    this.onFilterChange();
  }

  private eventCreatedAt(ev: EventRecord): Date | null {
    const raw = ev.data?.createdAt;
    if (!raw) return null;
    const d = new Date(raw);
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

  toggleExpand(id: string): void {
    this.expanded.update(s => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  copy(text: string): void {
    navigator.clipboard.writeText(text).then(() => this.snackbar.info('Copied to clipboard.'));
  }

  copyStreamId(): void {
    navigator.clipboard.writeText(this.streamId()).then(() => this.snackbar.success('Stream ID copied.'));
  }

  copyPayload(ev: EventRecord): void {
    navigator.clipboard
      .writeText(JSON.stringify(ev.data.payload, null, 2))
      .then(() => this.snackbar.success('Payload copied as JSON.'));
  }

  // ── Export — all filtered events as JSON file
  exportJson(): void {
    const data   = this.filteredEvents();
    const blob   = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url    = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    const name   = `events-${this.effectiveAggregate()}-${this.aggregateId().slice(0, 8) || 'stream'}-${Date.now()}.json`;
    anchor.href     = url;
    anchor.download = name;
    anchor.click();
    URL.revokeObjectURL(url);
    this.snackbar.success(`Exported ${data.length} events as ${name}`);
  }
}
