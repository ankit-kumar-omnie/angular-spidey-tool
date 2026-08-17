import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { DbAggregationService } from '../../services/db-aggregation.service';
import { CaseContextService } from '../../services/case-context.service';
import { CaseAggregationResultsService } from '../../services/case-aggregation-results.service';
import { SnackbarService } from '../../services/snackbar.service';
import { flattenObject } from '../../utils/flatten';

const CASE_DEFAULT_PIPELINE = `[
  {
    $match: {
      id: { $in: [] },
    },
  },
  {
    $addFields: {
      participantId: "$participant.displayId",
      currentStatus: "$status.name",
      statusDates: {
        $arrayToObject: {
          $map: {
            input: "$statuses",
            as: "status",
            in: {
              k: { $concat: ["$$status.type", "Date"] },
              v: "$$status.date",
            },
          },
        },
      },
    },
  },
  {
    $replaceRoot: {
      newRoot: {
        $mergeObjects: [
          {
            id: "$id",
            displayId: "$displayId",
            participantId: "$participantId",
            currentStatus: "$currentStatus",
          },
          "$statusDates",
        ],
      },
    },
  },
  {
    $project: { _id: 0 },
  },
]`;

@Component({
  selector: 'app-db-aggregation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './db-aggregation.component.html',
  styleUrls: ['./db-aggregation.component.css'],
})
export class DbAggregationComponent {
  private dbSvc      = inject(DbAggregationService);
  private snackbar   = inject(SnackbarService);
  readonly caseContext = inject(CaseContextService);
  private caseAggResults = inject(CaseAggregationResultsService);

  serverUrl  = signal('http://localhost:3333');
  mongoUrl   = signal('');
  database   = signal('');
  collection = signal('');
  pipelineText = signal('[\n  {\n    $match: {},\n  },\n]');

  loading  = signal(false);
  error    = signal<string | null>(null);
  searched = signal(false);
  results  = signal<Record<string, unknown>[]>([]);
  selectedColumns = signal<Set<string>>(new Set());

  hasValidInput = computed(() =>
    !!this.serverUrl().trim() && !!this.mongoUrl().trim() && !!this.database().trim() && !!this.collection().trim()
  );

  allColumns = computed<string[]>(() => {
    const seen = new Set<string>();
    const ordered: string[] = [];
    for (const doc of this.results()) {
      for (const key of Object.keys(flattenObject(doc))) {
        if (!seen.has(key)) { seen.add(key); ordered.push(key); }
      }
    }
    return ordered;
  });

  selectedColumnsOrdered = computed(() => {
    const selected = this.selectedColumns();
    return this.allColumns().filter(col => selected.has(col));
  });

  tableRows = computed(() =>
    this.results().map((doc, i) => ({ id: String((doc as any)['_id'] ?? (doc as any)['id'] ?? i), flat: flattenObject(doc) }))
  );

  loadCaseDefault(): void {
    this.collection.set('Case');

    const ids = this.caseContext.ids();
    if (!ids.length) {
      this.pipelineText.set(CASE_DEFAULT_PIPELINE);
      this.snackbar.info('Loaded the default "case" aggregation. Fetch a stream in Event Store Viewer, then use "Insert Case IDs" below.');
      return;
    }

    const pipeline = this.parsePipelineText(CASE_DEFAULT_PIPELINE);
    this.injectIds(pipeline, ids);
    this.pipelineText.set(JSON.stringify(pipeline, null, 2));
    this.snackbar.success(`Loaded the case aggregation with ${ids.length} case ID${ids.length !== 1 ? 's' : ''} from ${this.caseContext.sourceStreamId()}.`);
  }

  insertCaseIds(): void {
    const ids = this.caseContext.ids();
    if (!ids.length) {
      this.snackbar.error('No case IDs available — fetch a stream in Event Store Viewer first.');
      return;
    }
    let pipeline: any;
    try {
      pipeline = this.parsePipelineText(this.pipelineText());
    } catch {
      this.snackbar.error('Could not parse the current pipeline — fix the syntax first.');
      return;
    }
    if (!this.injectIds(pipeline, ids)) {
      this.snackbar.error('No $match.<field>.$in stage found to inject case IDs into.');
      return;
    }
    this.pipelineText.set(JSON.stringify(pipeline, null, 2));
    this.snackbar.success(`Inserted ${ids.length} case ID${ids.length !== 1 ? 's' : ''} from ${this.caseContext.sourceStreamId()} into the $in stage.`);
  }

