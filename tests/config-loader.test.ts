import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { loadProjectConfig } from '../src/config-loader.js';
import { initProject } from '../src/init.js';

test('init writes a config once and preserves existing config', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'pathprune-init-'));
  const first = await initProject(root);
  const second = await initProject(root);
  assert.match(first, /Created PathPrune config/);
  assert.match(second, /already exists/);
});

test('loads validated project config', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'pathprune-config-'));
  await fs.writeFile(path.join(root, '.pathprunerc.json'), '{"maxFindings":2}\n');
  assert.deepEqual(await loadProjectConfig(root), { maxFindings: 2 });
});
