import { Injectable, signal } from '@angular/core';

/** Bridges "aggregate IDs from the last Event Store fetch" into the DB Aggregation tool, so a case-status stream fetch can feed straight into a Mongo lookup. */
@Injectable({ providedIn: 'root' })
export class CaseContextService {
  readonly ids = signal<string[]>([]);
  readonly sourceStreamId = signal<string>('');

  setIds(ids: string[], sourceStreamId: string): void {
    this.ids.set(Array.from(new Set(ids.filter(Boolean))));
    this.sourceStreamId.set(sourceStreamId);
  }
}
