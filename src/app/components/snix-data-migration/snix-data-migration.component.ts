
import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

// ================================
// INTERFACES
// ================================

interface CaseRecord {
  id: string;
  displayId: string;
}

interface ParticipantRecord {
  participantId: string;
  caseId: string;
  [key: string]: unknown;
}

interface ProcessedRecord {
  participantId: string;
  originalCaseId: string;
  convertedCaseId: string;
  status: 'MATCHED' | 'UNMATCHED';
  originalRecord: ParticipantRecord;
}

interface DuplicateEntry {
  value: string;
  count: number;
}

interface DuplicateSummary {
  duplicateDisplayIds: DuplicateEntry[];
  duplicateCaseIds: DuplicateEntry[];
  duplicateParticipantIds: DuplicateEntry[];
}

interface ProcessingResult {
  records: ProcessedRecord[];
  totalRecords: number;
  matchedRecords: number;
  unmatchedRecords: number;
  matchingPercentage: number;
  duplicateSummary: DuplicateSummary;
}

type RecordFilter = 'ALL' | 'MATCHED' | 'UNMATCHED';
type InputMode = 'FILE' | 'JSON';

// ================================
// COMPONENT
// ================================

@Component({
  selector: 'app-snix-data-migration',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './snix-data-migration.component.html',
  styleUrls: ['./snix-data-migration.component.css'],
})
export class SnixDataMigrationComponent {
  

  // ================================
  // UPLOADED DATA
  // ================================

  data1 = signal<CaseRecord[]>([]);
  data2 = signal<ParticipantRecord[]>([]);

  
  
  // Add these three signals here
  showAllDisplayIds = signal(false);
  showAllCaseIds = signal(false);
  showAllParticipantIds = signal(false);

  // ================================
  // FILE INFORMATION
  // ================================

  data1FileName = signal('');
  data2FileName = signal('');

  data1Loaded = signal(false);
  data2Loaded = signal(false);

  data1Error = signal('');
  data2Error = signal('');

  // Input method selection
data1InputMode = signal<InputMode>('FILE');
data2InputMode = signal<InputMode>('FILE');

// Direct JSON text
data1JsonText = signal('');
data2JsonText = signal('');

  // ================================
  // PROCESSING STATE
  // ================================

  processingResult = signal<ProcessingResult | null>(null);

  // ================================
  // SEARCH AND FILTER STATE
  // ================================

  searchTerm = signal('');
  selectedFilter = signal<RecordFilter>('ALL');

  // Client-side pagination
  currentPage = signal(1);
  pageSize = 10;

  

  filteredRecords = computed(() => {

    const result = this.processingResult();

    if (!result) return [];

    const search = this.searchTerm().toLowerCase();
    const filter = this.selectedFilter();

    return result.records.filter(record => {

      const matchesFilter =
        filter === 'ALL' || record.status === filter;

      const matchesSearch =
        record.participantId.toLowerCase().includes(search) ||
        record.originalCaseId.toLowerCase().includes(search) ||
        record.convertedCaseId.toLowerCase().includes(search);

      return matchesFilter && matchesSearch;
    });
  });

  // Total number of pages after search and filtering.
  totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredRecords().length / this.pageSize))
  );

  // Records visible on the current page.
  paginatedRecords = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.pageSize;

    return this.filteredRecords().slice(
      startIndex,
      startIndex + this.pageSize
    );
  });

  // First visible record number.
  startRecord = computed(() => {
    return this.filteredRecords().length === 0
      ? 0
      : (this.currentPage() - 1) * this.pageSize + 1;
  });

  // Last visible record number.
  endRecord = computed(() => {
    return Math.min(
      this.currentPage() * this.pageSize,
      this.filteredRecords().length
    );
  });

  // ================================
  // READ JSON FILE
  // ================================

  private readJsonFile(file: File): Promise<unknown> {

    return new Promise((resolve, reject) => {

      const reader = new FileReader();

      reader.onload = () => {
        try {
          resolve(JSON.parse(reader.result as string));
        } catch {
          reject(new Error('Invalid JSON file.'));
        }
      };

      reader.onerror = () => {
        reject(new Error('Unable to read the file.'));
      };

      reader.readAsText(file);
    });
  }

  // ================================
  // OBJECT VALIDATION
  // ================================

  private isObject(value: unknown): value is Record<string, unknown> {

    return typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value);
  }

  // ================================
  // VALIDATE DATA 1
  // ================================

  // Validate Data 1 JSON data.
private validateData1Data(data: unknown): CaseRecord[] {

  if (!Array.isArray(data)) {
    throw new Error('Data 1 must contain a JSON array.');
  }

  const valid = data.every(item =>
    this.isObject(item) &&
    typeof item['id'] === 'string' &&
    typeof item['displayId'] === 'string'
  );

  if (!valid) {
    throw new Error(
      'Every Data 1 record must contain string id and displayId fields.'
    );
  }

  return data as CaseRecord[];
}

