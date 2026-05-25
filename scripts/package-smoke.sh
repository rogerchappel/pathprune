#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

cd "$ROOT_DIR"
npm run build >/dev/null
npm pack --pack-destination "$TMP_DIR" >/dev/null
PACKAGE_TGZ="$(find "$TMP_DIR" -maxdepth 1 -name 'pathprune-*.tgz' -print -quit)"
test -n "$PACKAGE_TGZ"

mkdir -p "$TMP_DIR/app"
cd "$TMP_DIR/app"
npm init -y >/dev/null
npm install "$PACKAGE_TGZ" >/dev/null

npx pathprune --help >/dev/null
mkdir -p demo/docs
printf '# Demo\n' > demo/README.md
printf '# Nested\n' > demo/docs/README.md
npx pathprune init demo >/dev/null
npx pathprune check demo --format json --max-findings 10 > "$TMP_DIR/report.json"
grep -q '"kind": "duplicate-path"' "$TMP_DIR/report.json"
