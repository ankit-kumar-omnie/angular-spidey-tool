import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface LogAnalysisErrorLocation {
  file: string;
  line?: number;
  className?: string;
  method?: string;
}

export interface LogAnalysisSuggestion {
  title: string;
  description: string;
  codeSnippet?: string;
}

export interface SplunkLogAnalysisResponse {
  summary: string;
  rootCause: string;
  errorLocation: LogAnalysisErrorLocation;
  suggestions: LogAnalysisSuggestion[];
  analyzedLog: Record<string, unknown>;
}

export interface SplunkAnalyzeParams {
  backendUrl: string;
  splunkHost: string;
  splunkUsername: string;
  splunkPassword: string;
  splunkIndex?: string;
  earliest?: string;
  latest?: string;
  requestId?: string;
  level?: string[];
  className?: string;
  keyword?: string;
  limit?: number;
  anthropicApiKey: string;
  model?: string;
}

@Injectable({ providedIn: 'root' })
export class SplunkAnalyzeService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  private get headers() { return this.auth.getAuthHeaders(); }

  analyze(params: SplunkAnalyzeParams): Observable<SplunkLogAnalysisResponse> {
    let httpParams = new HttpParams()
      .set('splunkHost', params.splunkHost)
      .set('splunkUsername', params.splunkUsername)
      .set('splunkPassword', params.splunkPassword)
      .set('anthropicApiKey', params.anthropicApiKey);

    if (params.splunkIndex)  httpParams = httpParams.set('splunkIndex', params.splunkIndex);
    if (params.earliest)     httpParams = httpParams.set('earliest', params.earliest);
    if (params.latest)       httpParams = httpParams.set('latest', params.latest);
    if (params.requestId)    httpParams = httpParams.set('requestId', params.requestId);
    if (params.className)    httpParams = httpParams.set('className', params.className);
    if (params.keyword)      httpParams = httpParams.set('keyword', params.keyword);
    if (params.limit)        httpParams = httpParams.set('limit', params.limit.toString());
    if (params.model)        httpParams = httpParams.set('model', params.model);
    if (params.level?.length) {
      params.level.forEach(l => httpParams = httpParams.append('level', l));
    }

    const baseUrl = params.backendUrl.replace(/\/+$/, '');

    return this.http.get<SplunkLogAnalysisResponse>(
      `${baseUrl}/splunk/logs/analyze`,
      { headers: this.headers, params: httpParams },
    );
  }
}
