# Informedˢᵐ-Libera Tools — Technical Documentation

**Version:** 1.0  
**Stack:** Angular 17 · TypeScript · Plain CSS (dark-mode aware)  
**Last Updated:** April 2026

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Frontend Architecture](#2-frontend-architecture)
   - 2.1 [Folder Structure](#21-folder-structure)
   - 2.2 [Design System](#22-design-system)
   - 2.3 [Theme (Light / Dark Mode)](#23-theme-light--dark-mode)
   - 2.4 [Components](#24-components)
   - 2.5 [Services](#25-services)
3. [Backend API Reference](#3-backend-api-reference)
   - 3.1 [Authentication](#31-authentication)
   - 3.2 [Base URL Resolution](#32-base-url-resolution)
   - 3.3 [Report 911 Endpoints](#33-report-911-endpoints)
   - 3.4 [Record Copy Endpoints](#34-record-copy-endpoints)
4. [Data Models](#4-data-models)
5. [User Flows](#5-user-flows)
6. [Error Handling](#6-error-handling)
7. [Local Development](#7-local-development)

---

## 1. Project Overview

**Informedˢᵐ-Libera Tools** is an internal Angular web application used by Super Admins to perform bulk data operations against the Informed platform API. It provides two primary tools:

| Tool | Purpose |
|---|---|
| **Report 911 SPIDEY Tool** | Copy record values to Report 911, un-report DE elements, and manage case activation/deactivation |
| **Record SPIDEY Tool** | Copy DataCollection values to records, look up record data, and query operation results |

Access is controlled via a JWT Bearer token that is decoded client-side to determine the environment (Test / Staging / Production), tenant, and user identity. No login screen exists — the token is pasted manually.

---

## 2. Frontend Architecture

### 2.1 Folder Structure

```
src/
├── app/
│   ├── components/
│   │   ├── auth-token/          # Token input modal + auth status indicator
│   │   ├── copy-result-card/    # Result card for Record Copy operations
│   │   ├── loader/              # Full-screen spinner overlay
│   │   ├── record-copy-form/    # Form for Record Copy tool (3 tabs)
│   │   ├── record-copy-results/ # Filter + results list for Record Copy
│   │   ├── report911-form/      # Form for Report 911 tool (5 tabs)
│   │   ├── report911-results/   # Filter + results list for Report 911
│   │   ├── result-card/         # Result card for Report 911 operations
│   │   └── snackbar/            # Toast notification stack
│   ├── data/
│   │   ├── de-names.ts          # Static fallback list of DE element names
│   │   └── record-config-lookup.ts  # Static fallback config/section/element mapping
│   └── services/
│       ├── auth.service.ts      # Token storage, JWT decoding, base URL resolution
│       ├── loader.service.ts    # Global loading state signal
│       ├── record-copy.service.ts  # HTTP calls for Record Copy API
│       ├── report911.service.ts    # HTTP calls for Report 911 API
│       ├── snackbar.service.ts  # Toast notification queue
│       └── theme.service.ts     # Light/dark mode persistence
├── styles.css                   # Global CSS variables + reset
└── index.html
```

### 2.2 Design System

All design tokens are defined as CSS custom properties in `src/styles.css` under `:root` and `[data-theme='dark']`. Components reference these variables — no hardcoded colors exist in component styles.

#### Color Tokens

| Token | Light Value | Dark Value | Usage |
|---|---|---|---|
| `--bg-primary` | `#f5f7fb` | `#0f172a` | Page background |
| `--bg-secondary` | `#ffffff` | `#1e293b` | Cards, modals, inputs |
| `--text-primary` | `#1a1f36` | `#e2e8f0` | Headings, labels |
| `--text-secondary` | `#6b7280` | `#94a3b8` | Subtext, placeholders |
| `--border-color` | `#e5e7eb` | `#334155` | Borders, dividers |
| `--accent` | `#5b5bd6` | `#818cf8` | Buttons, active tabs, focus rings |
| `--accent-hover` | `#4f46e5` | `#a5b4fc` | Button hover |
| `--focus-ring` | `rgba(91,91,214,0.22)` | `rgba(129,140,248,0.28)` | Input focus shadow |

#### Status Tokens (both themes)

| Token Group | Variants |
|---|---|
| `--status-success-*` | `-bg`, `-border`, `-text` |
| `--status-warning-*` | `-bg`, `-border`, `-text` |
| `--status-error-*` | `-bg`, `-border`, `-text` |
| `--status-info-*` | `-bg`, `-border`, `-text` |

Dark mode status tokens use semi-transparent backgrounds (`rgba`) to avoid harsh contrast on dark surfaces.

#### Typography

- **Font:** Inter (loaded from Google Fonts), fallback to Segoe UI / system-ui
- **Base size:** 16px root, component text uses `rem` units
- **Line height:** 1.5 (body), 1.25 (tight headings)

#### Spacing

Components use a consistent spacing scale: `4px · 8px · 12px · 16px · 20px · 24px · 32px · 40px`

### 2.3 Theme (Light / Dark Mode)

Managed by `ThemeService`. The current theme is stored in `localStorage` under the key `spidey-theme`. On first load, the service checks `prefers-color-scheme` to match the OS preference.

Toggling applies `data-theme="dark"` or `data-theme="light"` to `<html>`, which activates the corresponding CSS variable block. The toggle button is in the app header (sun/moon SVG icon).

### 2.4 Components

#### `AppComponent`

Root component. Owns:
- Active tool state (`report911` | `recordCopy`)
- Tool menu open/close
- Submission result signals for both tools
- Calls `LoaderService` and `SnackbarService` around all API responses

#### `AuthTokenComponent`

Displays an auth status dot (green = authorized, red = unauthorized) and two buttons:
- **Set Token / Update Token** — opens a modal with a textarea for pasting a JWT
- **Clear Token** — emits an empty string, triggering an info snackbar

Emits `tokenSave: EventEmitter<string>` to the parent.

#### `Report911FormComponent`

Five-tab form:

| Tab | Purpose |
|---|---|
| Copy Record | Copy DE element values to Report 911 for selected cases |
| Un-Report | Remove DE element values from Report 911 |
| Activation / Deactivation | Activate or deactivate cases in Report 911 |
| Data Lookup | Fetch current Report 911 data for a single case |
| Tool Result | Search and view past operation results |

DE Name selection supports up to 3 simultaneous selections via a custom checkbox dropdown with live search.

Case IDs accept one per line or comma-separated. Surrounding quotes (`"` or `'`) are automatically stripped.

#### `RecordCopyFormComponent`

Three-tab form:

| Tab | Purpose |
|---|---|
| Copy DataCollection Value | Copy a DataCollection element value to a Record for selected cases |
| Record Lookup | Fetch current record data for a single case |
| Tool Results | Search and view past copy operation results |

Config, Section, and Element dropdowns are dynamically populated from the API (with a static fallback from `record-config-lookup.ts`). Available sections and elements cascade based on the selected config and section.

#### `ResultCardComponent` / `CopyResultCardComponent`

Display a single operation result. Show:
- Status badge (InProgress / Completed / Failed / Ready)
- Operation metadata (ID, Config, Section, Element, Created By, Date)
- Three case lists: Success · Skipped (with reason) · Errors
- Refresh button — re-fetches the result by ID

#### `LoaderComponent`

Full-screen overlay with a three-ring concentric spinner. Activated globally via `LoaderService`. Appears during all API fetch operations initiated from `AppComponent`.

#### `SnackbarComponent`

Renders a stack of toast notifications in the bottom-right corner. Each toast:
- Slides in with a spring animation
- Shows a color-coded icon (✓ / ✕ / ⚠ / ℹ)
- Has an animated progress bar counting down 5 seconds
- Can be manually dismissed with the ✕ button
- Stacks up to any number of simultaneous messages

### 2.5 Services

#### `AuthService`

| Method | Description |
|---|---|
| `setToken(token)` | Stores token in `localStorage`, derives and sets base URL from JWT audience |
| `clearToken()` | Alias for `setToken('')` |
| `getAuthHeaders()` | Returns `{ Content-Type, Authorization: Bearer <token> }` |
| `decodeTenant(token)` | Extracts `active-tenant` claim from JWT payload |
| `decodeEnv(token)` | Returns `'Test'`, `'Staging'`, or `'Production'` from JWT `aud` claim |
| `decodeUserName(token)` | Extracts display name from `given_name`/`family_name`, `name`, `preferred_username`, or `sub` |
| `decodeRole(token)` | Returns `'Super Admin'` if `role` claim is a string |

Token and base URL are persisted in `localStorage` across sessions.

#### `ThemeService`

| Method | Description |
|---|---|
| `initTheme()` | Called on app init — reads saved preference or OS preference |
| `toggleTheme()` | Switches between light and dark |

Exposes `theme` signal (`'light' | 'dark'`) for template binding.

#### `LoaderService`

| Method | Description |
|---|---|
| `show()` | Sets `loading` signal to `true` |
| `hide()` | Sets `loading` signal to `false` |

Exposes `loading` signal consumed by `LoaderComponent`.

#### `SnackbarService`

| Method | Description |
|---|---|
| `success(message)` | Shows a green success toast |
| `error(message)` | Shows a red error toast |
| `warning(message)` | Shows an amber warning toast |
| `info(message)` | Shows a blue info toast |
| `dismiss(id)` | Removes a specific toast by ID |

All toasts auto-dismiss after **5000 ms**. Exposes `snacks` signal consumed by `SnackbarComponent`.

#### `Report911Service`

HTTP client wrapper for all Report 911 API calls. See Section 3.3.

#### `RecordCopyService`

HTTP client wrapper for all Record Copy API calls. See Section 3.4.

---

## 3. Backend API Reference

### 3.1 Authentication

All API requests require a JWT Bearer token in the `Authorization` header.

```
Authorization: Bearer <JWT>
Content-Type: application/json
```

The token is decoded client-side to extract:
- **Environment** (from `aud` claim) — determines which base URL to use
- **Tenant** (from `active-tenant` claim)
- **User identity** (from `given_name`, `family_name`, `name`, `preferred_username`, or `sub`)

### 3.2 Base URL Resolution

The base URL is automatically derived from the JWT `aud` claim:

| Environment | Base URL |
|---|---|
| Test | `https://test-api.informed.cloud/api` |
| Staging | `https://staging-api.informed.cloud/api` |
| Production | `https://api.informed.cloud/api` |

If the environment cannot be determined, the previously stored base URL is used, defaulting to Test.

---

### 3.3 Report 911 Endpoints

#### GET `/reports/regulatory/report911-elements`

Fetches the list of available DE element names.

**Response:** `string[]`

```json
["ElementA", "ElementB", "ElementC"]
```

---

#### POST `/reports/regulatory/copy-record-value-to-report911`

Copies a record value to Report 911 for the specified cases.

**Query Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `deName` | string | Yes | Comma-separated DE element name(s) |
| `programYear` | number | Yes | e.g. `2025` |
| `quarter` | string | Yes | `Q1` · `Q2` · `Q3` · `Q4` |
| `policyVersion` | string | Yes | e.g. `23-01` |
| `effectiveDate` | string | No | ISO date string |

**Request Body:** `string[]` — array of case IDs

```json
["C000001234", "C000005678"]
```

**Response:** `CommandResult[]`

```json
[
  { "message": "Job queued", "id": "9df1409b-a30e-42a5-a4bd-e9787981b70d" }
]
```

---

#### POST `/reports/regulatory/unReport-deElement-report911`

Removes DE element values from Report 911 for the specified cases.

**Query Parameters:** Same as Copy Record (no `effectiveDate`)

**Request Body:** `string[]` — array of case IDs

**Response:** `CommandResult[]`

---

#### POST `/reports/regulatory/report911-case-activation-deactivation`

Activates or deactivates cases in Report 911.

**Query Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `programYear` | number | Yes | e.g. `2025` |
| `quarter` | string | Yes | `Q1` · `Q2` · `Q3` · `Q4` |
| `policyVersion` | string | Yes | e.g. `23-01` |
| `isActive` | string | Yes | `"true"` to activate, `"false"` to deactivate |

**Request Body:** `string[]` — array of case IDs

**Response:** `CommandResult`

```json
{ "message": "Activation job queued", "id": "abc123..." }
```

---

#### GET `/reports/regulatory/tool-result`

Fetches past Report 911 operation results.

**Query Parameters (all optional):**

| Parameter | Type | Description |
|---|---|---|
| `id` | string | Filter by aggregate/job ID |
| `deName` | string | Filter by DE element name |
| `status` | string | `InProgress` · `Completed` · `Failed` · `Ready` |
| `unReport` | boolean | Filter by un-report flag |
| `activation` | string | Filter by activation value |
| `page` | number | Page number |
| `limit` | number | Results per page |

**Response:** `ResultRecord[]`

```json
[
  {
    "id": "9df1409b-...",
    "de": "ElementA",
    "status": "Completed",
    "unReport": false,
    "successCases": ["C000001234"],
    "skippedCases": [{ "caseId": "C000005678", "reason": "Already reported" }],
    "errorCases": [],
    "createdAt": "2025-04-21T10:30:00Z",
    "updatedAt": "2025-04-21T10:31:00Z",
    "createdBy": { "name": "John Smith" }
  }
]
```

---

#### GET `/reports/regulatory/report911-data`

Fetches current Report 911 data for a single case.

**Query Parameters:**

| Parameter | Type | Required |
|---|---|---|
| `caseId` | string | Yes |
| `deName` | string | Yes |
| `programYear` | number | Yes |
| `quarter` | string | Yes |
| `policyVersion` | string | Yes |

**Response:** Arbitrary object or array depending on the DE element.

---

### 3.4 Record Copy Endpoints

#### GET `/records-mapping`

Fetches the config/section/element hierarchy for a given program.

**Query Parameters:**

| Parameter | Type | Required |
|---|---|---|
| `program` | string | Yes | `VR` · `ER` · `IL` · `ILOB` |

**Response:** `ConfigEntry[]`

```json
[
  {
    "config": { "configId": "cfg-001", "configLabel": "VR Config" },
    "sections": [
      {
        "section": { "sectionId": "sec-001", "sectionLabel": "Employment" },
        "elements": [
          { "elementId": "el-001", "elementLabel": "Employer Name" }
        ]
      }
    ]
  }
]
```

---

#### POST `/records/copy-dataCollection-to-record`

Copies a DataCollection element value to a Record for the specified cases.

**Query Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `configId` | string | Yes | Target config ID |
| `program` | string | Yes | `VR` · `ER` · `IL` · `ILOB` |
| `task` | string | Yes | See task types below |
| `sectionId` | string | Conditional | Required for section/element tasks |
| `elementId` | string | Conditional | Required for element tasks |
| `effectiveDate` | string | No | ISO date string |

**Task Types:**

| Task | Requires Section | Requires Element |
|---|---|---|
| `UpdateElement` | Yes | Yes |
| `CreateElement` | Yes | Yes |
| `Re-CreateElementHistory` | Yes | Yes |
| `CreateSection` | Yes | No |
| `CreateRecord` | No | No |

**Request Body:** `string[]` — array of case IDs

**Response:** `CopyCommandResult`

```json
{ "message": "Copy job queued", "id": "7fa2309c-..." }
```

---

#### GET `/result-copy-dataCollection-to-record`

Fetches past Record Copy operation results.

**Query Parameters (all optional):**

| Parameter | Type | Description |
|---|---|---|
| `id` | string | Filter by job ID |
| `status` | string | `InProgress` · `Completed` · `Failed` · `Ready` |
| `configId` | string | Filter by config |
| `sectionId` | string | Filter by section |
| `elementId` | string | Filter by element |
| `program` | string | Filter by program |
| `task` | string | Filter by task type |

**Response:** `CopyResultRecord[]`

```json
[
  {
    "id": "7fa2309c-...",
    "configId": "cfg-001",
    "sectionId": "sec-001",
    "elementId": "el-001",
    "program": "VR",
    "task": "UpdateElement",
    "status": "Completed",
    "successCases": ["C000001234"],
    "skippedCases": [],
    "errorCases": [],
    "createdAt": "2025-04-21T11:00:00Z",
    "updatedAt": "2025-04-21T11:01:00Z",
    "createdBy": { "name": "Jane Doe" }
  }
]
```

---

#### GET `/record-data`

Fetches current record data for a single case.

**Query Parameters:**

| Parameter | Type | Required |
|---|---|---|
| `caseId` | string | Yes |
| `configId` | string | Yes |
| `sectionId` | string | Yes |
| `elementId` | string | Yes |

**Response:** `RecordDataResult[]`

---

## 4. Data Models

### `CommandResult`
```typescript
{ message: string; id: string; }
```

### `ResultRecord` (Report 911)
```typescript
{
  id: string;
  de: string;
  status: 'InProgress' | 'Completed' | 'Failed' | 'Ready';
  unReport: boolean;
  activation?: string;
  successCases: string[];
  skippedCases: { caseId: string; reason: string }[];
  errorCases: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: { name: string };
}
```

### `CopyResultRecord` (Record Copy)
```typescript
{
  id: string;
  configId: string;
  sectionId: string;
  elementId: string;
  program: string;
  task: string;
  status: 'InProgress' | 'Completed' | 'Failed' | 'Ready';
  successCases: string[];
  skippedCases: { caseId: string; reason: string }[];
  errorCases: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: { name: string };
}
```

### `ConfigEntry` (Record Copy mapping)
```typescript
{
  config: { configId: string; configLabel: string };
  sections: {
    section: { sectionId: string; sectionLabel: string };
    elements: { elementId: string; elementLabel: string }[];
  }[];
}
```

---

## 5. User Flows

### Flow 1 — Set Authorization Token

1. Click **Set Token** in the header
2. Paste a valid JWT into the textarea
3. Click **Save & Authorize**
4. The app decodes the token, sets the base URL, and shows a green snackbar
5. The auth dot turns green and the user's name appears in the header

### Flow 2 — Copy Record to Report 911

1. Select the **Report 911 SPIDEY Tool** from the tool switcher
2. On the **Copy Record** tab, select up to 3 DE Names
3. Set Program Year, Quarter, and Policy Version
4. Optionally set an Effective Date
5. Enter one or more Case IDs (one per line or comma-separated; quotes are stripped automatically)
6. Click **Copy to Report 911**
7. A spinner appears while the job is queued
8. On success, a green snackbar confirms submission and the result card appears showing the job status

### Flow 3 — Copy DataCollection Value to Record

1. Select the **Record SPIDEY Tool** from the tool switcher
2. On the **Copy DataCollection Value** tab, select Program and Task
3. Select Config (loaded from API, falls back to static data)
4. Select Section and Element if required by the task
5. Optionally set an Effective Date
6. Enter Case IDs
7. Click **Copy to Record**
8. Spinner shows, then result card appears with success/skipped/error case counts

### Flow 4 — View Tool Results

1. Navigate to the **Tool Results** tab in either tool
2. Use the filter fields (ID, Config, Status, Program, Task, etc.) to narrow results
3. Click **Search**
4. Result cards appear, newest first
5. Click the **↻** refresh button on any card to re-fetch its latest status

### Flow 5 — Data Lookup

1. Navigate to the **Data Lookup** / **Record Lookup** tab
2. Enter a Case ID (quotes stripped automatically)
3. Select the relevant DE Name / Config / Section / Element
4. Click **Fetch Data**
5. Results display in a key-value table

---

## 6. Error Handling

| Scenario | Behavior |
|---|---|
| API call fails | Red error snackbar with the error message from the response |
| Token not set | API calls will fail with 401; user sees error snackbar |
| No case IDs entered | Form validation prevents submission with inline error message |
| No DE Name selected (Report 911) | Form validation prevents submission |
| Config mapping API fails | Falls back to static `record-config-lookup.ts` data |
| DE elements API fails | Falls back to static `de-names.ts` list |

All errors surface via the `SnackbarService` with a 5-second auto-dismiss timer. The loader is always hidden on both success and error paths.

---

## 7. Local Development

### Prerequisites

- Node.js 18+
- Angular CLI 17+

### Install & Run

```bash
npm install
npm start
# App runs at http://localhost:4200
```

### Build for Production

```bash
npm run build
# Output in dist/angular-spidey-tool/
```

### Key Configuration Files

| File | Purpose |
|---|---|
| `angular.json` | Angular workspace config, style preprocessor options |
| `src/styles.css` | Global CSS variables and reset |
| `src/app/services/auth.service.ts` | Environment URL map — update if API URLs change |
| `src/app/data/de-names.ts` | Static DE name fallback list |
| `src/app/data/record-config-lookup.ts` | Static config/section/element fallback |

### Adding a New Environment

In `auth.service.ts`, add an entry to `ENV_URL_MAP`:

```typescript
const ENV_URL_MAP: Record<string, string> = {
  Test:       'https://test-api.informed.cloud/api',
  Staging:    'https://staging-api.informed.cloud/api',
  Production: 'https://api.informed.cloud/api',
  // Add new environment here
};
```

Then update `decodeEnv()` to detect the new audience string from the JWT.

---

*End of Documentation*
