---
name: test-driven-development
description: >
  Implements and verifies Unity code with the red-green-refactor cycle against the project's
  bound verification commands — EditMode and PlayMode suites, test assemblies, and the cheaper
  headless compile gates that run before them. Use when: developing a feature test-first, fixing
  a bug with a reproducing test, running the bound battery, or reporting a verification result.
version: 0.1.0
scope: co-unity
status: active
owner: test-runner
last_reviewed: 2026-09-01
prerequisites: The project's verification bindings exist at docs/verification-bindings.md and have been run green at least once.
relates_to:
  - skill: code-review
    type: follows
  - skill: refactoring
    type: composes_with
gemini-parity: skip
metadata:
  type: process
  triggers:
    - tdd
    - test driven development
    - test first
    - write tests first
    - red green refactor
    - run the tests
    - editmode tests
    - playmode tests
    - verification battery
---

## Context

Test-Driven Development in a Unity project, driven from WSL against a Windows toolchain. The cycle
is the familiar one — **red, green, refactor** — but the arbiter is not a generic test runner: it
is the project's **bound** verification commands.

> **The exact commands are bound in `docs/verification-bindings.md`. This skill never invents them.**
> A skill or agent that finds no binding reports that and stops; it never improvises one.

Lookup order for the bindings: `docs/verification-bindings.md` → `docs/co-unity.context.md`
§ Environment Setup → report "no verification binding for this project" and stop. Never invent,
modify, or "fix" a build command to make it run.

Two standing truths shape everything below. First, a green gate is only as wide as the binding
that defines it — expected-green patterns and dated baselines are part of the binding, and a
baseline that *moved for a documented reason* is a re-baseline, not a regression. Second,
**authored content has no automated gate**: voice lines, text pools, dialogue, art and audio
assets are invisible to every headless check and to the Editor suites alike. They are verified by
a human or they are unverified — say so rather than implying coverage.

## When to Use

**Feature development (phase 3)**:
- Trigger: "implement this test-first", a build plan step with a testable acceptance criterion.
- Use case: write the failing EditMode test before the production code.

**Bug fixing**:
- Trigger: "fix this bug with a test", a confirmed correctness finding out of a review cycle.
- Use case: reproduce first, then fix; the test is the regression guard.

**Verification runs (phases 0, 3, 4, 5)**:
- Trigger: "run the tests", "run the battery", a review cycle's CHECK step, a preflight audit.
- Use case: execute the bound commands, parse the results, report honestly.

**Refactoring safety net**:
- Trigger: a refactoring ruling from a review cycle.
- Use case: establish green before, hold green after.

---

## Execution Steps

### Step 0: Resolve the bindings

Read `docs/verification-bindings.md` before running anything. Record, for this run: which gates
exist, the exact command line for each, the expected-green pattern, the dated baseline, and the
documented environment quirks. If a gate you need is not bound, stop and report — do not
substitute a command that looks equivalent.

### Step 1: Red — write a failing test

1. **State the behavior** the code must exhibit, in the words of the requirements doc's acceptance
   criterion. Test names describe behavior, not implementation.
2. **Choose the platform**:

   | | EditMode | PlayMode |
   |---|---|---|
   | Attribute | `[Test]` (NUnit), `[UnityTest]` for a coroutine over editor frames | `[UnityTest]` returning `IEnumerator`, `[Test]` for frame-independent checks |
   | Runs in | The editor's own domain, no play loop | A real play loop, one frame per `yield return null` |
   | Use for | Pure logic, math, data transforms, serialization shape, editor tooling | Component lifecycle, physics, coroutine timing, scene wiring, input |
   | Cost | Seconds | Much slower; domain reload and scene load per run |

   **Default to EditMode.** Reach for PlayMode only when the behavior genuinely needs the play
   loop. A logic bug chased into PlayMode is a design smell: extract the logic into a plain class
   the EditMode suite can exercise directly.
3. **Arrange-Act-Assert**, one behavior per test, no dependence on test order, no dependence on a
   scene the test did not itself set up.
4. **Run it and confirm it fails** — and fails for the stated reason. A test that passes before the
   production code exists is testing nothing.

### Step 2: Wire the test assembly (once per test folder)

Tests live in their own assembly, never in the runtime assembly. The `.asmdef` for a test folder:

```json
{
  "name": "Studio.Feature.Tests",
  "rootNamespace": "Studio.Feature.Tests",
  "references": [
    "Studio.Feature.Runtime",
    "UnityEngine.TestRunner",
    "UnityEditor.TestRunner"
  ],
  "includePlatforms": ["Editor"],
  "excludePlatforms": [],
  "overrideReferences": true,
  "precompiledReferences": ["nunit.framework.dll"],
  "autoReferenced": false,
  "defineConstraints": ["UNITY_INCLUDE_TESTS"],
  "noEngineReferences": false
}
```

- `overrideReferences: true` is what allows `precompiledReferences` to name `nunit.framework.dll`.
  Without both, the test assembly does not see NUnit and nothing compiles.
- `defineConstraints: ["UNITY_INCLUDE_TESTS"]` keeps the assembly out of player builds.
- `autoReferenced: false` keeps test code from leaking into other assemblies.
- Drop `includePlatforms` for a PlayMode test assembly that must run on device.

To exercise `internal` types without widening them to `public`, put an `AssemblyInfo.cs` in the
runtime folder:

```csharp
using System.Runtime.CompilerServices;

[assembly: InternalsVisibleTo("Studio.Feature.Tests")]
```

