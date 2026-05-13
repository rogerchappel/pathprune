import fs from 'node:fs/promises';
import path from 'node:path';
import { createConfigJson } from './config.js';

export async function initProject(target: string): Promise<string> {
  const root = path.resolve(target);
  const configPath = path.join(root, '.pathprunerc.json');
  await fs.mkdir(root, { recursive: true });

  try {
    await fs.writeFile(configPath, createConfigJson(), { flag: 'wx' });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'EEXIST') {
      return `PathPrune config already exists: ${configPath}\n`;
    }
    throw error;
  }

  return `Created PathPrune config: ${configPath}\n`;
}
