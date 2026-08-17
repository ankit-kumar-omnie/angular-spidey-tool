import { Injectable, signal } from '@angular/core';

/** Publishes the last DB Aggregation run's documents, keyed by their `id` field, so Event Store table views can join them back onto events by aggregateId. */
@Injectable({ providedIn: 'root' })
export class CaseAggregationResultsService {
  readonly resultsById = signal<Record<string, Record<string, unknown>>>({});

  setResults(docs: Record<string, unknown>[], idKey = 'id'): void {
    const map: Record<string, Record<string, unknown>> = {};
    for (const doc of docs) {
      const id = doc[idKey];
      if (typeof id === 'string' && id) map[id] = doc;
    }
    this.resultsById.set(map);
  }

  clear(): void {
    this.resultsById.set({});
  }
}
