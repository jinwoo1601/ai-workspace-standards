#!/usr/bin/env bun
/**
 * plastic-bootstrap.ts — co-unity Plastic SCM workspace bootstrap
 *
 * Turns a freshly scaffolded co-unity project (which the harness always creates as a git
 * repository) into a Plastic SCM / Unity Version Control workspace:
 *
 *   1. Removes the inherited git machinery — `.githooks/`, `.github/`, `.gitattributes`,
 *      `.gitignore` and `.git/`. A `.git/` that holds real history (more than one commit)
 *      is KEPT unless `--force`, and the run then exits 2 so the caller notices.
 *   2. Writes the standard Unity `ignore.conf` at the project root (appends only the
 *      missing entries when the file already exists with other content).
 *   3. Rewrites the four inherited git-only commands — `/sync` and `/commit-push-pr` for
 *      both platforms — as redirect stubs pointing at the `vc-checkin` ceremony.
 *   4. Reports whether `cm.exe` is reachable from WSL and whether the project directory is
 *      a registered Plastic workspace. A missing `cm.exe` never fails the run.
 *
 * Every action prints a REMOVE / WRITE / SKIP / KEEP line and the whole script is
 * idempotent: a second run is a no-op. Run it after scaffolding a co-unity project and
 * again after every `upgrade-project.ts`.
 *
 * No shell is ever involved — external commands are spawned with argument arrays.
 *
 * @version 1.0.0
 * Usage:
 *   bun scripts/co-unity/plastic-bootstrap.ts [--project <path>] [--dry-run] [--check] [--force]
 *
 *   --project <path>  Project root to bootstrap (default: current working directory)
 *   --dry-run         Print the plan; change nothing
 *   --check           Report only (implies --dry-run) and always exit 0 — used by the
 *                     SessionStart hook
 *   --force           Remove `.git/` even when it holds more than one commit
 *
 * Exit codes:
 *   0 = done (always 0 under --check)
 *   1 = not a co-unity project, or bad arguments
 *   2 = `.git/` retained because it holds more than one commit — re-run with --force
 *
 * @module plastic-bootstrap
 */

import {
  existsSync,
  readFileSync,
  writeFileSync,
  appendFileSync,
  mkdirSync,
  rmSync,
} from "node:fs";
import { join, resolve, basename } from "node:path";
import { spawnSync } from "node:child_process";

const VERSION = "1.0.0";

/** Marker that makes the redirect stubs recognisable (and the rewrite idempotent). */
const REDIRECT_MARKER = "<!-- co-unity: plastic redirect -->";

/** Header written above entries appended to a pre-existing ignore.conf. */
const APPEND_MARKER = "# --- co-unity harness (plastic-bootstrap) ---";

/** Literal Windows path tried when `cm.exe` is not on PATH. */
const CM_FALLBACK = "/mnt/c/Program Files/PlasticSCM5/client/cm.exe";

/** Hard cap on every external command this script spawns. */
const CM_TIMEOUT_MS = 20_000;

/** Git machinery removed wholesale (directories and files alike). */
const GIT_ARTIFACTS = [".githooks", ".github", ".gitattributes", ".gitignore"] as const;

/**
 * The standard co-unity `ignore.conf`. Kept byte-identical to the copy shipped as the
 * `plastic-checkin` skill asset — change both together.
 */
const IGNORE_CONF = `Library/
Temp/
Obj/
Logs/
UserSettings/
Build/
Builds/
MemoryCaptures/
Recordings/
*.csproj
*.sln
*.pidb
*.booproj
*.svd
*.user
*.userprefs
.vs/
.idea/
.vscode/
.DS_Store
Thumbs.db
Desktop.ini
node_modules/
.env
.env.*
!.env.sample
*.log
*.tmp
nul
NUL
memory/archive/
TestResults_*.xml
.claude/settings.local.json
.gemini/settings.local.json
`;

const IGNORE_LINES = IGNORE_CONF.split("\n").filter((line) => line.trim() !== "");

