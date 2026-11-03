
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-json-merge',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './json-merge.component.html',
  styleUrls: ['./json-merge.component.css'],
})
export class JsonMergeComponent {
  inputJson = '';
  finalJson = '';
  mergedJson = '';

  availableKeys: string[] = [];
  selectedKeys = new Set<string>();

  errorMessage = '';
  successMessage = '';
  isMerged = false;

  // Load UUID keys from the input object
  loadKeys(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.isMerged = false;
    this.mergedJson = '';

    try {
      const inputObject = this.parseJsonObject(
        this.inputJson,
        'Input Object'
      );

      this.availableKeys = Object.keys(inputObject);
      this.selectedKeys.clear();

      if (this.availableKeys.length === 0) {
        this.errorMessage = 'No keys found in the Input Object.';
        return;
      }

      this.successMessage =
        `${this.availableKeys.length} keys loaded successfully.`;

    } catch (error) {
      this.errorMessage = this.getErrorMessage(error);
      this.availableKeys = [];
      this.selectedKeys.clear();
    }
  }

  // Select or deselect an individual key
  toggleKey(key: string, checked: boolean): void {
    if (checked) {
      this.selectedKeys.add(key);
    } else {
      this.selectedKeys.delete(key);
    }
  }

  // Select all available keys
  selectAll(): void {
    this.selectedKeys = new Set(this.availableKeys);
  }

  // Deselect all keys
  clearSelection(): void {
    this.selectedKeys.clear();
  }

  // Main merge operation
  merge(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.mergedJson = '';
    this.isMerged = false;

    try {
      if (this.selectedKeys.size === 0) {
        throw new Error('Please select at least one UUID key.');
      }

      const inputObject = this.parseJsonObject(
        this.inputJson,
        'Input Object'
      );

      const finalObject = this.parseJsonObject(
        this.finalJson,
        'Final Object'
      );

      const keysToInclude = Array.from(this.selectedKeys);

      const mergedObject = this.mergeObjects(
        inputObject,
        finalObject,
        keysToInclude
      );

      this.mergedJson = JSON.stringify(mergedObject, null, 2);
      this.isMerged = true;

      this.successMessage = 'Objects merged successfully!';

    } catch (error) {
      this.errorMessage = this.getErrorMessage(error);
    }
  }

  // Your original mergeObjects function.
  // Its merge logic has not been changed.
  mergeObjects(
    inputObj: any,
    finalObj: any,
    keysToInclude: string[] = []
  ): any {
    function mergeDeep(input: any, target: any): void {
      for (const key of keysToInclude) {
        if (key in input) {
          if (
            typeof input[key] === 'object' &&
            input[key] !== null &&
            !Array.isArray(input[key])
          ) {
            if (!(key in target)) {
              target[key] = JSON.parse(
                JSON.stringify(input[key])
              );
            } else {
              mergeDeep(input[key], target[key]);
            }
          } else if (!(key in target)) {
            target[key] = input[key];
          }
        }
      }
    }

    mergeDeep(inputObj, finalObj);
    return finalObj;
  }

  // Validate JSON and ensure the root is an object
  private parseJsonObject(
    json: string,
    label: string
  ): Record<string, any> {
    if (!json.trim()) {
      throw new Error(`${label} cannot be empty.`);
    }

    let parsed: any;

    try {
      parsed = JSON.parse(json);
    } catch {
      throw new Error(`${label} contains invalid JSON.`);
    }

    if (
      parsed === null ||
      typeof parsed !== 'object' ||
      Array.isArray(parsed)
    ) {
      throw new Error(
        `${label} must contain a valid JSON object.`
      );
    }

    return parsed;
  }

  // Upload a JSON file into either text area
  async onFileSelected(
    event: Event,
    target: 'input' | 'final'
  ): Promise<void> {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (!file) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.isMerged = false;
    this.mergedJson = '';

    if (!file.name.toLowerCase().endsWith('.json')) {
      this.errorMessage = 'Please upload a .json file.';
      fileInput.value = '';
      return;
    }

    try {
      const content = await file.text();

      if (target === 'input') {
        this.inputJson = content;
        this.availableKeys = [];
        this.selectedKeys.clear();
      } else {
        this.finalJson = content;
      }

      this.successMessage = `${file.name} loaded successfully.`;

    } catch {
      this.errorMessage = 'Unable to read the selected file.';
    }

    fileInput.value = '';
  }

  // Download merged JSON
  downloadJson(): void {
    if (!this.mergedJson) {
      return;
    }

    const blob = new Blob(
      [this.mergedJson],
      { type: 'application/json' }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'mergedObject.json';
    link.click();

    URL.revokeObjectURL(url);
  }

  // Copy merged JSON
  async copyJson(): Promise<void> {
    if (!this.mergedJson) {
      return;
    }

    try {
      await navigator.clipboard.writeText(this.mergedJson);
      this.successMessage = 'Merged JSON copied to clipboard!';
    } catch {
      this.errorMessage = 'Unable to copy JSON to clipboard.';
    }
  }

  // Reset the entire tool
  reset(): void {
    this.inputJson = '';
    this.finalJson = '';
    this.mergedJson = '';

    this.availableKeys = [];
    this.selectedKeys.clear();

    this.errorMessage = '';
    this.successMessage = '';
    this.isMerged = false;
  }

  private getErrorMessage(error: unknown): string {
    return error instanceof Error
      ? error.message
      : 'Something went wrong.';
  }
}
