import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import { formatJson, formatText, scan } from '../src/index.js';

test('text format includes safety preview language', async () => {
  const report = await scan({ root: path.resolve('fixtures/duplicate-docs') });
  const text = formatText(report);
  assert.match(text, /Safety: preview only; no files were changed\./);
  assert.match(text, /human review required/);
});

test('json format is parseable and deterministic', async () => {
  const report = await scan({ root: path.resolve('fixtures/clean') });
  const parsed = JSON.parse(formatJson(report));
  assert.equal(parsed.summary.generatedAt, '1970-01-01T00:00:00.000Z');
  assert.deepEqual(parsed.findings, []);
});