/** The four inherited git-only commands that become redirect stubs. */
const REDIRECT_TARGETS: ReadonlyArray<{ rel: string[]; command: string; title: string }> = [
  { rel: [".claude", "commands", "sync.md"], command: "/sync", title: "Sync" },
  {
    rel: [".claude", "commands", "commit-push-pr.md"],
    command: "/commit-push-pr",
    title: "Commit, Push, and Create PR",
  },
  { rel: [".gemini", "commands", "sync.md"], command: "/sync", title: "Sync" },
  {
    rel: [".gemini", "commands", "commit-push-pr.md"],
    command: "/commit-push-pr",
    title: "Commit, Push, and Create PR",
  },
];

// ── Options ──────────────────────────────────────────────────────────────────

interface Options {
  project: string;
  dryRun: boolean;
  check: boolean;
  force: boolean;
}

function usage(): void {
  console.log(
    "Usage: bun scripts/co-unity/plastic-bootstrap.ts [--project <path>] [--dry-run] [--check] [--force]",
  );
}

function parseArgs(argv: string[]): Options {
  const opts: Options = {
    project: process.cwd(),
    dryRun: false,
    check: false,
    force: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--project") {
      const value = argv[++i];
      if (!value) {
        console.error("❌ --project requires a path");
        usage();
        process.exit(1);
      }
      opts.project = value;
    } else if (arg.startsWith("--project=")) {
      opts.project = arg.slice("--project=".length);
    } else if (arg === "--dry-run") {
      opts.dryRun = true;
    } else if (arg === "--check") {
      opts.check = true;
    } else if (arg === "--force") {
      opts.force = true;
    } else if (arg === "--help" || arg === "-h") {
      usage();
      process.exit(0);
    } else if (arg === "--version") {
      console.log(VERSION);
      process.exit(0);
    } else {
      console.error(`❌ Unknown argument: ${arg}`);
      usage();
      process.exit(1);
    }
  }

  // --check never touches the filesystem.
  if (opts.check) opts.dryRun = true;
  opts.project = resolve(opts.project);
  return opts;
}

// ── Guard ────────────────────────────────────────────────────────────────────

/** Exits 1 unless `project` is demonstrably a co-unity project. */
function assertCoUnityProject(project: string): void {
  const variantPath = join(project, "variant.json");
  if (existsSync(variantPath)) {
    try {
      const variant = JSON.parse(readFileSync(variantPath, "utf-8")) as { name?: unknown };
      if (variant?.name === "co-unity") return;
    } catch {
      // Unparseable variant.json — fall through to template-version.txt.
    }
  }

  const templateVersionPath = join(project, ".claude", "template-version.txt");
  if (existsSync(templateVersionPath)) {
    const text = readFileSync(templateVersionPath, "utf-8");
    if (/^\s*variant\s*=\s*co-unity\s*$/m.test(text)) return;
  }

  console.error(`❌ Not a co-unity project: ${project}`);
  console.error(
    '   Expected variant.json with "name": "co-unity", or .claude/template-version.txt containing variant=co-unity.',
  );
  console.error("   Fix: run this from the project root, or pass --project <path>.");
  process.exit(1);
}

// ── Action log ───────────────────────────────────────────────────────────────

type ActionKind = "REMOVE" | "WRITE" | "SKIP" | "KEEP";

const tally: Record<ActionKind, number> = { REMOVE: 0, WRITE: 0, SKIP: 0, KEEP: 0 };

function act(opts: Options, kind: ActionKind, target: string, note = ""): void {
  tally[kind] += 1;
  const prefix = opts.dryRun ? "[dry-run] " : "";
  console.log(`${prefix}${kind.padEnd(6)} ${target}${note ? `  (${note})` : ""}`);
}

// ── (a) Git machinery ────────────────────────────────────────────────────────

