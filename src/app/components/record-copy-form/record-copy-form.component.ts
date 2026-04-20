import { Component, Output, EventEmitter, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecordCopyService, CopyCommandResult, ConfigEntry, Program, CopyTask } from '../../services/record-copy.service';
import { RecordCopyResultsComponent } from '../record-copy-results/record-copy-results.component';
import { RECORD_CONFIG_LOOKUP } from '../../data/record-config-lookup';

const PROGRAMS: Program[] = ['VR', 'ER', 'IL', 'ILOB'];
const TASKS: CopyTask[] = ['UpdateElement', 'CreateElement', 'Re-CreateElementHistory', 'CreateSection', 'CreateRecord'];
const NEEDS_SECTION: CopyTask[] = ['UpdateElement', 'CreateElement', 'Re-CreateElementHistory', 'CreateSection'];
const NEEDS_ELEMENT: CopyTask[] = ['UpdateElement', 'CreateElement', 'Re-CreateElementHistory'];

type Mode = 'copy' | 'lookup' | 'results';

@Component({
  selector: 'app-record-copy-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RecordCopyResultsComponent],
  templateUrl: './record-copy-form.component.html',
  styleUrls: ['./record-copy-form.component.css'],
})
export class RecordCopyFormComponent implements OnInit {
  @Output() success = new EventEmitter<CopyCommandResult>();

  mode = signal<Mode>('copy');
  programs = PROGRAMS;
  tasks = TASKS;

  mapping = signal<ConfigEntry[]>(RECORD_CONFIG_LOOKUP as ConfigEntry[]);
  mappingLoading = signal(false);
  lookupMapping = signal<ConfigEntry[]>(RECORD_CONFIG_LOOKUP as ConfigEntry[]);
  lookupMappingLoading = signal(false);

  form = signal({
    configId: '', sectionId: '', elementId: '',
    program: 'VR' as Program, task: 'UpdateElement' as CopyTask,
    effectiveDate: '', caseIdsRaw: '',
  });

  lookup = signal({
    caseId: '', configId: '', sectionId: '', elementId: '',
    program: 'VR' as Program,
  });

  lookupResult = signal<unknown[]| null>(null);
  lookupError = signal<string | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private svc: RecordCopyService) {}

  ngOnInit() { this.fetchMapping(this.form().program, false); }

  get needsSection() { return NEEDS_SECTION.includes(this.form().task); }
  get needsElement() { return NEEDS_ELEMENT.includes(this.form().task); }

  get formSections() {
    return this.mapping().find(c => c.config.configId === this.form().configId)?.sections ?? [];
  }
  get formElements() {
    return this.formSections.find(s => s.section.sectionId === this.form().sectionId)?.elements ?? [];
  }
  get lookupSections() {
    return this.lookupMapping().find(c => c.config.configId === this.lookup().configId)?.sections ?? [];
  }
  get lookupElements() {
    return this.lookupSections.find(s => s.section.sectionId === this.lookup().sectionId)?.elements ?? [];
  }

  fetchMapping(program: Program, isLookup: boolean) {
    if (isLookup) this.lookupMappingLoading.set(true);
    else this.mappingLoading.set(true);

    this.svc.getMapping(program).subscribe({
      next: data => {
        if (data?.length) {
          if (isLookup) this.lookupMapping.set(data);
          else this.mapping.set(data);
        }
        if (isLookup) this.lookupMappingLoading.set(false);
        else this.mappingLoading.set(false);
      },
      error: () => {
        if (isLookup) { this.lookupMapping.set(RECORD_CONFIG_LOOKUP as ConfigEntry[]); this.lookupMappingLoading.set(false); }
        else { this.mapping.set(RECORD_CONFIG_LOOKUP as ConfigEntry[]); this.mappingLoading.set(false); }
      },
    });
  }

  setFormField(field: string, value: unknown) {
    if (field === 'program') {
      this.form.update(f => ({ ...f, program: value as Program, configId: '', sectionId: '', elementId: '' }));
      this.fetchMapping(value as Program, false);
    } else if (field === 'task') {
      const task = value as CopyTask;
      this.form.update(f => ({
        ...f, task,
        sectionId: NEEDS_SECTION.includes(task) ? f.sectionId : '',
        elementId: NEEDS_ELEMENT.includes(task) ? f.elementId : '',
      }));
    } else if (field === 'configId') {
      this.form.update(f => ({ ...f, configId: value as string, sectionId: '', elementId: '' }));
    } else if (field === 'sectionId') {
      this.form.update(f => ({ ...f, sectionId: value as string, elementId: '' }));
    } else {
      this.form.update(f => ({ ...f, [field]: value }));
    }
  }

  setLookupField(field: string, value: unknown) {
    if (field === 'program') {
      this.lookup.update(l => ({ ...l, program: value as Program, configId: '', sectionId: '', elementId: '' }));
      this.fetchMapping(value as Program, true);
    } else if (field === 'configId') {
      this.lookup.update(l => ({ ...l, configId: value as string, sectionId: '', elementId: '' }));
    } else if (field === 'sectionId') {
      this.lookup.update(l => ({ ...l, sectionId: value as string, elementId: '' }));
    } else {
      this.lookup.update(l => ({ ...l, [field]: value }));
    }
  }

  handleSubmit() {
    this.error.set(null);
    const f = this.form();
    const caseIds = f.caseIdsRaw.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
    if (!caseIds.length) { this.error.set('Enter at least one case ID.'); return; }

    this.loading.set(true);
    this.svc.copyDataCollection(
      f.configId, f.program, f.task, caseIds,
      this.needsSection ? f.sectionId : undefined,
      this.needsElement ? f.elementId : undefined,
      f.effectiveDate || undefined,
    ).subscribe({
      next: r => { this.success.emit(r); this.loading.set(false); },
      error: e => { this.error.set(e.message ?? JSON.stringify(e)); this.loading.set(false); },
    });
  }

  handleLookup() {
    this.lookupError.set(null);
    this.lookupResult.set(null);
    const l = this.lookup();
    this.loading.set(true);
    this.svc.getRecordData(l.caseId, l.configId, l.sectionId, l.elementId).subscribe({
      next: d => { this.lookupResult.set(d); this.loading.set(false); },
      error: e => { this.lookupError.set(e.message ?? JSON.stringify(e)); this.loading.set(false); },
    });
  }

  lookupEntries(row: unknown): { key: string; val: string }[] {
    if (typeof row === 'object' && row !== null) {
      return Object.entries(row as Record<string, unknown>).map(([key, v]) => ({
        key, val: typeof v === 'object' ? JSON.stringify(v, null, 2) : String(v ?? '—'),
      }));
    }
    return [];
  }
}
