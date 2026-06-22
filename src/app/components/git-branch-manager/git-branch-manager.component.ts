import { Component, signal, computed, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { SnackbarService } from "../../services/snackbar.service";
import { ThemeService } from "../../services/theme.service";

interface BranchEntry {
  sourceBranch: string;
  tenant: string;
  newBranch: string;
  selected: boolean;
}

@Component({
  selector: "app-git-branch-manager",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./git-branch-manager.component.html",
  styleUrls: ["./git-branch-manager.component.css"],
})
export class GitBranchManagerComponent {
  private snackbar = inject(SnackbarService);
  readonly theme = inject(ThemeService);

  // ── Form fields
  jiraTicket = signal("INFO-");
  branchSuffix = signal("changes-base");
  commitMessage = signal("chore: apply shared config changes");
  repoPath = signal(
    "~/Documents/workspace/informed-backend/tmp/informed-program-config",
  );
  sourceBranchesInput = signal("");
  applyMode = signal<"stash" | "cherry-pick">("stash");
  commitHash = signal("");

  // ── Branches
  branches = signal<BranchEntry[]>([]);

  // ── Output
  generatedScript = computed(() => this.buildScript());
  isRunning = signal(false);
  scriptOutput = signal("");
  scriptSuccess = signal(true);

  // ── Preset source branches
  presetBranches = [
    "release/vr-azrsa-20260601",
    "release/vr-wydvr-20260601",
    "release/vr-mibsbp-20260601",
    "release/vr-nyscb-20260601",
    "release/vr-dcrsa-20260601",
    "release/vr-riors-20260601",
    "release/vr-ivrs-20260601",
    "release/vr-ctbrs-20260601",
    "release/vr-ctbesb-20260601",
    "release/vr-cmsuite-20260601",
  ];

  addBranches(): void {
    const input = this.sourceBranchesInput().trim();
    if (!input) return;

    const lines = input
      .split(/[\n,]+/)
      .map((l) => l.trim())
      .filter(Boolean);
    const existing = new Set(this.branches().map((b) => b.sourceBranch));

    const newEntries: BranchEntry[] = lines
      .filter((branch) => !existing.has(branch))
      .map((sourceBranch) => ({
        sourceBranch,
        tenant: this.extractTenant(sourceBranch),
        newBranch: this.buildNewBranchName(sourceBranch),
        selected: true,
      }));

    this.branches.update((prev) => [...prev, ...newEntries]);
    this.sourceBranchesInput.set("");
  }

  addPreset(branch: string): void {
    const existing = new Set(this.branches().map((b) => b.sourceBranch));
    if (existing.has(branch)) return;

    this.branches.update((prev) => [
      ...prev,
      {
        sourceBranch: branch,
        tenant: this.extractTenant(branch),
        newBranch: this.buildNewBranchName(branch),
        selected: true,
      },
    ]);
  }

  addAllPresets(): void {
    this.presetBranches.forEach((b) => this.addPreset(b));
  }

  removeBranch(sourceBranch: string): void {
    this.branches.update((prev) =>
      prev.filter((b) => b.sourceBranch !== sourceBranch),
    );
  }

  toggleSelect(sourceBranch: string): void {
    this.branches.update((prev) =>
      prev.map((b) =>
        b.sourceBranch === sourceBranch ? { ...b, selected: !b.selected } : b,
      ),
    );
  }

  selectAll(): void {
    this.branches.update((prev) => prev.map((b) => ({ ...b, selected: true })));
  }

  deselectAll(): void {
    this.branches.update((prev) =>
      prev.map((b) => ({ ...b, selected: false })),
    );
  }

  refreshBranchNames(): void {
    this.branches.update((prev) =>
      prev.map((b) => ({
        ...b,
        newBranch: this.buildNewBranchName(b.sourceBranch),
      })),
    );
  }

  copyScript(): void {
    const script = this.generatedScript();
    if (!script) {
      this.snackbar.error("No script to copy. Add source branches first.");
      return;
    }
    navigator.clipboard
      .writeText(script)
      .then(() => this.snackbar.success("Script copied to clipboard."));
  }

  runScript(): void {
    const script = this.generatedScript();
    if (!script || this.isRunning()) return;

    this.isRunning.set(true);
    this.scriptOutput.set("");
    this.scriptSuccess.set(true);

    fetch("http://localhost:3333/api/run-script", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ script }),
    })
      .then((res) => res.json())
      .then((data) => {
        this.scriptOutput.set(
          data.stdout + (data.stderr ? "\n" + data.stderr : ""),
        );
        this.scriptSuccess.set(data.success);
        this.isRunning.set(false);
        if (data.success) {
          this.snackbar.success("Script executed successfully.");
        } else {
          this.snackbar.error("Script failed. Check output below.");
        }
      })
      .catch((err) => {
        this.scriptOutput.set(
          "Failed to connect to script runner.\nMake sure the server is running: node server.js",
        );
        this.scriptSuccess.set(false);
        this.isRunning.set(false);
        this.snackbar.error(
          "Cannot connect to script runner (localhost:3333).",
        );
      });
  }

  getPresetLabel(branch: string): string {
    return this.extractTenant(branch);
  }

  private extractTenant(branch: string): string {
    // release/vr-azrsa-20260601 -> azrsa
    const match = branch.match(/vr-([a-zA-Z]+)-/);
    return match ? match[1] : (branch.split("/").pop() ?? "");
  }

  private buildNewBranchName(sourceBranch: string): string {
    const tenant = this.extractTenant(sourceBranch);
    const ticket = this.jiraTicket().trim();
    const suffix = this.branchSuffix().trim();
    return `${ticket}-${tenant}-${suffix}`;
  }

  private buildScript(): string {
    const selected = this.branches().filter((b) => b.selected);
    if (!selected.length) return "";

    const commitMsg = this.commitMessage();
    const repo = this.repoPath();

    const lines: string[] = [
      "#!/bin/bash",
      "# Git Branch Manager — apply changes across tenant branches",
      `# Mode: ${this.applyMode()}`,
      `# Generated: ${new Date().toISOString()}`,
      "#",
      "# HOW TO RUN:",
      "#   1. Copy this script",
      "#   2. Save: pbpaste > /tmp/apply-branches.sh && chmod +x /tmp/apply-branches.sh",
      "#   3. Run:  /tmp/apply-branches.sh",
      "",
      "set -e",
      "",
      `cd ${repo}`,
      "git fetch origin",
      "",
    ];

    if (this.applyMode() === "stash") {
      lines.push("# Ensure stash exists");
      lines.push("STASH_COUNT=$(git stash list | wc -l)");
      lines.push('if [ "$STASH_COUNT" -eq 0 ]; then');
      lines.push(
        '  echo "ERROR: No stash found. Stash your changes first with: git stash"',
      );
      lines.push("  exit 1");
      lines.push("fi");
      lines.push("");
    }

    for (const { sourceBranch, newBranch, tenant } of selected) {
      lines.push(`# ── ${tenant.toUpperCase()} ──`);
      lines.push(`git checkout origin/${sourceBranch}`);
      lines.push(`git checkout -b ${newBranch}`);

      if (this.applyMode() === "cherry-pick") {
        lines.push(`git cherry-pick ${this.commitHash().trim()} --no-commit`);
      } else {
        lines.push("git stash apply");
      }

      lines.push("git add .");
      lines.push(`git commit -m "${commitMsg}"`);
      lines.push(`git push origin ${newBranch}`);
      lines.push("");
    }

    lines.push('echo "Done! All branches created, committed, and pushed."');

    return lines.join("\n");
  }
}
