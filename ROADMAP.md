# Roadmap

## Now

- Keep v0.1 focused on deterministic local cleanup previews.
- Harden fixture-backed tests around ignore handling and duplicate docs.
- Gather real-world examples from small OSS repositories.

## Next

- Optional content hashing to identify exact duplicate files.
- Markdown report output for PR comments and agent handoffs.
- More `.gitignore` compatibility where it can remain conservative and deterministic.
- Config presets for docs-heavy repos, CLIs, and generated-site projects.

## Later

- SARIF output for advisory CI annotations.
- Workspace-level multi-package summaries.
- Baseline files so teams can ratchet cleanup findings down over time.

## Not Planned

- Automatic deletion or mutation.
- Telemetry.
- Hosted dashboards.
- LLM-dependent classification.