  run(): void {
    this.error.set(null);

    if (!this.hasValidInput()) {
      this.error.set('Server URL, Mongo URL, database, and collection are all required.');
      return;
    }

    let pipeline: unknown[];
    try {
      pipeline = this.parsePipelineText(this.pipelineText());
    } catch (e: any) {
      this.error.set(e?.message ?? 'Invalid aggregation pipeline.');
      this.snackbar.error(this.error()!);
      return;
    }

    this.loading.set(true);
    this.searched.set(false);
    this.results.set([]);

    this.dbSvc.runAggregation(
      this.serverUrl().trim(), this.mongoUrl().trim(), this.database().trim(), this.collection().trim(), pipeline,
    ).subscribe({
      next: res => {
        const docs = res.results ?? [];
        this.results.set(docs);
        this.selectedColumns.set(new Set(this.allColumns()));
        this.caseAggResults.setResults(docs, 'id');
        this.loading.set(false);
        this.searched.set(true);
        if (docs.length === 0) {
          this.snackbar.info('No documents matched.');
        } else {
          this.snackbar.success(`Fetched ${docs.length} document${docs.length !== 1 ? 's' : ''}.`);
        }
      },
      error: (e) => {
        const msg = e?.error?.error ?? e?.message ?? 'Aggregation failed.';
        this.error.set(msg);
        this.loading.set(false);
        this.searched.set(true);
        this.snackbar.error(msg);
      },
    });
  }

  toggleColumn(col: string): void {
    this.selectedColumns.update(set => {
      const next = new Set(set);
      next.has(col) ? next.delete(col) : next.add(col);
      return next;
    });
  }

  selectAllColumns(): void { this.selectedColumns.set(new Set(this.allColumns())); }
  clearAllColumns(): void { this.selectedColumns.set(new Set()); }

  exportJson(): void {
    const data = this.results();
    if (!data.length) { this.snackbar.error('Nothing to export — run an aggregation first.'); return; }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${this.collection().trim() || 'aggregation'}-${Date.now()}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    this.snackbar.success(`Exported ${data.length} documents as JSON.`);
  }

  exportExcel(): void {
    const rows = this.tableRows();
    const columns = this.selectedColumnsOrdered();
    if (!rows.length || !columns.length) {
      this.snackbar.error('Nothing to export — run an aggregation and select at least one column.');
      return;
    }
    const aoa = [columns, ...rows.map(row => columns.map(col => (row.flat[col] ?? '') as any))];
    const worksheet = XLSX.utils.aoa_to_sheet(aoa);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');
    const safeName = (this.collection().trim() || 'aggregation').replace(/[^a-zA-Z0-9_-]/g, '_');
    XLSX.writeFile(workbook, `${safeName}-${Date.now()}.xlsx`);
    this.snackbar.success(`Exported ${rows.length} row${rows.length !== 1 ? 's' : ''} to Excel.`);
  }

  private parsePipelineText(text: string): unknown[] {
    const trimmed = text.trim();
    if (!trimmed) throw new Error('Aggregation pipeline is empty.');
    // Evaluated as JS (not strict JSON) so unquoted keys and // comments — the shape you'd paste from Compass/mongosh — work as-is.
    const value = new Function(`"use strict"; return (${trimmed});`)();
    if (!Array.isArray(value)) throw new Error('Aggregation pipeline must be an array of stages.');
    return value;
  }

  private injectIds(pipeline: any[], ids: string[]): boolean {
    for (const stage of pipeline) {
      const match = stage?.$match;
      if (match && typeof match === 'object') {
        for (const key of Object.keys(match)) {
          if (match[key] && typeof match[key] === 'object' && '$in' in match[key]) {
            match[key].$in = ids;
            return true;
          }
        }
      }
    }
    return false;
  }
}