// Read and validate Data 1 file.
private async validateData1(file: File): Promise<CaseRecord[]> {

  const data = await this.readJsonFile(file);

  return this.validateData1Data(data);
}
  // ================================
  // VALIDATE DATA 2
  // ================================

 // Validate Data 2 JSON data.
private validateData2Data(data: unknown): ParticipantRecord[] {

  if (!Array.isArray(data)) {
    throw new Error('Data 2 must contain a JSON array.');
  }

  const valid = data.every(item =>
    this.isObject(item) &&
    typeof item['participantId'] === 'string' &&
    typeof item['caseId'] === 'string'
  );

  if (!valid) {
    throw new Error(
      'Every Data 2 record must contain string participantId and caseId fields.'
    );
  }

  return data as ParticipantRecord[];
}

// Read and validate Data 2 file.
private async validateData2(file: File): Promise<ParticipantRecord[]> {

  const data = await this.readJsonFile(file);

  return this.validateData2Data(data);
}

  // ================================
  // DATA 1 UPLOAD
  // ================================

  async onData1Selected(event: Event): Promise<void> {

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    this.resetProcessing();

    this.data1Error.set('');
    this.data1Loaded.set(false);
    this.data1.set([]);
    this.data1FileName.set('');

    try {

      const records = await this.validateData1(file);

      this.data1.set(records);
      this.data1FileName.set(file.name);
      this.data1Loaded.set(true);

    } catch (error) {

      this.data1Error.set(
        error instanceof Error ? error.message : 'Upload failed.'
      );

    } finally {
      input.value = '';
    }
  }

  // ================================
  // DATA 2 UPLOAD
  // ================================

  async onData2Selected(event: Event): Promise<void> {

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    this.resetProcessing();

    this.data2Error.set('');
    this.data2Loaded.set(false);
    this.data2.set([]);
    this.data2FileName.set('');

    try {

      const records = await this.validateData2(file);

      this.data2.set(records);
      this.data2FileName.set(file.name);
      this.data2Loaded.set(true);

    } catch (error) {

      this.data2Error.set(
        error instanceof Error ? error.message : 'Upload failed.'
      );

    } finally {
      input.value = '';
    }
  }

  // ================================
  // RESET PROCESSING
  // ================================

  private resetProcessing(): void {

    this.processingResult.set(null);
    this.searchTerm.set('');
    this.selectedFilter.set('ALL');
    this.currentPage.set(1);

    this.showAllDisplayIds.set(false);
    this.showAllCaseIds.set(false);
    this.showAllParticipantIds.set(false);
  }

  // Reset pagination whenever search text changes.
  onSearchChange(value: string): void {
    this.searchTerm.set(value);
    this.currentPage.set(1);
  }

  // Reset pagination whenever the selected filter changes.
  onFilterChange(value: RecordFilter): void {
    this.selectedFilter.set(value);
    this.currentPage.set(1);
  }

  goToPreviousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(page => page - 1);
    }
  }

  goToNextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(page => page + 1);
    }
  }
  toggleDisplayIds(): void {
  this.showAllDisplayIds.update(current => !current);
}

toggleCaseIds(): void {
  this.showAllCaseIds.update(current => !current);
}

toggleParticipantIds(): void {
  this.showAllParticipantIds.update(current => !current);
}

  // Switch Data 1 input method.
setData1InputMode(mode: InputMode): void {

  this.resetProcessing();

  this.data1InputMode.set(mode);
  this.data1.set([]);
  this.data1Loaded.set(false);
  this.data1Error.set('');
  this.data1FileName.set('');
}

// Switch Data 2 input method.
setData2InputMode(mode: InputMode): void {

  this.resetProcessing();

  this.data2InputMode.set(mode);
  this.data2.set([]);
  this.data2Loaded.set(false);
  this.data2Error.set('');
  this.data2FileName.set('');
}

// Process directly pasted Data 1 JSON.
loadData1FromJson(): void {

  this.resetProcessing();

  this.data1Error.set('');
  this.data1Loaded.set(false);
  this.data1.set([]);
  this.data1FileName.set('');

  try {

    const text = this.data1JsonText().trim();

    if (!text) {
      throw new Error('Please enter Data 1 JSON.');
    }

    const parsedData: unknown = JSON.parse(text);

    const records = this.validateData1Data(parsedData);

    this.data1.set(records);
    this.data1FileName.set('Pasted JSON');
    this.data1Loaded.set(true);

  } catch (error) {

    this.data1Error.set(
      error instanceof Error ? error.message : 'Invalid Data 1 JSON.'
    );
  }
}

