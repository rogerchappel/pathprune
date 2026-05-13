# Changelog

All notable changes to PathPrune will be documented in this file.

This project follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and semantic versioning when versioned releases are published.

## [Unreleased]

### Added

- TypeScript CLI with `check`, `run`, `init`, and `explain` commands.
- Deterministic text and JSON cleanup preview reports.
- Ignore-aware file walking with built-in `.git/` and `node_modules/` skips.
- Duplicate-path, dead-file, generated-file, and large-file candidate detection.
- Fixture-backed tests and smoke checks.
- Safety, orchestration, and contribution documentation.

### Security

- Non-destructive v1 safety model: no delete, move, rewrite, staging, telemetry, or network behavior.

[Unreleased]: https://github.com/rogerchappel/pathprune/compare/HEAD...HEAD
