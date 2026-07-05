# Cleanup Triage Demo

This walkthrough shows how to use PathPrune as a non-destructive first pass
before a repository cleanup PR. It creates a disposable project with duplicate
docs, backup notes, and generated output, then asks PathPrune for a preview.

## Run the demo

```sh
bash demo/run-cleanup-triage.sh
```

The script builds the local CLI, writes a temporary fixture, runs text output
for a human reviewer, and checks JSON output for the expected finding kinds.

## What to review

- `duplicate-path` findings are review prompts. Compare the files and incoming
  links before consolidating anything.
- `dead-file` findings point to obvious backup or editor residue such as
  `.old`, `.bak`, `.orig`, and `~` files.
- `ignored-candidate` findings identify tracked build or log output that may
  belong in ignore rules.

PathPrune marks v1 findings as `safeToRemove: false`, so the demo is useful for
issue triage and PR scoping without implying that a file should be deleted
automatically.

## CI adaptation

For a soft gate, allow a small findings budget while teams are cleaning up:

```sh
pathprune check . --format json --max-findings 10 > pathprune-report.json
```

Attach the JSON report to a PR or release checklist and lower the budget as
the repository gets cleaner.
