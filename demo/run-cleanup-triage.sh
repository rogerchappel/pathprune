#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
workspace="$(mktemp -d "${TMPDIR:-/tmp}/pathprune-triage.XXXXXX")"
trap 'rm -rf "$workspace"' EXIT

mkdir -p "$workspace/project/docs" "$workspace/project/dist"
cat >"$workspace/project/README.md" <<'DOC'
# Demo Project
DOC
cat >"$workspace/project/docs/README.md" <<'DOC'
# Demo Docs
DOC
cat >"$workspace/project/notes.old" <<'DOC'
temporary notes
DOC
cat >"$workspace/project/dist/app.log" <<'DOC'
generated log output
DOC

cd "$repo_root"
npm run build >/dev/null

echo "== Text cleanup triage =="
node bin/pathprune.js check "$workspace/project" --format text --max-findings 10

echo
echo "== JSON cleanup triage =="
node bin/pathprune.js check "$workspace/project" --format json --max-findings 10 >"$workspace/pathprune-report.json"
node -e '
  const fs = require("node:fs");
  const report = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
  const rules = new Set(report.findings.map((finding) => finding.kind));
  for (const expected of ["duplicate-path", "dead-file", "ignored-candidate"]) {
    if (!rules.has(expected)) {
      console.error(`missing expected finding: ${expected}`);
      process.exit(1);
    }
  }
  console.log(`verified ${report.findings.length} preview findings in JSON output`);
' "$workspace/pathprune-report.json"
