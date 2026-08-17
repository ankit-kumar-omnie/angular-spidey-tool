import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { EventRecord } from './event-store.service';

export interface StreamExportRow {
  aggregateId: string;
  currentStatus: string;
  statusDate: string;
  targetStatus: string;
  createdAt: string;
  userName: string;
}

const EXPORT_COLUMNS: { key: keyof StreamExportRow; header: string }[] = [
  { key: 'aggregateId',   header: 'Aggregate ID' },
  { key: 'currentStatus', header: 'Rollback From' },
  { key: 'statusDate',    header: 'Status Date' },
  { key: 'targetStatus',  header: 'Rollback To' },
  { key: 'createdAt',     header: 'Created At' },
  { key: 'userName',      header: 'User' },
];

@Injectable({ providedIn: 'root' })
export class StreamExportService {

  /** Flattens an event envelope into the same row shape used by the case-status-rolled-back export script. */
  parseEvent(ev: EventRecord): StreamExportRow {
    const data: any = ev.data ?? {};
    const payload: any = data.payload ?? {};

    return {
      aggregateId: data?.aggregateId ?? '',
      currentStatus:
        payload?.currentStatus?.name ??
        payload?.currentStatus?.type ??
        data?.currentStatus?.name ??
        data?.currentStatus?.type ??
        '',
      statusDate:
        payload?.targetStatus?.date ??
        data?.targetStatus?.date ??
        '',
      targetStatus:
        payload?.targetStatus?.name ??
        payload?.targetStatus?.type ??
        data?.targetStatus?.name ??
        data?.targetStatus?.type ??
        '',
      createdAt: data?.createdAt ?? '',
      userName:
        data?.userContext?.name ??
        payload?.userContext?.name ??
        '',
    };
  }

  /** Builds a single-tab workbook from the flattened rows and triggers a browser download. `extraColumns` appends fields beyond the fixed Rollback shape, e.g. joined case-aggregation data. */
  exportToExcel(rows: Record<string, unknown>[], streamId: string, extraColumns: { key: string; header: string }[] = []): void {
    const columns = [...EXPORT_COLUMNS, ...extraColumns];
    const aoa = [
      columns.map(col => col.header),
      ...rows.map(row => columns.map(col => row[col.key] ?? '')),
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(aoa);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Events');

    const safeName = streamId.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40) || 'stream';
    XLSX.writeFile(workbook, `stream-export-${safeName}-${Date.now()}.xlsx`);
  }
}
