import assert from 'node:assert/strict';
import test from 'node:test';
import { matchesGlob } from '../src/glob.js';

test('matches simple file globs', () => {
  assert.equal(matchesGlob('README.md', 'README*'), true);
  assert.equal(matchesGlob('docs/README.md', 'README*'), false);
});

test('matches recursive globs', () => {
  assert.equal(matchesGlob('docs/reference/guide.md', 'docs/**/*.md'), true);
  assert.equal(matchesGlob('src/index.ts', 'docs/**/*.md'), false);
});

test('matches directory prefix globs', () => {
  assert.equal(matchesGlob('dist/bundle.js', 'dist/**'), true);
  assert.equal(matchesGlob('src/dist/file.js', 'dist/**'), false);
});