/** `git rev-list --count HEAD`, or null when git is unavailable / there are no commits. */
function commitCount(project: string): number | null {
  const result = spawnSync("git", ["-C", project, "rev-list", "--count", "HEAD"], {
    encoding: "utf-8",
    timeout: CM_TIMEOUT_MS,
  });
  if (result.error || result.status !== 0) return null;
  const parsed = Number.parseInt((result.stdout ?? "").trim(), 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function remove(path: string): void {
  rmSync(path, { recursive: true, force: true, maxRetries: 3 });
}

/** Returns true when `.git/` was deliberately retained (caller must exit 2). */
function removeGitMachinery(opts: Options): boolean {
  for (const name of GIT_ARTIFACTS) {
    const path = join(opts.project, name);
    if (!existsSync(path)) {
      act(opts, "SKIP", name, "absent");
      continue;
    }
    if (!opts.dryRun) remove(path);
    act(opts, "REMOVE", name);
  }

  const gitDir = join(opts.project, ".git");
  if (!existsSync(gitDir)) {
    act(opts, "SKIP", ".git", "absent");
    return false;
  }

  const count = commitCount(opts.project);
  if (count !== null && count > 1 && !opts.force) {
    act(opts, "KEEP", ".git", `${count} commits — use --force to remove`);
    console.warn(
      `⚠️  .git retained: it holds ${count} commits. Migrate that history into Plastic first, ` +
        "then re-run with --force to remove it.",
    );
    return true;
  }

  const note = count === null ? "git unavailable or no commits" : `${count} commit(s)`;
  if (!opts.dryRun) remove(gitDir);
  act(opts, "REMOVE", ".git", note);
  return false;
}

// ── (b) ignore.conf ──────────────────────────────────────────────────────────

function writeIgnoreConf(opts: Options): void {
  const path = join(opts.project, "ignore.conf");

  if (!existsSync(path)) {
    if (!opts.dryRun) writeFileSync(path, IGNORE_CONF, "utf-8");
    act(opts, "WRITE", "ignore.conf", `${IGNORE_LINES.length} entries`);
    return;
  }

  const existing = readFileSync(path, "utf-8");
  const present = new Set(
    existing
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line !== ""),
  );
  const missing = IGNORE_LINES.filter((line) => !present.has(line));

  if (missing.length === 0) {
    act(opts, "SKIP", "ignore.conf", "all entries present");
    return;
  }

  const leadingNewline = existing.length > 0 && !existing.endsWith("\n") ? "\n" : "";
  const block = `${leadingNewline}\n${APPEND_MARKER}\n${missing.join("\n")}\n`;
  if (!opts.dryRun) appendFileSync(path, block, "utf-8");
  act(opts, "WRITE", "ignore.conf", `appended ${missing.length} missing entries`);
}

// ── (c) Redirect stubs for the inherited git-only commands ───────────────────

function redirectStub(title: string): string {
  return `---
description: Inert under Plastic SCM — redirects to the vc-checkin ceremony (co-unity)
---

${REDIRECT_MARKER}

# ${title} — inert under Plastic SCM

This project's version control is **Plastic SCM (Unity Version Control)**, driven as
\`cm.exe\` from WSL. \`/sync\` and \`/commit-push-pr\` are git-only harness commands and are
**inert** here: they do nothing, and running them would be wrong.

## Check in through the vc-checkin ceremony instead

- Persona: \`agents/vc-checkin.md\`
- Skill: \`skills/plastic-checkin/SKILL.md\`
- The ceremony: status -> categorize -> re-register -> add -> checkin -> verify. It returns
  \`cs:N\` or \`BLOCKED\`.
- The bookkeeping commit is always a **separate changeset** from the work checkin.

**Never run git in this project.**
`;
}

function writeRedirectStubs(opts: Options): void {
  for (const target of REDIRECT_TARGETS) {
    const rel = target.rel.join("/");
    const path = join(opts.project, ...target.rel);

    if (existsSync(path) && readFileSync(path, "utf-8").includes(REDIRECT_MARKER)) {
      act(opts, "SKIP", rel, "already a plastic redirect");
      continue;
    }

    if (!opts.dryRun) {
      mkdirSync(join(opts.project, target.rel[0], target.rel[1]), { recursive: true });
      writeFileSync(path, redirectStub(target.title), "utf-8");
    }
    act(opts, "WRITE", rel, `redirect for ${target.command}`);
  }
}

// ── (d) Plastic workspace check ──────────────────────────────────────────────

/** `/mnt/d/Foo/Bar` -> `D:\Foo\Bar`; null when the path is not a /mnt/<drive> path. */
function toWindowsPath(path: string): string | null {
  const match = /^\/mnt\/([a-z])(\/.*)?$/i.exec(path);
  if (!match) return null;
  const tail = (match[2] ?? "/").replace(/\//g, "\\");
  return `${match[1].toUpperCase()}:${tail}`;
}

/** Locates a runnable cm.exe: PATH first, then the standard Windows install path. */
function findCm(): string | null {
  const onPath = spawnSync("cm.exe", ["version"], {
    encoding: "utf-8",
    timeout: CM_TIMEOUT_MS,
  });
  if (!onPath.error && onPath.status === 0) return "cm.exe";

  if (existsSync(CM_FALLBACK)) {
    const fallback = spawnSync(CM_FALLBACK, ["version"], {
      encoding: "utf-8",
      timeout: CM_TIMEOUT_MS,
    });
    if (!fallback.error && fallback.status === 0) return CM_FALLBACK;
  }
  return null;
}

function printWorkspaceHint(project: string): void {
  const windowsPath = toWindowsPath(project);
  console.log(
    `       Hint: cm.exe workspace create ${basename(project)} "${windowsPath ?? project}"`,
  );
}

function checkPlasticWorkspace(opts: Options): void {
  const cm = findCm();
  if (cm === null) {
    console.log(`WARN   cm.exe not reachable (tried PATH and "${CM_FALLBACK}")`);
    console.log("       Install Unity Version Control on Windows, then register this project.");
    printWorkspaceHint(opts.project);
    return;
  }
  console.log(`OK     cm.exe reachable (${cm})`);

  const status = spawnSync(cm, ["status", "--header"], {
    cwd: opts.project,
    encoding: "utf-8",
    timeout: CM_TIMEOUT_MS,
  });
  if (status.error || status.status !== 0) {
    console.log("WARN   not a registered Plastic workspace (cm.exe status --header failed)");
    const detail = `${status.stderr ?? ""}${status.stdout ?? ""}`.trim().split("\n")[0];
    if (detail) console.log(`       ${detail}`);
    printWorkspaceHint(opts.project);
    return;
  }
  const header = (status.stdout ?? "").trim().split("\n")[0] ?? "";
  console.log(`OK     Plastic workspace registered${header ? ` — ${header}` : ""}`);
}

// ── Main ─────────────────────────────────────────────────────────────────────

function main(): void {
  const opts = parseArgs(process.argv.slice(2));

  console.log(`\n=== plastic-bootstrap v${VERSION} ===`);
  console.log(`Project: ${opts.project}`);
  console.log(
    `Mode:    ${opts.check ? "check (report only)" : opts.dryRun ? "dry-run" : "apply"}${opts.force ? " +force" : ""}\n`,
  );

  assertCoUnityProject(opts.project);

  const gitRetained = removeGitMachinery(opts);
  writeIgnoreConf(opts);
  writeRedirectStubs(opts);

  console.log("");
  checkPlasticWorkspace(opts);

  console.log("\n--- Summary ---");
  console.log(
    `REMOVE ${tally.REMOVE}   WRITE ${tally.WRITE}   SKIP ${tally.SKIP}   KEEP ${tally.KEEP}`,
  );

  if (opts.check) {
    console.log("Result: check complete (no changes made).\n");
    process.exit(0);
  }

  if (gitRetained) {
    console.log(
      "Result: .git retained — re-run with --force once its history lives in Plastic.\n",
    );
    process.exit(2);
  }

  console.log(
    opts.dryRun ? "Result: dry-run complete (no changes made).\n" : "Result: bootstrap complete.\n",
  );
  process.exit(0);
}

main();
