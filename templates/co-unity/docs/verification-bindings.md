# Verification bindings — <project name>

<!--
  TEMPLATE. Fill every <placeholder> and delete every binding class this project does not use.
  Authored at phase 0 by `stack-setup`; kept current by whoever changes a gate.

  This file IS the verification contract. `test-runner` runs exactly what is written here and
  nothing else. The main thread never runs builds. An agent that finds no binding for a gate
  reports that and stops — it never invents, modifies or "fixes" a build command.

  Lookup order for `test-runner`:
    1. this file
    2. docs/co-unity.context.md § Environment Setup
    3. report "no verification binding for this project" and stop
-->

Last reviewed: `<YYYY-MM-DD>` · Last baselined at: `cs:<N>`

---

## Bindings

The authoritative automated gates for this project. Each is numbered, each names its exact command,
its expected-green pattern and its dated baseline. Windows executables are always called with the
`.exe` suffix from WSL.

1. **Flat compile** — `<path/to/CompileCheck.csproj>` at `<location>`. Run as
   **`dotnet.exe build`**, never `run`: it is `OutputType=Library` and `dotnet run` fails on it
   structurally regardless of whether the code is sound. It compiles `<source glob, e.g.
   Assets/<Project>/Scripts/**>` flat and is therefore **blind to assembly-definition boundaries
   and to test assemblies** — a green flat compile does not mean the Editor will compile the same
   sources. Green = `0 Error(s)`.
   <!-- Cheapest gate; run it first. If it is red, nothing below is worth running. -->

2. **Run-harnesses** — console projects that execute checks and print results, each run as
   `cd <harness dir> && dotnet.exe run -c Release`:
   - `<harness dir>/<name>` — `<one line: what it checks; authoritative or indicative>`
   - `<harness dir>/<name>` — `<one line>`
   - The standing set for a build phase is whatever the feature's architecture-doc `## Build plan`
     names.

   **Uncontrolled-harness caveat.** These harness sources typically live in the project's
   uncontrolled scratch area (`<scratch dir>`, excluded by `ignore.conf`) **yet they compile the
   controlled sources directly**. Changing or removing a public member breaks them, and a call-site
   audit that sweeps only the asset tree will miss those call sites and report a clean change that
   then fails the battery. Any audit of a public-member change must cover `<scratch dir>` as well.

3. **Build-only harnesses** — `<harness dir>/<name>` is `OutputType=Library`: a compile-only check
   that flat-compiles `<sources>` plus `<test sources>` to catch type and API breakage cheaply
   before the Editor suite in binding 5. Run as **`dotnet.exe build -c Release`** — never
   `dotnet run`, which fails with *"A runnable project should target a runnable TFM … The current
   OutputType is 'Library'"* whatever the state of the code. Green = `0 Error(s)`.

4. **Expected-green patterns and baselines.** A gate is green only when its output matches its
   stated pattern — anything else is not green, including a pass with a different count.
   - `<harness>` → `<pattern, e.g. NN/NN>`
   - `<harness>` → `<pattern, e.g. PASS (NN files)>`
   - `<suite>` → `<pattern>`

   **Current baselines (`<YYYY-MM-DD>`, `cs:<N>`):** `<harness NN/NN · harness PASS (NN files) · …
   · EditMode NN/NN>`

   <!--
     A changed count is not automatically a regression. When a count moves, record WHY here, in
     one line, with the changeset and the decision that caused it — otherwise the next session
     cannot tell a re-baseline from a break.
       - a retired requirement removing assertions is a RE-BASELINE
       - a split file raising a file COUNT is a RE-BASELINE (a file count is not a score)
       - one test becoming two is a RE-BASELINE
       - the same command producing fewer passes with no decision behind it is a REGRESSION
   -->
   - `<YYYY-MM-DD>`, `cs:<N>`: `<harness>` `<old> → <new>` — **re-baseline**, `<the decision or ADR
     that caused it>`. Not a regression.

5. **Engine Editor test suites.** Run headless from WSL:

   ```
   "<path to Unity.exe, e.g. /mnt/c/Program Files/Unity/Hub/Editor/<version>/Editor/Unity.exe>" \
     -batchmode \
     -projectPath "<Windows path to the project root>" \
     -runTests \
     -testPlatform EditMode \
     -testResults "<Windows path>\TestResults_<timestamp>.xml" \
     -logFile "<Windows path>\<log dir>\editmode_<timestamp>.log"
   ```

   - **Editor version** comes from `ProjectSettings/ProjectVersion.txt` — read it; never assume a
     version, and never silently fall back to a different installed editor.
   - **Never pass `-quit` together with `-runTests`** — the two conflict and the run reports nothing
     useful.
   - **Exit codes**: `0` = all tests passed; `2` = test failures — parse the NUnit results XML for
     the failure list. Any other code is an environment failure, not a test result.
   - **Editor lock**: batchmode cannot run while the Editor has this project open. Check
     `tasklist.exe` for a live `Unity.exe` first and, if one is running, ask the human to close it.
     A **stale** `Temp/UnityLockfile` — the file present with no `Unity.exe` process — may be deleted.
   - **A "0 tests ran" result with compile errors in the log is a FAIL**, not a pass. Read the log,
     not just the exit code.
   - **PlayMode**: the same command with `-testPlatform PlayMode`. `<state here whether PlayMode
     test assemblies exist yet.>`
   - Results XML lands at `<path>` (uncommitted); logs land at `<log dir>`.

---

## What these gates do NOT cover

**No harness validates authored content.** The gates above exercise logic — mappings, pickers,
composers, solvers — against synthetic or inline fixtures. They do not load the project's authored
data assets, and a wrong, missing or misfiled line of authored content is invisible to every gate in
this file and to the Editor suites.

Treat as **human-verified only**:

- `<authored data assets, e.g. dialogue/voice line pools>`
- `<text pools, localization tables>`
- `<art, animation, level dressing, audio mixes>`
- `<the project's human-only playtest gate — for VR projects, the in-headset playtest>`

A human-only gate needs a **recorded human statement** as evidence at G2. It is never assumed to have
passed, and no green battery substitutes for it.

---

## Environment quirks

Failures caused by these are the harness's limits, not the code's. Attribute them; do not "fix" the
code to satisfy a harness that cannot run it.

- **Native engine methods do not run under WSL harnesses.** A harness that links the engine's managed
  DLLs cannot execute methods implemented as native internal calls — they throw
  `"ECall methods must be packaged into a system module."` Only the fully managed types and operators
  run. Record here which engine APIs your harnesses can and cannot exercise, and route the rest to
  the Editor test suites (binding 5).
  - Runs managed under WSL: `<list, e.g. Vector3, Mathf, the Quaternion * Vector3 operator>`
  - Native-only, Editor-suite territory: `<list, e.g. Quaternion.Slerp / LookRotation / Euler>`
- **Test assemblies live outside the flat-compile source glob.** `<test assembly>` sits at
  `<path>`, deliberately outside `<source glob>`, because a test-framework type inside the glob
  breaks the csproj compile in binding 1. Do not "tidy" tests back under the source root.
- `<other quirk: a tool version, a path length limit, a locale or line-ending issue>`
