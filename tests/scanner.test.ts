import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import { exitCodeForReport, scan } from '../src/index.js';

const fixtureRoot = path.resolve('fixtures');

test('clean fixture exits cleanly', async () => {
  const report = await scan({ root: path.join(fixtureRoot, 'clean') });
  assert.equal(report.summary.filesScanned, 2);
  assert.equal(report.findings.length, 0);
  assert.equal(exitCodeForReport(report), 0);
});

test('duplicate docs fixture reports duplicate paths and dead files', async () => {
  const report = await scan({ root: path.join(fixtureRoot, 'duplicate-docs') });
  assert.equal(exitCodeForReport(report), 1);
  assert.ok(report.findings.some((finding) => finding.kind === 'duplicate-path' && finding.path === 'README.md'));
  assert.ok(report.findings.some((finding) => finding.kind === 'dead-file' && finding.path === 'unused/notes.bak'));
});

test('generated artifacts fixture reports ignore candidates', async () => {
  const report = await scan({ root: path.join(fixtureRoot, 'generated-artifacts') });
  assert.ok(report.findings.some((finding) => finding.kind === 'ignored-candidate' && finding.path === 'app.log'));
  assert.ok(report.findings.some((finding) => finding.kind === 'ignored-candidate' && finding.path === 'dist/bundle.js'));
});

test('node_modules fixture is skipped by built-in ignore rules', async () => {
  const report = await scan({ root: path.join(fixtureRoot, 'ignored-node') });
  assert.equal(report.summary.filesScanned, 1);
  assert.equal(report.summary.ignoredFilesSkipped, 1);
});
