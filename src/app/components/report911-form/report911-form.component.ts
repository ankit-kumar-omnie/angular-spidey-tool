import { Component, Output, EventEmitter, signal, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Report911Service, CommandResult, Quarter, PolicyVersion } from '../../services/report911.service';
import { Report911ResultsComponent } from '../report911-results/report911-results.component';
import { DE_NAMES } from '../../data/de-names';

const QUARTERS: Quarter[] = ['Q1', 'Q2', 'Q3', 'Q4'];
const POLICY_VERSIONS: PolicyVersion[] = ['23-01'];
const MAX_DE = 3;

type Mode = 'copy' | 'unReport' | 'activation' | 'lookup' | 'results';

@Component({
  selector: 'app-report911-form',
  standalone: true,
  imports: [CommonModule, FormsModule, Report911ResultsComponent],
  templateUrl: './report911-form.component.html',
  styleUrls: ['./report911-form.component.css'],
})
export class Report911FormComponent implements OnInit {
  @Output() success = new EventEmitter<CommandResult | CommandResult[]>();
  @ViewChild('deDropdownContainer') deDropdownContainer?: ElementRef<HTMLElement>;

  mode = signal<Mode>('copy');
  quarters = QUARTERS;
  policyVersions = POLICY_VERSIONS;
  maxDe = MAX_DE;

  deOptions = signal<string[]>(DE_NAMES);
  deSearch = signal('');
  deDropdownOpen = signal(false);

  form = signal({
    deNames: [] as string[],
    programYear: 2025,
    quarter: 'Q1' as Quarter,
    policyVersion: '23-01' as PolicyVersion,
    effectiveDate: '',
    isActive: 'true',
    caseIdsRaw: '',
  });

  lookup = signal({
    caseId: '',
    deName: '',
    programYear: 2025,
    quarter: 'Q1' as Quarter,
    policyVersion: '23-01' as PolicyVersion,
  });

  lookupResult = signal<unknown>(null);
  lookupError = signal<string | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private svc: Report911Service) {}

  ngOnInit(): void {
    this.svc.getElements().subscribe({
      next: data => { if (data?.length) this.deOptions.set(data); },
      error: () => this.deOptions.set(DE_NAMES),
    });
  }

  get filteredDeOptions(): string[] {
    const s = this.deSearch().toLowerCase();
    return this.deOptions().filter(d => d.toLowerCase().includes(s));
  }

  toggleDeDropdown(): void {
    this.deDropdownOpen.update(o => !o);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.deDropdownOpen()) return;
    const target = event.target as Node | null;
    const container = this.deDropdownContainer?.nativeElement;
    if (container && target && !container.contains(target)) {
      this.deDropdownOpen.set(false);
    }
  }

  toggleDe(name: string): void {
    const cur = this.form().deNames;
    if (cur.includes(name)) {
      this.form.update(f => ({ ...f, deNames: cur.filter(d => d !== name) }));
    } else if (cur.length < MAX_DE) {
      this.form.update(f => ({ ...f, deNames: [...cur, name] }));
    }
  }

  removeDe(name: string): void {
    this.form.update(f => ({ ...f, deNames: f.deNames.filter(d => d !== name) }));
  }

  setField(field: string, value: unknown): void {
    this.form.update(f => ({ ...f, [field]: value }));
  }

  setLookupField(field: string, value: unknown): void {
    this.lookup.update(l => ({ ...l, [field]: value }));
  }

  get submitLabel(): string {
    if (this.loading()) return 'Submitting...';
    if (this.mode() === 'copy') return 'Copy to Report 911';
    if (this.mode() === 'unReport') return 'Un-Report';
    return this.form().isActive === 'true' ? 'Activate Cases' : 'Deactivate Cases';
  }

  get isUnreportStyle(): boolean {
    return this.mode() === 'unReport' || (this.mode() === 'activation' && this.form().isActive === 'false');
  }

  handleSubmit(): void {
    this.error.set(null);
    const f = this.form();
    const caseIds = f.caseIdsRaw.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
    if (!caseIds.length) { this.error.set('Enter at least one case ID.'); return; }
    if (this.mode() !== 'activation' && !f.deNames.length) { this.error.set('Select at least one DE Name.'); return; }

    this.loading.set(true);
    const deName = f.deNames.join(',');

    if (this.mode() === 'activation') {
      this.svc.activation(f.programYear, f.quarter, f.policyVersion, f.isActive, caseIds).subscribe({
        next: r => { this.success.emit(r); this.loading.set(false); },
        error: (e: Error) => { this.error.set(e.message ?? JSON.stringify(e)); this.loading.set(false); },
      });
    } else if (this.mode() === 'copy') {
      this.svc.copyRecord(deName, f.programYear, f.quarter, f.policyVersion, caseIds, f.effectiveDate || undefined).subscribe({
        next: r => { this.success.emit(r); this.loading.set(false); },
        error: (e: Error) => { this.error.set(e.message ?? JSON.stringify(e)); this.loading.set(false); },
      });
    } else {
      this.svc.unReport(deName, f.programYear, f.quarter, f.policyVersion, caseIds).subscribe({
        next: r => { this.success.emit(r); this.loading.set(false); },
        error: (e: Error) => { this.error.set(e.message ?? JSON.stringify(e)); this.loading.set(false); },
      });
    }
  }

  handleLookup(): void {
    this.lookupError.set(null);
    this.lookupResult.set(null);
    const l = this.lookup();
    this.loading.set(true);
    this.svc.getData(l.caseId, l.deName, l.programYear, l.quarter, l.policyVersion).subscribe({
      next: d => { this.lookupResult.set(d); this.loading.set(false); },
      error: (e: Error) => { this.lookupError.set(e.message ?? JSON.stringify(e)); this.loading.set(false); },
    });
  }

  lookupEntries(data: unknown): { key: string; val: string }[] {
    if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
      return Object.entries(data as Record<string, unknown>).map(([key, v]) => ({
        key,
        val: typeof v === 'object' ? JSON.stringify(v, null, 2) : String(v ?? '—'),
      }));
    }
    return [];
  }

  isLookupArray(data: unknown): boolean {
    return Array.isArray(data);
  }

  lookupArrayKeys(data: unknown): string[] {
    return Array.isArray(data) && data[0] ? Object.keys(data[0] as object) : [];
  }

  lookupArrayRows(data: unknown): Record<string, unknown>[] {
    return Array.isArray(data) ? (data as Record<string, unknown>[]) : [];
  }
}
