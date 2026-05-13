# Safety Model

PathPrune is a scout, not a janitor with a chainsaw.

## Non-destructive by design

PathPrune v1 does not provide delete, move, rewrite, stage, or apply commands. It only reports candidates and recommendations.

Every finding includes:

- `safeToRemove: false`
- evidence strings
- a manual-review recommendation
- stable path-oriented context

## Local-first behavior

PathPrune performs no network calls and has no telemetry. It reads files below the explicit scan root and uses local config only.

## Ignore handling

PathPrune always skips `.git/` and `node_modules/`. It also supports simple `.gitignore` patterns, including basename rules, directory rules, and `*`/`**` globs. Negated ignore rules are intentionally not followed in v1 because conservative skipping is safer than surprising reads.

## Determinism

Output is sorted by severity, path, and finding kind. The report timestamp is a fixed sentinel so fixture snapshots and agent handoffs remain reproducible.

## Human review checklist

Before removing anything PathPrune reports:

1. Confirm the file is reproducible or truly obsolete.
2. Search for references in docs, scripts, CI, packages, and examples.
3. Prefer a commit that removes one cleanup category at a time.
4. Run tests after cleanup.
5. Keep rollback simple.
