import { Injectable, signal } from '@angular/core';

const TOKEN_KEY = 'report911_access_token';
const BASE_URL_KEY = 'report911_base_url';

const ENV_URL_MAP: Record<string, string> = {
  Test: 'https://test-api.informed.cloud/api',
  Staging: 'https://staging-api.informed.cloud/api',
  Production: 'https://api.informed.cloud/api',
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly token = signal<string>(localStorage.getItem(TOKEN_KEY) ?? '');
  readonly baseUrl = signal<string>(this._initBaseUrl());

  private _initBaseUrl(): string {
    const cached = localStorage.getItem(BASE_URL_KEY);
    if (cached && !cached.includes('/api')) {
      localStorage.removeItem(BASE_URL_KEY);
      return 'https://test-api.informed.cloud/api';
    }
    return cached || 'https://test-api.informed.cloud/api';
  }

  setToken(token: string): void {
    this.token.set(token);
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      const env = this.decodeEnv(token);
      const url = env ? ENV_URL_MAP[env] : this.baseUrl();
      this.baseUrl.set(url);
      localStorage.setItem(BASE_URL_KEY, url);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  clearToken(): void { this.setToken(''); }

  getAuthHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token()}`,
    };
  }

  decodeTenant(token: string): string {
    try {
      return JSON.parse(atob(token.split('.')[1]))['active-tenant'] ?? '';
    } catch { return ''; }
  }

  decodeRole(token:string):string{
    try{
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload['role'];
      return typeof role === 'string' ? 'Super Admin' : '';
    } catch {
      return `` 
    }
  }

  decodeEnv(token: string): 'Test' | 'Staging' | 'Production' | '' {
    try {
      const aud: string[] = JSON.parse(atob(token.split('.')[1])).aud ?? [];
      const a = Array.isArray(aud) ? aud : [aud];
      if (a.some((x: string) => x.includes('-test'))) return 'Test';
      if (a.some((x: string) => x.includes('-staging'))) return 'Staging';
      if (a.some((x: string) => x.includes('-prod'))) return 'Production';
      return '';
    } catch { return ''; }
  }

  decodeUserName(token: string): string {
    try {
      const p = JSON.parse(atob(token.split('.')[1]));
      const s = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : undefined);
      if (s(p['given_name']) && s(p['family_name'])) return `${p['given_name']} ${p['family_name']}`;
      return s(p['name']) ?? s(p['preferred_username']) ?? s(p['sub']) ?? '';
    } catch { return ''; }
  }
}