// Process directly pasted Data 2 JSON.
loadData2FromJson(): void {

  this.resetProcessing();

  this.data2Error.set('');
  this.data2Loaded.set(false);
  this.data2.set([]);
  this.data2FileName.set('');

  try {

    const text = this.data2JsonText().trim();

    if (!text) {
      throw new Error('Please enter Data 2 JSON.');
    }

    const parsedData: unknown = JSON.parse(text);

    const records = this.validateData2Data(parsedData);

    this.data2.set(records);
    this.data2FileName.set('Pasted JSON');
    this.data2Loaded.set(true);

  } catch (error) {

    this.data2Error.set(
      error instanceof Error ? error.message : 'Invalid Data 2 JSON.'
    );
  }
}

  // ================================
  // DUPLICATE DETECTION
  // ================================

  private findDuplicates<T>(
    records: T[],
    getValue: (record: T) => string
  ): DuplicateEntry[] {

    const frequencyMap = new Map<string, number>();

    // Count occurrences of each value.
    for (const record of records) {

      const value = getValue(record);

      frequencyMap.set(
        value,
        (frequencyMap.get(value) ?? 0) + 1
      );
    }

    // Return values appearing more than once.
    return Array.from(frequencyMap.entries())
      .filter(([_, count]) => count > 1)
      .map(([value, count]) => ({
        value,
        count
      }));
  }

  // ================================
  // PROCESS FILES
  // ================================

  processFiles(): void {

    if (!this.data1Loaded() || !this.data2Loaded()) {
      return;
    }

    // Create lookup Map from Data 1.
    const caseMap = new Map<string, string>();

    for (const record of this.data1()) {
      caseMap.set(record.displayId, record.id);
    }

    // Transform Data 2.
    const records: ProcessedRecord[] = this.data2().map(participant => {

      const originalCaseId = participant.caseId;

      const convertedCaseId =
        caseMap.get(originalCaseId) ?? 'BLANK';

      return {
        participantId: participant.participantId,
        originalCaseId,
        convertedCaseId,

        status: caseMap.has(originalCaseId)
          ? 'MATCHED'
          : 'UNMATCHED',

        originalRecord: { ...participant }
      };
    });

    // Calculate matched records.
    const matchedRecords = records.filter(
      record => record.status === 'MATCHED'
    ).length;

    const unmatchedRecords = records.length - matchedRecords;

    const totalRecords = records.length;

    const matchingPercentage = totalRecords === 0
      ? 0
      : Number(((matchedRecords / totalRecords) * 100).toFixed(2));

    // Detect duplicates in both datasets.
    const duplicateSummary: DuplicateSummary = {

      duplicateDisplayIds: this.findDuplicates(
        this.data1(),
        record => record.displayId
      ),

      duplicateCaseIds: this.findDuplicates(
        this.data2(),
        record => record.caseId
      ),

      duplicateParticipantIds: this.findDuplicates(
        this.data2(),
        record => record.participantId
      )

    };

    // Store complete processing result.
    this.currentPage.set(1);
    this.showAllDisplayIds.set(false);
    this.showAllCaseIds.set(false);
    this.showAllParticipantIds.set(false);

    this.processingResult.set({

      records,
      totalRecords,
      matchedRecords,
      unmatchedRecords,
      matchingPercentage,
      duplicateSummary

    });

    console.log('SniX Processing Result:', this.processingResult());
  }

  // ================================
  // CSV EXPORT
  // ================================

  private exportCsv(
    records: ProcessedRecord[],
    fileName: string
  ): void {

    if (records.length === 0) return;

    // Preserve original fields and replace caseId.
    const exportRecords: Record<string, unknown>[] = records.map(record => ({
      ...record.originalRecord,
      caseId: record.convertedCaseId
    }));

    // Collect dynamic headers.
    const headers = [
      ...new Set(
        exportRecords.flatMap(record => Object.keys(record))
      )
    ];

    // Escape CSV values.
    const escapeValue = (value: unknown): string => {

      if (value === null || value === undefined) {
        return '';
      }

      const stringValue =
        typeof value === 'object'
          ? JSON.stringify(value)
          : String(value);

      if (/[",\r\n]/.test(stringValue)) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }

      return stringValue;
    };

    const rows = [

      headers.map(escapeValue).join(','),

      ...exportRecords.map(record =>
        headers.map(header =>
          escapeValue(record[header])
        ).join(',')
      )

    ];

    const csvContent = '\uFEFF' + rows.join('\r\n');

    const blob = new Blob(
      [csvContent],
      { type: 'text/csv;charset=utf-8;' }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = url;
    link.download = fileName;
    link.click();

    URL.revokeObjectURL(url);
  }

  // ================================
  // EXPORT ALL RECORDS
  // ================================

  exportAll(): void {

    const result = this.processingResult();

    if (!result) return;

    this.exportCsv(
      result.records,
      'snix-all-records.csv'
    );
  }

  // ================================
  // EXPORT MATCHED RECORDS
  // ================================

  exportMatched(): void {

    const records = this.processingResult()?.records.filter(
      record => record.status === 'MATCHED'
    ) ?? [];

    this.exportCsv(
      records,
      'snix-matched-records.csv'
    );
  }

  // ================================
  // EXPORT UNMATCHED RECORDS
  // ================================

  exportUnmatched(): void {

    const records = this.processingResult()?.records.filter(
      record => record.status === 'UNMATCHED'
    ) ?? [];

    this.exportCsv(
      records,
      'snix-unmatched-records.csv'
    );
  }
}
