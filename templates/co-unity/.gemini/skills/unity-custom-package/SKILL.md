---
name: unity-custom-package
description: >
  Scaffolds and configures custom Unity packages (UPM) for Git-URL distribution — package.json
  manifests, folder structure, assembly definitions, tests, samples, versioning, .meta discipline,
  and editor tooling. Use when: creating a Unity package, converting existing scripts into a
  reusable module, sharing code across projects, or reviewing a package's layout — even when the
  word "package" is never said.
version: 0.1.0
scope: co-unity
status: active
owner: code-writer
last_reviewed: 2026-09-01
prerequisites: The package's name, display name, contents, minimum editor version, and dependencies are known or can be asked for.
relates_to:
  - skill: test-driven-development
    type: composes_with
  - skill: refactoring
    type: relates_to
gemini-parity: skip
metadata:
  type: domain
  triggers:
    - unity package
    - upm
    - custom package
    - package manifest
    - package.json
    - reusable unity module
    - share code across unity projects
---

## Context

Unity's Package Manager (UPM) installs packages directly from a **package repository's** Git URL,
which is the most common way teams share reusable code without running a private registry.

A well-structured package is easy to install, version, test, and maintain. A poorly structured one
causes mysterious compiler errors, missing references, and hours of debugging. The difference is
almost entirely in the initial scaffolding — getting the folder structure, the manifest, and the
assembly definitions right from the start.

> **Distribution channel vs. project version control.** UPM's Git-URL install is a *distribution
> channel for the package repository*, and it is entirely independent of how the **consuming**
> project is version-controlled. Projects in this variant are on Plastic SCM (Unity Version
> Control) and are checked in with `cm.exe` via the `plastic-checkin` skill; a package this skill
> scaffolds is still consumed by URL, and its own repository is whatever the package's home
> demands. The `.gitignore` and tag instructions below apply to the **package repo only** — they
> are never instructions about the consuming project's working copy, which never uses them.

## When to Use

**Creating a new package**:
- Trigger: "make this a package", "set up a Unity package", "we need this in two projects".
- Use case: full scaffold — layout, manifest, assemblies, tests, samples, changelog.

**Converting existing scripts into a package**:
- Trigger: "extract this into a reusable module".
- Use case: pick the layout, define the assemblies, then move files *with their `.meta` files*.

**Reviewing or repairing a package**:
- Trigger: "this package won't compile after install", "references break for consumers".
- Use case: work the common-mistakes lists below — they are the usual causes.

