#!/usr/bin/env node
import { runCli } from '../dist/src/cli.js';

runCli(process.argv).catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 2;
});
