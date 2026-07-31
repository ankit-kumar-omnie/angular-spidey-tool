import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface EventRecord {
  id: string;
  number: number;
  type: string;
  data: {
    tenantId: string;
    aggregateName: string;
    aggregateId: string;
    commandId: string;
    eventNumber: number;
    eventName: string;
    createdBy: string;
    createdAt: string;
    payload: unknown;
    userContext?: {
      id: string;
      name: string;
      tenantId: string;
      requestId: string;
    };
  };
}

export type EventEnvPrefix = 'staging' | 'alpha' | 'migration';
export type AggregateType = 'fundAccount' | 'record' | 'case' | 'caseService' | 'authorization' | 'Report911' | 'dataCollection' | 'payment';

export const ENV_PREFIXES: { value: EventEnvPrefix; label: string }[] = [
  { value: 'staging',   label: 'Test' },
  { value: 'alpha',     label: 'Staging / Production' },
  { value: 'migration', label: 'Migration (WY Prod)' },
];

export const AGGREGATE_TYPES: { value: AggregateType; label: string }[] = [
  { value: 'fundAccount',   label: 'Fund Account' },
  { value: 'record',        label: 'Record' },
  { value: 'case',          label: 'Case' },
  { value: 'authorization', label: 'Authorization' },
  { value: 'Report911',     label: 'Report 911' },
  { value: 'dataCollection', label: 'Data Collection' },
  { value: 'payment',       label: 'Payment' },
];

@Injectable({ providedIn: 'root' })
export class EventStoreService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  private get headers() { return this.auth.getAuthHeaders(); }
  private get base()    { return this.auth.baseUrl(); }

  /**
   * Builds the stream ID: {env}:{tenant}:{aggregateType}-{aggregateId}
   * e.g. alpha:azrsa:fundAccount-4513eac7-d9cf-4972-966e-d67eece5a37e
   */
  buildStreamId(env: EventEnvPrefix, tenant: string, aggregate: AggregateType | string, id: string): string {
    return `${env}:${tenant.trim()}:${aggregate}-${id.trim()}`;
  }

  getEvents(streamId: string): Observable<EventRecord[]> {
    const params = new HttpParams().set('streamId', streamId);
    return this.http.get<EventRecord[]>(
      `${this.base}/aggregates/events/${encodeURIComponent(streamId)}`,
      { headers: this.headers, params }
    );
  }

  updateEvent(streamId: string, eventNumber: number, updatedData: Partial<EventRecord>): Observable<EventRecord> {
    return this.http.put<EventRecord>(
      `${this.base}/aggregates/events/${encodeURIComponent(streamId)}/${eventNumber}`,
      updatedData,
      { headers: this.headers }
    );
  }
}
