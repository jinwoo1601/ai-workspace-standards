import { describe, test, expect, afterEach } from "bun:test";
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  existsSync,
  rmSync,
} from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

const SCRIPT = join(import.meta.dir, "..", "scripts", "co-unity", "plastic-bootstrap.ts");
const REDIRECT_MARKER = "<!-- co-unity: plastic redirect -->";

/** The exact ignore.conf list the script must write (brief section 4.2). */
const EXPECTED_IGNORE_CONF = `Library/
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

const REDIRECT_FILES = [
  ".claude/commands/sync.md",
  ".claude/commands/commit-push-pr.md",
  ".gemini/commands/sync.md",
  ".gemini/commands/commit-push-pr.md",
];

const GIT_AVAILABLE = (() => {
  const result = spawnSync("git", ["--version"], { encoding: "utf-8" });
  return !result.error && result.status === 0;
})();

const tempDirs: string[] = [];

function makeTempDir(prefix = "counity-plastic-"): string {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

/** A co-unity project fixture carrying the full inherited git machinery. */
function makeFixture(): string {
  const dir = makeTempDir();
  writeFileSync(join(dir, "variant.json"), JSON.stringify({ name: "co-unity" }, null, 2), "utf-8");

  mkdirSync(join(dir, ".githooks"), { recursive: true });
  writeFileSync(join(dir, ".githooks", "pre-commit"), "#!/bin/sh\nexit 0\n", "utf-8");
  mkdirSync(join(dir, ".github", "workflows"), { recursive: true });
  writeFileSync(join(dir, ".github", "workflows", "ci.yml"), "name: ci\n", "utf-8");
  writeFileSync(join(dir, ".gitattributes"), "* text=auto\n", "utf-8");
  writeFileSync(join(dir, ".gitignore"), "node_modules/\n", "utf-8");

  mkdirSync(join(dir, ".claude", "commands"), { recursive: true });
  mkdirSync(join(dir, ".gemini", "commands"), { recursive: true });
  for (const rel of REDIRECT_FILES) {
    writeFileSync(join(dir, rel), "Run the full project sync pipeline.\n\ngit push origin HEAD\n", "utf-8");
  }
  return dir;
}

function git(dir: string, args: string[]): void {
  const result = spawnSync("git", ["-C", dir, ...args], { encoding: "utf-8" });
  if (result.status !== 0) {
    throw new Error(`git ${args.join(" ")} failed: ${result.stderr ?? ""}`);
  }
}

/** Initializes a git repo inside `dir` with `commits` commits. */
function initRepo(dir: string, commits: number): void {
  git(dir, ["init", "-q"]);
  git(dir, ["config", "user.email", "test@example.com"]);
  git(dir, ["config", "user.name", "test"]);
  git(dir, ["config", "commit.gpgsign", "false"]);
  for (let i = 0; i < commits; i++) {
    writeFileSync(join(dir, `file-${i}.txt`), `content ${i}\n`, "utf-8");
    git(dir, ["add", "-A"]);
    git(dir, ["commit", "-q", "-m", `commit ${i}`]);
  }
}

function run(args: string[]): { code: number; out: string; err: string } {
  const result = spawnSync(process.execPath, [SCRIPT, ...args], { encoding: "utf-8" });
  return {
    code: result.status ?? -1,
    out: result.stdout ?? "",
    err: result.stderr ?? "",
  };
}

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true, maxRetries: 3 });
  }
});

describe("plastic-bootstrap", () => {
  test("strips the git machinery, writes ignore.conf, and rewrites the four commands", () => {
    const dir = makeFixture();
    const result = run(["--project", dir]);

    expect(result.code).toBe(0);
    for (const artifact of [".githooks", ".github", ".gitattributes", ".gitignore"]) {
      expect(existsSync(join(dir, artifact))).toBe(false);
    }
    expect(result.out).toContain("REMOVE");

    expect(readFileSync(join(dir, "ignore.conf"), "utf-8")).toBe(EXPECTED_IGNORE_CONF);

    for (const rel of REDIRECT_FILES) {
      const content = readFileSync(join(dir, rel), "utf-8");
      expect(content).toContain(REDIRECT_MARKER);
      expect(content).toContain(
        "description: Inert under Plastic SCM — redirects to the vc-checkin ceremony (co-unity)",
      );
      expect(content).toContain("skills/plastic-checkin/SKILL.md");
      expect(content).toContain("agents/vc-checkin.md");
      expect(content).not.toContain("git push");
    }
  });

  test("is idempotent on a second run", () => {
    const dir = makeFixture();
    expect(run(["--project", dir]).code).toBe(0);
    const ignoreAfterFirst = readFileSync(join(dir, "ignore.conf"), "utf-8");
    const stubAfterFirst = readFileSync(join(dir, REDIRECT_FILES[0]), "utf-8");

    const second = run(["--project", dir]);
    expect(second.code).toBe(0);
    expect(second.out).toContain("SKIP   ignore.conf");
    expect(readFileSync(join(dir, "ignore.conf"), "utf-8")).toBe(ignoreAfterFirst);
    expect(readFileSync(join(dir, REDIRECT_FILES[0]), "utf-8")).toBe(stubAfterFirst);
  });

  test("appends only the missing entries to a pre-existing ignore.conf", () => {
    const dir = makeFixture();
    writeFileSync(join(dir, "ignore.conf"), "Library/\nMyGame/Secrets/\n", "utf-8");

    expect(run(["--project", dir]).code).toBe(0);
    const content = readFileSync(join(dir, "ignore.conf"), "utf-8");
    expect(content).toContain("MyGame/Secrets/");
    expect(content).toContain("# --- co-unity harness (plastic-bootstrap) ---");
    // "Library/" was already present and must not be duplicated.
    expect(content.split("\n").filter((line) => line === "Library/").length).toBe(1);
    for (const line of EXPECTED_IGNORE_CONF.trim().split("\n")) {
      expect(content.split("\n")).toContain(line);
    }
  });

  test("refuses a directory that is not a co-unity project", () => {
    const dir = makeTempDir("counity-notaproject-");
    writeFileSync(join(dir, "variant.json"), JSON.stringify({ name: "co-develop" }), "utf-8");

    const result = run(["--project", dir]);
    expect(result.code).toBe(1);
    expect(result.err).toContain("Not a co-unity project");
    expect(existsSync(join(dir, "ignore.conf"))).toBe(false);
  });

  test("accepts .claude/template-version.txt as the co-unity marker", () => {
    const dir = makeTempDir("counity-tv-");
    mkdirSync(join(dir, ".claude"), { recursive: true });
    writeFileSync(
      join(dir, ".claude", "template-version.txt"),
      "variant=co-unity\nversion=0.6.0\n",
      "utf-8",
    );

    const result = run(["--project", dir]);
    expect(result.code).toBe(0);
    expect(existsSync(join(dir, "ignore.conf"))).toBe(true);
  });

  test("--dry-run changes nothing", () => {
    const dir = makeFixture();
    const result = run(["--project", dir, "--dry-run"]);

    expect(result.code).toBe(0);
    expect(result.out).toContain("[dry-run]");
    expect(existsSync(join(dir, "ignore.conf"))).toBe(false);
    expect(existsSync(join(dir, ".githooks"))).toBe(true);
    expect(existsSync(join(dir, ".gitattributes"))).toBe(true);
    expect(readFileSync(join(dir, REDIRECT_FILES[0]), "utf-8")).not.toContain(REDIRECT_MARKER);
  });

  test("--check reports without changing anything and always exits 0", () => {
    const dir = makeFixture();
    const result = run(["--project", dir, "--check"]);

    expect(result.code).toBe(0);
    expect(result.out).toMatch(/OK |WARN /);
    expect(existsSync(join(dir, "ignore.conf"))).toBe(false);
    expect(existsSync(join(dir, ".githooks"))).toBe(true);
  });

  test.skipIf(!GIT_AVAILABLE)("removes a .git with a single commit", () => {
    const dir = makeFixture();
    initRepo(dir, 1);

    const result = run(["--project", dir]);
    expect(result.code).toBe(0);
    expect(existsSync(join(dir, ".git"))).toBe(false);
  });

  test.skipIf(!GIT_AVAILABLE)("keeps a .git with 2+ commits and exits 2", () => {
    const dir = makeFixture();
    initRepo(dir, 3);

    const result = run(["--project", dir]);
    expect(result.code).toBe(2);
    expect(existsSync(join(dir, ".git"))).toBe(true);
    expect(result.out).toContain("KEEP");
    expect(result.out).toContain("3 commits");
    expect(`${result.out}${result.err}`).toContain("--force");
    // The rest of the bootstrap still ran.
    expect(existsSync(join(dir, "ignore.conf"))).toBe(true);
    expect(existsSync(join(dir, ".gitattributes"))).toBe(false);
  });

  test.skipIf(!GIT_AVAILABLE)("--force removes a .git with 2+ commits", () => {
    const dir = makeFixture();
    initRepo(dir, 3);

    const result = run(["--project", dir, "--force"]);
    expect(result.code).toBe(0);
    expect(existsSync(join(dir, ".git"))).toBe(false);
  });
});
