# PathPrune Tasks

## Completed for v0.1.0

- [x] Scaffold OSS TypeScript CLI package with StackForge.
- [x] Add deterministic scan contracts and public API.
- [x] Implement simple glob matching for local cleanup patterns.
- [x] Implement conservative `.gitignore` support.
- [x] Walk only the requested root and skip ignored directories.
- [x] Detect duplicate path names for docs/artifacts.
- [x] Detect backup, obsolete, generated, and large-file candidates.
- [x] Render text and JSON reports.
- [x] Add `check`, `run`, `init`, and `explain` commands.
- [x] Add fixture-backed tests for clean, warning, generated, and ignored cases.
- [x] Add safety, README, contributing, and orchestration docs.
- [x] Add smoke and validation scripts.

## Next

- [ ] Support richer `.gitignore` edge cases without sacrificing conservatism.
- [ ] Add optional content hashing for duplicate files.
- [ ] Add SARIF or Markdown report output if users ask for CI annotations.
- [ ] Publish npm package after initial repository review.

## Not planned for v1

- [ ] Automatic deletion.
- [ ] Hosted dashboards.
- [ ] Telemetry.
- [ ] LLM-based classification.
