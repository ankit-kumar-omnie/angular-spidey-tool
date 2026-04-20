# Angular Spidey Tool

Angular 17+ standalone equivalent of the React Spidey Tool.

## Setup

```bash
cd angular-spidey-tool
npm install
npm start
```

Runs on http://localhost:4200

## Features
- Tool switcher dropdown (Report 911 SPIDEY Tool / Copy DataCollection To Record Tool)
- Shared token auth — auto-derives base URL from JWT env (Test/Staging/Production)
- Report 911: Copy Record, Un-Report, Activation/Deactivation, Data Lookup, Tool Results
- Record Copy: Copy DataCollection to Record (with task-based cascading dropdowns), Record Lookup, Tool Results
- Auto-fetch result after POST with per-card refresh button
- Fully responsive
