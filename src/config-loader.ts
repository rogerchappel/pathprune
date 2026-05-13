import fs from 'node:fs/promises';
import path from 'node:path';
import type { PathPruneConfig } from './types.js';

export async function loadProjectConfig(root: string): Promise<Partial<PathPruneConfig>> {
  const configPath = path.join(path.resolve(root), '.pathprunerc.json');
  try {
    const raw = await fs.readFile(configPath, 'utf8');
    const parsed = JSON.parse(raw) as Partial<PathPruneConfig>;
    validateConfig(parsed, configPath);
    return parsed;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return {};
    }
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON in ${configPath}: ${error.message}`);
    }
    throw error;
  }
}

function validateConfig(config: Partial<PathPruneConfig>, configPath: string): void {
  for (const key of ['duplicatePathGlobs', 'deadFileGlobs', 'ignoredCandidateGlobs'] as const) {
    const value = config[key];
    if (value !== undefined && (!Array.isArray(value) || value.some((entry) => typeof entry !== 'string'))) {
      throw new Error(`Invalid ${key} in ${configPath}; expected an array of strings.`);
    }
  }

  for (const key of ['largeFileBytes', 'maxFindings'] as const) {
    const value = config[key];
    if (value !== undefined && (!Number.isInteger(value) || value < 0)) {
      throw new Error(`Invalid ${key} in ${configPath}; expected a non-negative integer.`);
    }
  }
}
