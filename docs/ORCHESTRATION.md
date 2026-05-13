# Orchestration Notes

PathPrune is designed for humans and agents that need a small, reviewable cleanup map before touching a repository.

## Agent workflow

1. Run `pathprune check <repo> --format json`.
2. Treat every finding as a hypothesis, not an instruction.
3. Group possible cleanup by finding kind and owning area.
4. Inspect references manually before deleting anything.
5. Make one narrow cleanup commit at a time.
6. Re-run the project test suite and PathPrune.

## Exit-code policy

- `0`: clean enough for the configured policy.
- `1`: warning findings exceeded `maxFindings`.
- `2`: invalid CLI input, root, or config.

## Recommended CI use

Use PathPrune as an advisory check at first:

```sh
pathprune check . --format text --max-findings 999
```

Once a repo is clean, lower `--max-findings` or commit `.pathprunerc.json` with an appropriate policy.

## Boundaries

PathPrune should remain:

- deterministic
- local-only
- dependency-light
- fixture-backed
- non-destructive
