
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface ClientRecord {
  '5': string;
  '7': string;
  '95': string;
  [key: string]: unknown;
}

interface MongoRecord {
  id: string;
  applicantDate: string;
  participantId: string;
  [key: string]: unknown;
}

interface MergedRecord {
  de95: string;
  caseId: string;
}

@Component({
  selector: 'app-client-mongo-matcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-mongo-matcher.component.html',
  styleUrls: ['./client-mongo-matcher.component.css'],
})
export class ClientMongoMatcherComponent {
  clientData: ClientRecord[] = [];
  mongoData: MongoRecord[] = [];

  clientFileName = '';
  mongoFileName = '';
  clientError = '';
  mongoError = '';

  result: MergedRecord[] = [];
  hasProcessed = false;
  searchTerm = '';

  get matchedCount(): number {
    return this.result.filter((record) => record.caseId !== '').length;
  }

  get unmatchedCount(): number {
    return this.result.length - this.matchedCount;
  }

  get filteredResults(): MergedRecord[] {
    const search = this.searchTerm.trim().toLowerCase();

    if (!search) return this.result;

    return this.result.filter(
      (record) =>
        record.caseId.toLowerCase().includes(search) ||
        record.de95.toLowerCase().includes(search),
    );
  }

  get canProcess(): boolean {
    return (
      this.clientData.length > 0 &&
      this.mongoData.length > 0 &&
      !this.clientError &&
      !this.mongoError
    );
  }

  async onClientFileSelected(event: Event): Promise<void> {
    const file = this.getSelectedFile(event);
    if (!file) return;

    this.clientError = '';
    this.resetResult();

    try {
      const parsed: unknown = JSON.parse(await file.text());

      this.clientData = this.validateClientData(parsed);
      this.clientFileName = file.name;
    } catch (error) {
      this.clientData = [];
      this.clientFileName = '';

      this.clientError = this.errorMessage(
        error,
        'Unable to read the client JSON file.',
      );
    }
  }

  async onMongoFileSelected(event: Event): Promise<void> {
    const file = this.getSelectedFile(event);
    if (!file) return;

    this.mongoError = '';
    this.resetResult();

    try {
      const parsed: unknown = JSON.parse(await file.text());

      this.mongoData = this.validateMongoData(parsed);
      this.mongoFileName = file.name;
    } catch (error) {
      this.mongoData = [];
      this.mongoFileName = '';

      this.mongoError = this.errorMessage(
        error,
        'Unable to read the Mongo JSON file.',
      );
    }
  }

  clearClientFile(): void {
    this.clientData = [];
    this.clientFileName = '';
    this.clientError = '';
    this.resetResult();
  }

  clearMongoFile(): void {
    this.mongoData = [];
    this.mongoFileName = '';
    this.mongoError = '';
    this.resetResult();
  }

  processData(): void {
    if (!this.canProcess) return;

    this.result = this.mergeClientWithMongo(
      this.clientData,
      this.mongoData,
    );

    this.hasProcessed = true;
    this.searchTerm = '';
  }

  private mergeClientWithMongo(
    clientData: ClientRecord[],
    mongoData: MongoRecord[],
  ): MergedRecord[] {
    return clientData.map((client) => {
      // Convert client field "7" from YYYYMMDD to YYYY-MM-DD.
      const clientDate =
        client['7'].slice(0, 4) +
        '-' +
        client['7'].slice(4, 6) +
        '-' +
        client['7'].slice(6, 8);

      // Convert client field "95" for the output.
      const formatted95 =
        client['95'].slice(0, 4) +
        '-' +
        client['95'].slice(4, 6) +
        '-' +
        client['95'].slice(6, 8);

      // Match using participantId and applicantDate.
      const match = mongoData.find((mongo) => {
        const mongoDate = new Date(mongo.applicantDate)
          .toISOString()
          .slice(0, 10);

        return (
          mongo.participantId === client['5'] &&
          mongoDate === clientDate
        );
      });

      return {
        de95: formatted95,
        caseId: match ? match.id : '',
      };
    });
  }

  downloadJson(): void {
    if (!this.result.length) return;

    const json = JSON.stringify(this.result, null, 2);

    const blob = new Blob([json], {
      type: 'application/json;charset=utf-8',
    });

    this.downloadBlob(blob, 'client-mongo-matched.json');
  }

  private validateClientData(value: unknown): ClientRecord[] {
    if (!Array.isArray(value)) {
      throw new Error(
        'Client JSON must have an array as its root value.',
      );
    }

    if (value.length === 0) {
      throw new Error('Client JSON contains no records.');
    }

    value.forEach((record: unknown, index: number) => {
      if (!this.isObject(record)) {
        throw new Error(
          `Client record ${index + 1} must be a JSON object.`,
        );
      }

     for (const field of ['5', '7', '95']) {
  const fieldValue = record[field];

  if (
    typeof fieldValue !== 'string' ||
    fieldValue.length === 0
  ) {
    throw new Error(
      `Client record ${index + 1} is missing required string field "${field}".`,
    );
  }
}

      if (!/^\d{8}$/.test(record['7'] as string)) {
        throw new Error(
          `Client record ${index + 1}: field "7" must use YYYYMMDD format.`,
        );
      }

      if (!/^\d{8}$/.test(record['95'] as string)) {
        throw new Error(
          `Client record ${index + 1}: field "95" must use YYYYMMDD format.`,
        );
      }
    });

    return value as ClientRecord[];
  }

 private validateMongoData(value: unknown): MongoRecord[] {
  if (!Array.isArray(value)) {
    throw new Error(
      'Mongo JSON must have an array as its root value.',
    );
  }

  if (value.length === 0) {
    throw new Error('Mongo JSON contains no records.');
  }

  value.forEach((record: unknown, index: number) => {
    if (!this.isObject(record)) {
      throw new Error(
        `Mongo record ${index + 1} must be a JSON object.`,
      );
    }

    const requiredFields = [
      'id',
      'participantId',
      'applicantDate',
    ];

    for (const field of requiredFields) {
      const fieldValue: unknown = record[field];

      if (
        typeof fieldValue !== 'string' ||
        fieldValue.length === 0
      ) {
        throw new Error(
          `Mongo record ${index + 1} is missing required string field "${field}".`,
        );
      }
    }

    const applicantDate = record['applicantDate'];

    if (
      typeof applicantDate !== 'string' ||
      Number.isNaN(new Date(applicantDate).getTime())
    ) {
      throw new Error(
        `Mongo record ${index + 1} has an invalid applicantDate.`,
      );
    }
  });

  return value as MongoRecord[];
}

  private isObject(
    value: unknown,
  ): value is Record<string, unknown> {
    return (
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value)
    );
  }

  private getSelectedFile(event: Event): File | null {
    const input = event.target as HTMLInputElement;
    return input.files?.[0] ?? null;
  }

  private errorMessage(error: unknown, fallback: string): string {
    return error instanceof Error ? error.message : fallback;
  }

  private resetResult(): void {
    this.result = [];
    this.hasProcessed = false;
    this.searchTerm = '';
  }

  private downloadBlob(blob: Blob, fileName: string): void {
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();

    URL.revokeObjectURL(url);
  }
}