Every new file and every new folder gets its `.meta` — including the folder's own `.meta`, which
lives in the parent directory.

### Step 3: Green — minimum code to pass

Write the least code that makes the test pass. Do not implement behavior no test asked for. Do not
optimize yet. Re-run and confirm green.

Run the **cheap gates first** where the bindings list them — they catch type and API breakage in
seconds instead of minutes, before the Editor suite is worth starting:

- **Headless compile gate** — a flat compile of the runtime sources as a `OutputType=Library`
  project, run with `dotnet.exe build -c Release` (not `run` — a library target is not runnable and
  fails structurally regardless of whether the code is sound). Green means `0 Error(s)`.
- **Run-harness console projects** — console projects that execute checks and print a score, run as
  `dotnet.exe run -c Release`. They compile the runtime sources directly, so a public-member change
  breaks them even when nothing under the asset tree references it. **Any call-site audit must
  sweep the harness directories the bindings name, not only the asset tree.**

Only when those are green is the Editor suite worth the wall clock.

### Step 4: Run the Editor suites

The batchmode runner has the shape below; the bindings carry the literal command, the editor
version, and the paths.

```bash
"/mnt/c/Program Files/Unity/Hub/Editor/<version>/Editor/Unity.exe" \
  -batchmode \
  -projectPath "<WINDOWS project path>" \
  -runTests \
  -testPlatform EditMode \
  -testResults "<WINDOWS path>\TestResults_<ts>.xml" \
  -logFile "<WINDOWS path>\editmode_<ts>.log"
```

PlayMode is the same command with `-testPlatform PlayMode`.

Non-negotiable rules for this command:

- **Never pass `-quit` together with `-runTests`** — the two conflict and the run dies without
  results.
- Editor version comes from `ProjectSettings/ProjectVersion.txt`, never from memory.
- Exit code **0 = all pass**, exit code **2 = test failures** — parse the NUnit results XML for the
  failure list; the exit code alone is not a report.
- **A "0 tests ran" result with compile errors in the log is a FAIL, not a pass.** Read the log
  before reading the XML.
- Batchmode cannot run while the editor has this project **open**. Check for a live editor process
  first and, if one is running, ask the human to close it. A *stale* lock file (present, with no
  editor process) may be deleted.
- Results XML and logs land where the bindings say; they are uncontrolled and stay out of
  changesets (`TestResults_*.xml` is in the standard `ignore.conf`).

### Step 5: Refactor — improve with the net up

With every gate green, clean up: remove duplication, improve names, extract a method or a class,
simplify a conditional. Re-run after each change. Behavior does not change — if a test needed
editing to stay green, that was not a refactoring. The `refactoring` skill carries the patterns and
the Unity-specific traps.

### Step 6: Repeat, then report

Next behavior, next failing test. When the loop closes, report the run.

---

## Reporting discipline

- **Report the result, not the hope.** A gate that did not run did not pass. Say which gates ran,
  which did not, and why.
- **Attribute quirk failures.** Where a binding documents an environment quirk (a native call that
  cannot run headless, a harness limit), a failure caused by it is the harness's limit, not the
  code's — name the quirk and cite the binding line. Where a failure is *not* covered by a
  documented quirk, it is a real failure.
- **Baselines are dated.** Compare against the binding's dated baseline. A count that moved for a
  reason the record explains is a re-baseline; say which record explains it. A count that moved
  with no explanation is a regression.
- **Negative results are findings.** "The suite does not cover this path" is worth reporting.
- **Authored content has no automated gate.** Voice lines, text pools, dialogue, art, audio: no
  headless check and no Editor suite validates their content. Treat them as unverified until a
  human has seen or heard them, and say so explicitly in the report.
- **Never edit code to make a gate pass.** Verification is read-only. Report and hand back.

---

## Output Format

```markdown
## Verification report — <scope> — <YYYY-MM-DD>
Bindings: docs/verification-bindings.md (read <YYYY-MM-DD>)

| Gate | Command | Result | Baseline | Verdict |
|---|---|---|---|---|
| headless compile | dotnet.exe build -c Release | 0 Error(s) | 0 errors | PASS |
| <harness> | dotnet.exe run -c Release | 104/104 | 104/104 (2026-08-20) | PASS |
| EditMode | Unity.exe -batchmode -runTests … | 239/239, exit 0 | 239/239 | PASS |
| PlayMode | … | not run — no PlayMode assemblies bound | — | N/A |

**Overall: PASS | FAIL | BLOCKED**

### Failures
- `<Namespace.Fixture.TestName>` — <assertion message> — <XML line reference>

### Quirk-attributed
- <gate> — failed on <quirk>, documented at bindings § <n>. Not a code failure.

### Not covered
- Authored content (<what>) — human-only gate, unverified.
```

**For a bug fix**: the reproducing test (red before, green after), the minimal fix, and the gate
results either side.

**For a feature**: the test list with the acceptance criterion each one covers, and the gaps that
remain uncovered.

---

## Related Skills

- **code-review** — follows this skill; a confirmed correctness finding is usually worth a
  reproducing test before the fix is applied.
- **refactoring** — the green half of the cycle; it supplies the patterns and the Unity traps.
- **unity-custom-package** — test assembly layout inside a distributable package.
- **evidence-ledger** — for carrying verification results into a gate packet.
- **plastic-checkin** — checks the tests in alongside the code they cover.
