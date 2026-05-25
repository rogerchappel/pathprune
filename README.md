# PathPrune 🌿

PathPrune is a local-first TypeScript CLI that scouts for repo cleanup candidates without deleting anything.

It is intentionally conservative: it honors ignore rules, scans only the directory you name, produces deterministic output, and leaves every cleanup decision to a human or reviewing agent.

## What it finds

- **Duplicate paths** — repeated names such as `README.md` or docs pages that often drift apart.
- **Dead-file candidates** — obvious backup cruft like `*.bak`, `*.old`, `*.orig`, `*~`, and OS artifacts.
- **Generated-file candidates** — files like `dist/**`, `coverage/**`, and `*.log` that may belong in ignore rules.
- **Large-file candidates** — tracked blobs that deserve a quick sanity check.

PathPrune never deletes, rewrites, stages, uploads, or phones home.

## Install

```sh
npm install -g pathprune
```

For local development:

```sh
git clone https://github.com/rogerchappel/pathprune.git
cd pathprune
npm install
npm run build
```

## CLI

```sh
pathprune --help
pathprune init ./demo
pathprune check ./demo --format text
pathprune check ./demo --format json
pathprune explain
```

`check` exits with:

- `0` when no warning-level findings exceed policy.
- `1` when warning-level findings exceed policy.
- `2` for invalid input, config, or CLI usage.

Use `--max-findings <n>` to allow a small number of warning findings before exit `1`.

## Example

```sh
npm run build
node bin/pathprune.js check fixtures/duplicate-docs --format text
```

Example output excerpt:

```text
PathPrune cleanup preview
Safety: preview only; no files were changed.
1. [warning] duplicate-path: README.md
   Recommendation: Compare content and references before consolidating. PathPrune never deletes for you.
```

## Configuration

Create a starter config:

```sh
pathprune init .
```

This writes `.pathprunerc.json` if one does not already exist. Supported keys mirror the default config:

```json
{
  "duplicatePathGlobs": ["README*", "docs/**/*.md"],
  "deadFileGlobs": ["**/*.bak", "**/*.old"],
  "ignoredCandidateGlobs": ["dist/**", "*.log"],
  "largeFileBytes": 1048576,
  "maxFindings": 0
}
```

## Safety guarantees

- Reads only the requested root.
- Skips `.git/` and `node_modules/` by default.
- Applies simple `.gitignore` rules.
- Produces stable ordering for repeatable agent handoffs.
- Marks every v1 finding as `safeToRemove: false`.
- Does not include telemetry, network calls, or destructive commands.

See [docs/SAFETY.md](docs/SAFETY.md) for the fuller safety model.

## Verify

```sh
npm test
npm run check
npm run build
npm run smoke
npm run package:smoke
bash scripts/validate.sh
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Small, reviewable PRs with fixture-backed tests are very welcome.

## License

MIT
