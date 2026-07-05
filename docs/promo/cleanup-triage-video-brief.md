# PathPrune Cleanup Triage Video Brief

## Core angle

Show a maintainer turning an uncertain cleanup into an inspectable preview:
duplicate docs, stale backup files, and generated artifacts are surfaced without
PathPrune deleting or rewriting anything.

## 45-second outline

1. Start with a small repo fixture containing `README.md`, `docs/README.md`,
   `notes.old`, and `dist/app.log`.
2. Run `bash demo/run-cleanup-triage.sh`.
3. Highlight the text preview: rule kind, severity, path, and recommendation.
4. Switch to the JSON report and show that automation can verify expected
   finding kinds while humans still decide what changes to make.
5. Close on the safety model: local files only, ignore-aware scanning, stable
   ordering, and `safeToRemove: false` for v1 findings.

## Suggested social hook

"Repo cleanup should start with evidence, not deletion. PathPrune gives agents
and maintainers a deterministic preview of duplicate docs, dead files, generated
artifacts, and large-file candidates."

## Grounding facts

- CLI commands are `pathprune init`, `pathprune check`, and `pathprune explain`.
- Output formats include text and JSON.
- The CLI skips `.git/` and `node_modules/` by default and does not make
  destructive changes.
- The demo verifies `duplicate-path`, `dead-file`, and `ignored-candidate` findings.
