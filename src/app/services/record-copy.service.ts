import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export type Program = 'VR' | 'ER' | 'IL' | 'ILOB';
export type CopyTask = 'UpdateElement' | 'CreateElement' | 'Re-CreateElementHistory' | 'CreateSection' | 'CreateRecord';
export type CopyStatus = 'InProgress' | 'Completed' | 'Failed' | 'Ready';

export interface ConfigElement { elementId: string; elementLabel: string; }
export interface ConfigSection { section: { sectionId: string; sectionLabel: string }; elements: ConfigElement[]; }
export interface ConfigEntry { config: { configId: string; configLabel: string }; sections: ConfigSection[]; }
export interface CopyCommandResult { message: string; id: string; }
export interface CopyResultRecord {
  id: string; configId: string; sectionId: string; elementId: string;
  program: string; task: string; status: string;
  successCases: string[]; skippedCases: { caseId: string; reason: string }[];
  errorCases: string[]; createdAt: string; updatedAt: string; createdBy: { name: string };
}
export interface GetCopyResultsParams {
  id?: string; status?: CopyStatus; configId?: string;
  sectionId?: string; elementId?: string; program?: Program; task?: CopyTask;
}
export interface RecordDataResult { recordId?: string; caseId: string; value?: unknown; message?: string; }

@Injectable({ providedIn: 'root' })
export class RecordCopyService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  private get headers() { return this.auth.getAuthHeaders(); }
  private get base() { return this.auth.baseUrl(); }

  copyDataCollection(configId: string, program: Program, task: CopyTask, caseIds: string[], sectionId?: string, elementId?: string, effectiveDate?: string): Observable<CopyCommandResult> {
    let params = new HttpParams({ fromObject: { configId, program, task } });
    if (sectionId) params = params.set('sectionId', sectionId);
    if (elementId) params = params.set('elementId', elementId);
    if (effectiveDate) params = params.set('effectiveDate', effectiveDate);
    return this.http.post<CopyCommandResult>(`${this.base}/records/copy-dataCollection-to-record`, caseIds, { headers: this.headers, params });
  }

  getResults(p: GetCopyResultsParams = {}): Observable<CopyResultRecord[]> {
    let params = new HttpParams();
    if (p.id) params = params.set('id', p.id);
    if (p.status) params = params.set('status', p.status);
    if (p.configId) params = params.set('configId', p.configId);
    if (p.sectionId) params = params.set('sectionId', p.sectionId);
    if (p.elementId) params = params.set('elementId', p.elementId);
    if (p.program) params = params.set('program', p.program);
    if (p.task) params = params.set('task', p.task);
    return this.http.get<CopyResultRecord[]>(`${this.base}/result-copy-dataCollection-to-record`, { headers: this.headers, params });
  }

  getRecordData(caseId: string, configId: string, sectionId: string, elementId: string): Observable<RecordDataResult[]> {
    const params = new HttpParams({ fromObject: { caseId, configId, sectionId, elementId } });
    return this.http.get<RecordDataResult[]>(`${this.base}/record-data`, { headers: this.headers, params });
  }

  getMapping(program: Program): Observable<ConfigEntry[]> {
    const params = new HttpParams({ fromObject: { program } });
    return this.http.get<ConfigEntry[]>(`${this.base}/records-mapping`, { headers: this.headers, params });
  }
}