**Not for**: general assembly-definition architecture in a normal project (that is the
assembly-definition guidance in the project's conventions), or publishing to a private registry.

---

## Execution Steps

### Step 1: Gather requirements

Ask; do not assume:

1. **Package name** — reverse-domain identifier (e.g. `com.studioname.utilities`). Lowercase,
   alphanumeric with dots and hyphens only.
2. **Display name** — the human-readable name in the Package Manager window.
3. **Contents** — runtime code, editor tools, both, samples?
4. **Minimum editor version** — which Unity version(s) must it support?
5. **Dependencies** — other UPM packages it needs.

### Step 2: Choose the repository layout

**Option A — package-at-root (default, for a dedicated package repo).** The repo root *is* the
package; consumers install from the repo URL directly.

```
my-package/                     ← repo root
├── package.json                ← UPM manifest (required)
├── README.md
├── LICENSE.md
├── CHANGELOG.md
├── Runtime/
│   ├── MyPackage.Runtime.asmdef
│   ├── AssemblyInfo.cs
│   └── *.cs
├── Editor/
│   ├── MyPackage.Editor.asmdef
│   └── *.cs
├── Tests/
│   ├── Runtime/  (asmdef + *.cs)
│   └── Editor/   (asmdef + *.cs)
├── Samples~/                   ← note the tilde
│   └── ExampleUsage/
├── Documentation~/
│   └── your-package-name.md
└── .gitignore                  ← package repo only
```

**Option B — package in a subdirectory** of a larger project repo, under `Packages/<name>/`.
Consumers append a path query to the install URL. Use it only when the package genuinely lives
inside an existing project; Option A is simpler for consumers and does not make them download the
whole project.

### Step 3: Write `package.json`

The single most important file. Unity reads it for identity, version, dependencies, and
compatibility.

```json
{
  "name": "com.studioname.mypackage",
  "version": "0.1.0",
  "displayName": "My Package",
  "description": "Brief description of what the package does.",
  "unity": "2021.3",
  "unityRelease": "0f1",
  "documentationUrl": "<package home>#readme",
  "changelogUrl": "<package home>/CHANGELOG.md",
  "licensesUrl": "<package home>/LICENSE.md",
  "dependencies": {},
  "keywords": ["utility", "tools"],
  "author": { "name": "Studio Name", "email": "contact@example.com", "url": "https://example.com" },
  "samples": [
    { "displayName": "Example Usage", "description": "Basic setup and usage.", "path": "Samples~/ExampleUsage" }
  ]
}
```

| Field | Required | Notes |
|---|---|---|
| `name` | Yes | Reverse-domain, lowercase, 3–214 chars. Must start with a TLD-style prefix (`com.`, `org.`, `net.`). Never start with `com.unity.` — that is reserved. |
| `version` | Yes | Semver. Start at `0.1.0` for pre-release. |
| `displayName` | Yes | Shown in the Package Manager UI. Concise. |
| `description` | Yes | One or two sentences; also shown in the UI. |
| `unity` | Recommended | Minimum editor version, e.g. `"2021.3"`. |
| `unityRelease` | Optional | Specific release within that version, e.g. `"0f1"`. |
| `dependencies` | Recommended | UPM package name → version. |
| `samples` | Optional | Paths must use `Samples~/` and match the directory exactly. |
| `author`, `keywords` | Optional | Author object; search terms. |

**Common mistakes**: uppercase in `name` (rejected silently); omitting `unity` (installs, then
fails to compile on older editors with no clear error); a `samples` path that does not match the
`Samples~/` directory including the tilde; listing non-UPM dependencies (asset-store plugins do not
belong here).

### Step 4: Define the assemblies

Every package **must** have assembly definitions. Without them the package's scripts land in the
default assembly and lose every isolation benefit that makes a package work.

Name them to mirror the package: `StudioName.MyPackage.Runtime`, `.Editor`, `.Tests.Runtime`,
`.Tests.Editor` (or the `com.studioname.mypackage.runtime` style) — pick one style and hold it.

- **Runtime**: no `includePlatforms` restriction; `references: []` unless it genuinely needs one.
- **Editor**: `includePlatforms: ["Editor"]`, references the runtime assembly. The dependency is
  **one-way — Editor → Runtime, never the reverse.**
- **Tests**: `overrideReferences: true` plus `precompiledReferences: ["nunit.framework.dll"]`,
  `autoReferenced: false`, `defineConstraints: ["UNITY_INCLUDE_TESTS"]`, and references to
  `UnityEngine.TestRunner` / `UnityEditor.TestRunner`. The `test-driven-development` skill carries
  the full template and the EditMode/PlayMode split.

To test `internal` types without widening them, add `Runtime/AssemblyInfo.cs`:

```csharp
using System.Runtime.CompilerServices;

[assembly: InternalsVisibleTo("StudioName.MyPackage.Tests.Runtime")]
```

Always generate this file when the package includes tests.

### Step 5: Samples~ and Documentation~

The trailing tilde is significant: Unity ignores directories ending in `~` on import, so sample
code does not compile as part of the package. Consumers import samples from the Package Manager UI,
which copies them into the project's samples folder. Each sample is a subdirectory of `Samples~/`,
listed in `package.json` with a matching `path`, self-contained, with a small README of its own.

`Documentation~/` holds markdown docs — at minimum a file named after the package covering
installation, basic usage, and an API overview. `documentationUrl` controls the "View
documentation" link in the Package Manager.

### Step 6: Versioning and changelog

Semver, strictly:

- **MAJOR** — breaking API changes: renamed or removed public types and methods, and **changed
  serialized field names**, which break saved data in every consuming project.
- **MINOR** — new backwards-compatible features and public API.
- **PATCH** — bug fixes, internal refactoring, documentation.

Start at `0.1.0`; the `0.x` range signals "API may change without notice". Keep `CHANGELOG.md` in
Keep-a-Changelog format with real dates, never placeholders.

Consumers can pin a version by tagging the **package repo** and appending the tag to the install
URL. That tag is part of the distribution channel; it says nothing about the consuming project's
version control.

### Step 7: `.meta` discipline — the two classic failures

**Never ignore `.meta` files in the package repo.** Unity tracks every asset and script by the GUID
in its `.meta`; strip them and references break the moment someone installs the package. This is
the single most common mistake in URL-distributed Unity packages.

A minimal package-repo ignore list covers IDE noise (`.idea/`, `.vs/`, `*.csproj`, `*.sln`), OS
noise (`.DS_Store`, `Thumbs.db`), and — only if the repo also contains a test project — the
generated Unity folders (`Library/`, `Temp/`, `Obj/`, `Build/`, `Builds/`, `Logs/`,
`MemoryCaptures/`, `UserSettings/`). Nothing else.

**Generate the `.meta` files before the first commit.** A package scaffolded from a terminal has no
`.meta` files yet — Unity creates them on import. So: open a Unity project that has the package in
its `Packages/` folder (embedded, or by local path in `manifest.json`), let it import, confirm a
`.meta` exists for every file **and every folder** (a folder's own `.meta` lives in the parent
directory), then commit them. Missing `.meta` files on the first commit is the second most common
packaging mistake — everything works locally and breaks for everyone else.

### Step 8: Editor tooling (if the package has any)

Editor-only code — inspectors, editor windows, property drawers, menu items — goes in `Editor/`
behind its editor-only assembly.

- Never reference editor assemblies from runtime code.
- Use the editor's own GUI utilities and styles so the tooling blends in.
- Store editor preferences in editor prefs or a settings provider, **not** in ScriptableObjects
  inside the package — installed packages are immutable and cannot save assets into themselves.
- Expose package configuration through a settings provider registered into Project Settings.

### Step 9: Scaffold, then hand back

1. Create the directory structure for what the package actually needs — always `Runtime/`,
   `package.json`, `README.md`; add `Editor/`, `Tests/`, `Samples~/`, `Documentation~/` as required.
2. Generate `package.json` with the real name, display name, and namespace — never leave
   `MyPackage` placeholders in the output.
3. Generate one `.asmdef` per code directory, and `Runtime/AssemblyInfo.cs` when there are tests.
4. Generate the package-repo ignore file and `CHANGELOG.md` with today's actual date.
5. Create placeholder scripts with the correct namespaces if starter code was asked for.
6. Remind the human to open the package in Unity to generate `.meta` files before the first commit.

Include consumer install instructions in the package README: add the package from the repo's Git
URL in the Package Manager, or add the URL as a dependency entry in the consuming project's
`Packages/manifest.json`. Substitute the real URL and package name.

---

## Output Format

```markdown
## Package scaffold — <com.studioname.mypackage> — <YYYY-MM-DD>
Layout: <package-at-root | subdirectory>  ·  Minimum editor: <version>

### Files created (absolute paths)
- <path>  — <one line>

### Assemblies
| Assembly | Platforms | References | Notes |
|---|---|---|---|

### Outstanding — human action required
- [ ] Open the package in Unity to generate `.meta` files, then commit them.
- [ ] <anything else that could not be decided without the human>

### Consumer install
<the exact URL / manifest entry>
```

When repairing rather than scaffolding, report instead: what was wrong, the file and field that
caused it, and what changed — one line each.

---

## Related Skills

- **test-driven-development** — test assembly layout, the EditMode/PlayMode split, and the bound
  gates that verify the package compiles.
- **refactoring** — `.meta` GUID stability and assembly boundaries when moving code into a package.
- **documentation-writing** — for the package README and `Documentation~/` content.
- **plastic-checkin** — for checking the *consuming* project's changes in; the package repo's own
  history is out of scope for it.
