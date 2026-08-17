import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AggregationResult {
  results: Record<string, unknown>[];
  count: number;
}

@Injectable({ providedIn: 'root' })
export class DbAggregationService {
  constructor(private http: HttpClient) {}

  runAggregation(
    serverUrl: string,
    mongoUrl: string,
    database: string,
    collection: string,
    pipeline: unknown[],
  ): Observable<AggregationResult> {
    return this.http.post<AggregationResult>(`${serverUrl}/api/mongo-aggregate`, {
      mongoUrl, database, collection, pipeline,
    });
  }
}
