import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export type Quarter = 'Q1' | 'Q2' | 'Q3' | 'Q4';
export type PolicyVersion = '23-01';
export type MigrationStatus = 'InProgress' | 'Completed' | 'Failed' | 'Ready';

export interface CommandResult { message: string; id: string; }
export interface CaseSkipped { caseId: string; reason: string; }
export interface ResultRecord {
  id: string; de: string; status: string; unReport: boolean; activation?: string;
  successCases: string[]; skippedCases: CaseSkipped[]; errorCases: string[];
  createdAt: string; updatedAt: string; createdBy: { name: string };
}
export interface GetResultsParams {
  id?: string; deName?: string; status?: MigrationStatus;
  unReport?: boolean; activation?: string; page?: number; limit?: number;
}

@Injectable({ providedIn: 'root' })
export class Report911Service {
  constructor(private http: HttpClient, private auth: AuthService) {}

  private get headers() { return this.auth.getAuthHeaders(); }
  private get base() { return this.auth.baseUrl(); }

  copyRecord(deName: string, programYear: number, quarter: Quarter, policyVersion: PolicyVersion, caseIds: string[], effectiveDate?: string): Observable<CommandResult[]> {
    let params = new HttpParams({ fromObject: { deName, programYear: String(programYear), quarter, policyVersion } });
    if (effectiveDate) params = params.set('effectiveDate', effectiveDate);
    return this.http.post<CommandResult[]>(`${this.base}/reports/regulatory/copy-record-value-to-report911`, caseIds, { headers: this.headers, params });
  }

  unReport(deName: string, programYear: number, quarter: Quarter, policyVersion: PolicyVersion, caseIds: string[]): Observable<CommandResult[]> {
    const params = new HttpParams({ fromObject: { deName, programYear: String(programYear), quarter, policyVersion } });
    return this.http.post<CommandResult[]>(`${this.base}/reports/regulatory/unReport-deElement-report911`, caseIds, { headers: this.headers, params });
  }

  activation(programYear: number, quarter: Quarter, policyVersion: PolicyVersion, isActive: string, caseIds: string[]): Observable<CommandResult> {
    const params = new HttpParams({ fromObject: { programYear: String(programYear), quarter, policyVersion, isActive } });
    return this.http.post<CommandResult>(`${this.base}/reports/regulatory/report911-case-activation-deactivation`, caseIds, { headers: this.headers, params });
  }

  getResults(p: GetResultsParams = {}): Observable<ResultRecord[]> {
    let params = new HttpParams();
    if (p.id) params = params.set('id', p.id);
    if (p.deName) params = params.set('deName', p.deName);
    if (p.status) params = params.set('status', p.status);
    if (p.unReport !== undefined) params = params.set('unReport', String(p.unReport));
    if (p.activation !== undefined) params = params.set('activation', p.activation);
    if (p.page !== undefined) params = params.set('page', String(p.page));
    if (p.limit !== undefined) params = params.set('limit', String(p.limit));
    return this.http.get<ResultRecord[]>(`${this.base}/reports/regulatory/tool-result`, { headers: this.headers, params });
  }

  getData(caseId: string, deName: string, programYear: number, quarter: Quarter, policyVersion: PolicyVersion): Observable<unknown> {
    const params = new HttpParams({ fromObject: { caseId, deName, programYear: String(programYear), quarter, policyVersion } });
    return this.http.get(`${this.base}/reports/regulatory/report911-data`, { headers: this.headers, params });
  }

  getElements(): Observable<string[]> {
    return this.http.get<string[]>(`${this.base}/reports/regulatory/report911-elements`, { headers: this.headers });
  }
}
