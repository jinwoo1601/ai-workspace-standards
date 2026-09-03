# Workflow state

One row per active branch. This file is the only board: the PM reads it at the start of every session and cross-checks it against `cm.exe status --header`; if they disagree, another session may be mid-flight — warn the human and wait for their call, never correct this file silently. A row is added at G0 (design track) or when a feature branch is created, its `stage` carries each gate with its date, and the row is removed once the branch has merged (main then holds the result). The daily session log `memory/YYYY-MM-DD.md` keeps the narrative — what was ruled, by whom, and why. Committed by `vc-checkin` as its own changeset, never together with work.

Stage vocabulary — design track: `scope → design-doc → locked(G1 <date>) → backlog → merged`. Feature track: `requirements → architecture → plan → implement → review → preflight → accepted(G2 <date>) → codex → merged`.

| branch | track | stage | last changeset | next action |
|--------|-------|-------|----------------|-------------|
