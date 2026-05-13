import assert from 'node:assert/strict';
import test from 'node:test';
import { createIgnoreMatcher, parseIgnoreFile } from '../src/ignore.js';

test('parses comments blank lines and negations conservatively', () => {
  assert.deepEqual(parseIgnoreFile('# hi\n\ndist/\n!important.txt\n*.log\n'), ['dist/', '*.log']);
});

test('always ignores git and node_modules directories', () => {
  const matcher = createIgnoreMatcher([]);
  assert.equal(matcher.isIgnored('.git/config'), true);
  assert.equal(matcher.isIgnored('node_modules/pkg/index.js'), true);
});

test('matches directory and basename ignore rules', () => {
  const matcher = createIgnoreMatcher(['dist/', '*.log']);
  assert.equal(matcher.isIgnored('dist/bundle.js'), true);
  assert.equal(matcher.isIgnored('logs/app.log'), true);
  assert.equal(matcher.isIgnored('src/index.ts'), false);
});
